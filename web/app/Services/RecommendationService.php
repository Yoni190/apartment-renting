<?php

namespace App\Services;

use App\Models\Apartment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RecommendationService
{
    /**
     * Recommend apartments based on filters, scoring and behavior boosts.
     *
     * @param array $filters  Supported: location, min_price, max_price, bedrooms, property_type, furnished, limit
     * @param \App\Models\User|null $user
     * @return \Illuminate\Support\Collection
     */
    public function recommend(array $filters = [], $user = null)
    {
        $limit = isset($filters['limit']) ? intval($filters['limit']) : 10;

        // Base query: only active and admin-approved listings
        $query = Apartment::where('status', 1)
            ->where('verification_status', 'approved');

        // Apply strict filters to reduce candidate set (DB side)
        if (!empty($filters['bedrooms'])) {
            $query->where('bedrooms', intval($filters['bedrooms']));
        }

        if (!empty($filters['min_price'])) {
            // attempt numeric comparison
            $min = $this->parsePrice($filters['min_price']);
            if (!is_null($min)) {
                $query->whereRaw('CAST(REGEXP_REPLACE(COALESCE(price, "0"), "[^0-9\\.]+", "") AS DECIMAL(12,2)) >= ?', [$min]);
            }
        }

        if (!empty($filters['max_price'])) {
            $max = $this->parsePrice($filters['max_price']);
            if (!is_null($max)) {
                $query->whereRaw('CAST(REGEXP_REPLACE(COALESCE(price, "0"), "[^0-9\\.]+", "") AS DECIMAL(12,2)) <= ?', [$max]);
            }
        }

        if (!empty($filters['property_type'])) {
            // property_type often stored in meta
            $query->whereJsonContains('meta->property_type', $filters['property_type']);
        }

        if (isset($filters['furnished'])) {
            $val = $filters['furnished'];
            // accept boolean-ish or string
            $query->where(function ($q) use ($val) {
                $q->where('meta->furnishing', $val)
                  ->orWhere('meta->furnishing', $val === 'true' ? 'yes' : $val);
            });
        }

        // Eager load relations needed by client
        $candidates = $query->with(['images','owner'])->get();

        if ($candidates->isEmpty()) {
            return collect();
        }

        // Gather behavior metrics for boosts
        $favoriteCounts = DB::table('favorites')
            ->select('apartment_id', DB::raw('count(*) as cnt'))
            ->whereIn('apartment_id', $candidates->pluck('id'))
            ->groupBy('apartment_id')
            ->pluck('cnt', 'apartment_id');

        $bookingCounts = DB::table('tour_bookings')
            ->select('listing_id', DB::raw('count(*) as cnt'))
            ->whereIn('listing_id', $candidates->pluck('id'))
            ->groupBy('listing_id')
            ->pluck('cnt', 'listing_id');

        $userFavorites = collect();
        $userBookings = collect();
        if ($user) {
            $userFavorites = DB::table('favorites')
                ->where('user_id', $user->id)
                ->whereIn('apartment_id', $candidates->pluck('id'))
                ->pluck('apartment_id');

            $userBookings = DB::table('tour_bookings')
                ->where('user_id', $user->id)
                ->whereIn('listing_id', $candidates->pluck('id'))
                ->pluck('listing_id');
        }

        // Scoring weights
        $weights = [
            'location' => 30,
            'price' => 25,
            'bedrooms' => 20,
            'type' => 15,
            'furnished' => 10,
            'recent' => 10,
        ];

        $scored = $candidates->map(function ($apt) use ($filters, $favoriteCounts, $bookingCounts, $userFavorites, $userBookings, $weights) {
            $score = 0;
            $reasons = [];

            // Location match (simple substring match against address)
            if (!empty($filters['location'])) {
                $loc = strtolower($filters['location']);
                if (!empty($apt->address) && strpos(strtolower($apt->address), $loc) !== false) {
                    $score += $weights['location'];
                    $reasons[] = 'location_match';
                }
            }

            // Price: if min/max provided, check within range
            if ((!empty($filters['min_price']) || !empty($filters['max_price'])) && !empty($apt->price)) {
                $aptPrice = $this->parsePrice($apt->price);
                if (!is_null($aptPrice)) {
                    $min = $this->parsePrice($filters['min_price'] ?? null);
                    $max = $this->parsePrice($filters['max_price'] ?? null);
                    $within = true;
                    if (!is_null($min) && $aptPrice < $min) $within = false;
                    if (!is_null($max) && $aptPrice > $max) $within = false;
                    if ($within) {
                        $score += $weights['price'];
                        $reasons[] = 'price_match';
                    } else {
                        // partial credit if within 20% of boundary
                        if (!is_null($min) && $aptPrice < $min && $aptPrice >= ($min * 0.8)) {
                            $score += intval($weights['price'] * 0.5);
                        }
                        if (!is_null($max) && $aptPrice > $max && $aptPrice <= ($max * 1.2)) {
                            $score += intval($weights['price'] * 0.5);
                        }
                    }
                }
            }

            // Bedrooms
            if (!empty($filters['bedrooms'])) {
                $req = intval($filters['bedrooms']);
                if (!empty($apt->bedrooms)) {
                    if (intval($apt->bedrooms) === $req) {
                        $score += $weights['bedrooms'];
                        $reasons[] = 'bedroom_exact';
                    } elseif (abs(intval($apt->bedrooms) - $req) === 1) {
                        $score += intval($weights['bedrooms'] * 0.5);
                    }
                }
            }

            // Property type
            if (!empty($filters['property_type'])) {
                $ptype = $apt->meta['property_type'] ?? null;
                if ($ptype && strtolower($ptype) === strtolower($filters['property_type'])) {
                    $score += $weights['type'];
                    $reasons[] = 'type_match';
                }
            }

            // Furnished
            if (isset($filters['furnished'])) {
                $filt = strtolower($filters['furnished']);
                $aptf = strtolower(strval($apt->meta['furnishing'] ?? ''));
                if ($aptf !== '' && strpos($aptf, $filt) !== false) {
                    $score += $weights['furnished'];
                    $reasons[] = 'furnished_match';
                }
            }

            // Recent
            if ($apt->created_at && $apt->created_at >= Carbon::now()->subDays(7)) {
                $score += $weights['recent'];
                $reasons[] = 'recent_post';
            }

            // Behavior boosts
            $favCount = $favoriteCounts[$apt->id] ?? 0;
            $bookCount = $bookingCounts[$apt->id] ?? 0;

            // Small popularity boost based on favorites/bookings
            $popBoost = intval(min(20, ($favCount * 2) + ($bookCount * 1)));
            if ($popBoost > 0) {
                $score += $popBoost;
            }

            // Personal boosts
            // if user favorited this listing
            if ($userFavorites->contains($apt->id)) {
                $score += 15;
            }
            // if user booked this listing before
            if ($userBookings->contains($apt->id)) {
                $score += 10;
            }

            // attach computed metadata
            $apt->recommendation_score = $score;
            $apt->recommendation_reasons = $reasons;
            $apt->favorite_count = $favCount;
            $apt->booking_count = $bookCount;

            return $apt;
        });

        // If user has no personal history and no filters, use popularity+recent fallback
        $hasHistory = ($user && ($userFavorites->isNotEmpty() || $userBookings->isNotEmpty()));

        if (!$hasHistory && empty($filters)) {
            // sort by favorite_count desc then recent
            $sorted = $scored->sortByDesc(function ($a) {
                return [$a->favorite_count, $a->created_at];
            });
        } else {
            // sort by computed score desc
            $sorted = $scored->sortByDesc('recommendation_score');
        }

        return $sorted->values()->take($limit);
    }

    protected function parsePrice($price)
    {
        if (is_null($price)) return null;
        if (is_numeric($price)) return floatval($price);
        // strip non-numeric except dot
        $clean = preg_replace('/[^0-9\.]/', '', (string) $price);
        if ($clean === '') return null;
        return floatval($clean);
    }
}
