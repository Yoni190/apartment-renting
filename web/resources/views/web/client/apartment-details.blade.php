@extends('web.client.layout.app')

@section('title', $apartment->title)

@push('styles')
<style>
/* Hero Image */
.apartment-hero {
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
}
.apartment-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Card Sections */
.info-card {
    border-radius: 12px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

/* Price Box */
.price-box {
    border-radius: 12px;
    padding: 20px;
    background: #f8f9fa;
    text-align: center;
}

/* Meta badges */
.badge-soft {
    background: #eef2ff;
    color: #4f46e5;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
}

/* Review stars */
.bi-star-fill {
    font-size: 0.9rem;
}
.bi-star {
    font-size: 0.9rem;
}

/* Review hover effect */
.info-card .border-bottom:hover {
    background: #f9fafb;
    border-radius: 8px;
    padding: 10px;
    transition: 0.2s ease;
}

/* Rating number */
.info-card h3 {
    color: #111827;
}
/* Interactive stars */
.star {
    font-size: 1.4rem;
    color: #d1d5db;
    cursor: pointer;
    transition: 0.2s;
}

.star.active,
.star.hovered {
    color: #f59e0b;
}
.review-item {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
@endpush

@section('content')

<div class="container my-5">

    <!-- Title -->
    <div class="mb-3">
        <h2 class="fw-bold">{{ $apartment->title }}</h2>
        <p class="text-muted mb-1">
            <i class="bi bi-geo-alt"></i> {{ $apartment->address }}
        </p>
    </div>

    <!-- Hero Image -->
    <div class="apartment-hero mb-4">
        @if($apartment->images && $apartment->images->count() > 0)
            <img src="{{ asset('storage/' . $apartment->images->first()->path) }}" alt="">
        @else
            <img src="https://via.placeholder.com/1200x400?text=No+Image" alt="">
        @endif
    </div>

    <div class="row g-4">

        <!-- LEFT SIDE -->
        <div class="col-lg-8">

            <!-- Overview -->
            <div class="info-card mb-4">
                <h5 class="fw-bold mb-3">Overview</h5>

                <div class="d-flex gap-3 mb-3 flex-wrap">
                    <span class="badge-soft">{{ $apartment->bedrooms }} Bedrooms</span>
                    <span class="badge-soft">{{ $apartment->bathrooms }} Bathrooms</span>
                    <span class="badge-soft">{{ $apartment->size }} m²</span>
                </div>

                <p class="text-muted">
                    {{ $apartment->description }}
                </p>
            </div>

            <!-- Details -->
            <div class="info-card mb-4">
                <h5 class="fw-bold mb-3">Details</h5>

                <div class="row">
                    <div class="col-md-6 mb-2">
                        <strong>Status:</strong> 
                        {{ $apartment->status ? 'Available' : 'Not Available' }}
                    </div>

                    <div class="col-md-6 mb-2">
                        <strong>Verification:</strong> 
                        {{ ucfirst($apartment->verification_status) }}
                    </div>

                    <div class="col-md-6 mb-2">
                        <strong>Listed On:</strong> 
                        {{ \Carbon\Carbon::parse($apartment->created_at)->format('M d, Y') }}
                    </div>

                    <div class="col-md-6 mb-2">
                        <strong>Featured:</strong> 
                        {{ $apartment->is_featured ? 'Yes' : 'No' }}
                    </div>
                </div>
            </div>

            <!-- Reviews -->
            <div id="reviewsContainer">
                @forelse($apartment->reviews->take(3) as $review)
                    <div class="mb-3 pb-3 border-bottom review-item">

                        <div class="d-flex justify-content-between">
                            <strong>{{ $review->user->name ?? 'Anonymous' }}</strong>

                            <div>
                                @for($i = 1; $i <= 5; $i++)
                                    <i class="bi {{ $i <= $review->rating ? 'bi-star-fill text-warning' : 'bi-star text-muted' }}"></i>
                                @endfor
                            </div>
                        </div>

                        <small class="text-muted">
                            {{ $review->created_at->diffForHumans() }}
                        </small>

                        <p class="mt-2 text-muted mb-0">
                            {{ $review->comment }}
                        </p>
                    </div>
                @empty
                    <p class="text-muted mb-0">No reviews yet.</p>
                @endforelse
            </div>

            @if($apartment->reviews->count() > 3)
                <button id="loadMoreBtn" class="btn btn-outline-primary w-100 mt-2">
                    Show More Reviews
                </button>
            @endif

            <hr>

            <h6 class="fw-bold mb-3">Leave a Review</h6>

            @auth
            <form action="{{ route('reviews.store') }}" method="POST">
                @csrf

                <input type="hidden" name="apartment_id" value="{{ $apartment->id }}">

                <!-- Star Rating -->
                <div class="mb-3">
                    <label class="form-label">Your Rating</label>
                    <div id="starRating" class="d-flex gap-1">
                        @for($i = 1; $i <= 5; $i++)
                            <i class="bi bi-star star" data-value="{{ $i }}"></i>
                        @endfor
                    </div>
                    <input type="hidden" name="rating" id="ratingInput" required>
                </div>

                <!-- Comment -->
                <div class="mb-3">
                    <label class="form-label">Your Review</label>
                    <textarea name="comment" class="form-control" rows="3" placeholder="Write your experience..." required></textarea>
                </div>

                <button class="btn btn-primary">
                    Submit Review
                </button>
            </form>
            @else
            <p class="text-muted">
                Please <a href="{{ route('login') }}">login</a> to leave a review.
            </p>
            @endauth

        </div>

        <!-- RIGHT SIDE -->
        <div class="col-lg-4">

            <!-- Price Box -->
            <div class="price-box mb-4">
                <h3 class="fw-bold text-primary">
                    ${{ number_format($apartment->price) }}
                </h3>
                <p class="text-muted mb-3">per month</p>

                <button class="btn btn-primary w-100 mb-2">
                    Contact Owner
                </button>

                <form action="{{ route('favorites.store') }}" method="POST">
                    @csrf

                    <input type="hidden" name="apartment_id" value="{{ $apartment->id }}">

                    <button type="submit" class="btn btn-outline-secondary w-100">
                        Save Listing
                    </button>
                </form>
            </div>

            <!-- Owner Info (optional if relation exists) -->
            @if(isset($apartment->owner))
            <div class="info-card">
                <h6 class="fw-bold mb-3">Owner</h6>
                <p class="mb-1">{{ $apartment->owner->name ?? 'Owner' }}</p>
                <small class="text-muted">Property Owner</small>
            </div>
            @endif

            <div class="card p-3 mt-3" style="border-radius:15px;">
                <h6 class="fw-bold mb-3">Available Tour Times</h6>

                @php
                    $daysMap = [
                        0 => 'Sunday',
                        1 => 'Monday',
                        2 => 'Tuesday',
                        3 => 'Wednesday',
                        4 => 'Thursday',
                        5 => 'Friday',
                        6 => 'Saturday',
                    ];

                    $grouped = $apartment->openHours
                        ->groupBy(fn($i) => $i->start_time . '-' . $i->end_time);
                @endphp

                @foreach($grouped as $key => $items)
                    @php
                        $days = $items->pluck('day_of_week')->sort()->values();
                    @endphp

                    <div class="border rounded p-2 mb-2">
                        <strong>
                            {{ $daysMap[$days->first()] }} - {{ $daysMap[$days->last()] }}
                        </strong>
                        <br>
                        <small class="text-muted">
                            {{ \Carbon\Carbon::parse($items->first()->start_time)->format('h:i A') }}
                            -
                            {{ \Carbon\Carbon::parse($items->first()->end_time)->format('h:i A') }}
                        </small>
                    </div>
                @endforeach
            </div>
            <form action="{{ route('tour.store', $apartment) }}" method="POST" class="mt-3">
                @csrf

                <input type="hidden" name="apartment_id" value="{{ $apartment->id }}">

                {{-- SELECT DAY --}}
                <div class="mb-2">
                    <label class="form-label">Select Day</label>
                    <select name="date" id="dateSelect" class="form-select" required>
                        @php
                            $today = \Carbon\Carbon::today();
                        @endphp
                        @foreach($apartment->openHours->unique('day_of_week') as $hour)
                            @php
                                $dayOfWeek = $hour->day_of_week;
                                // next date with this day
                                $nextDate = \Carbon\Carbon::today()->next($dayOfWeek);
                            @endphp
                            <option value="{{ $nextDate->format('Y-m-d') }}">
                                {{ \Carbon\Carbon::parse($nextDate)->format('l, M d') }}
                            </option>
                        @endforeach
                    </select>
                </div>

            {{-- SELECT TIME --}}
            <div class="mb-2">
                <label class="form-label">Select Time</label>
                <select name="time" id="timeSelect" class="form-select" required>
                    <option value="">Select a time</option>
                </select>
            </div>

                <button type="submit" class="btn btn-success w-100">
                    Request Tour
                </button>
            </form>

        </div>

    </div>

</div>

@endsection


@push('scripts')

<script>
document.addEventListener('DOMContentLoaded', function () {

    const openHours = @json($apartment->openHours);

    const dateSelect = document.querySelector('select[name="date"]');
    const timeSelect = document.getElementById('timeSelect');

    if (!dateSelect || !timeSelect) return; // safety

    function generateSlots(dateValue) {
        timeSelect.innerHTML = '<option value="">Select a time</option>';

        const selectedDate = new Date(dateValue);
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ...

        const slots = openHours.filter(h => Number(h.day_of_week) === dayOfWeek);

        slots.forEach(slot => {
            let current = new Date(`1970-01-01T${slot.start_time}`);
            let endTime = new Date(`1970-01-01T${slot.end_time}`);

            while (current < endTime) {
                let hours = String(current.getHours()).padStart(2, '0');
                let minutes = String(current.getMinutes()).padStart(2, '0');

                let option = document.createElement('option');
                option.value = `${hours}:${minutes}:00`;
                option.textContent = formatTime(current);

                timeSelect.appendChild(option);

                current.setMinutes(current.getMinutes() + 30);
            }
        });
    }

    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${ampm}`;
    }

    dateSelect.addEventListener('change', function () {
        generateSlots(this.value);
    });

    // trigger on load
    generateSlots(dateSelect.value);

});

// Star rating interaction
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('ratingInput');

let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = star.getAttribute('data-value');
        ratingInput.value = selectedRating;

        updateStars(selectedRating);
    });

    star.addEventListener('mouseover', () => {
        updateStars(star.getAttribute('data-value'));
    });

    star.addEventListener('mouseleave', () => {
        updateStars(selectedRating);
    });
});

function updateStars(rating) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}
</script>

<script>
    const allReviews = @json($apartment->reviews);
    let currentIndex = 3;
    const step = 3;

    const container = document.getElementById('reviewsContainer');
    const btn = document.getElementById('loadMoreBtn');

    if (btn) {
        btn.addEventListener('click', () => {

            const nextReviews = allReviews.slice(currentIndex, currentIndex + step);

            nextReviews.forEach(review => {

                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    stars += `<i class="bi ${i <= review.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}"></i>`;
                }

                const html = `
                    <div class="mb-3 pb-3 border-bottom review-item">
                        <div class="d-flex justify-content-between">
                            <strong>${review.user?.name ?? 'Anonymous'}</strong>
                            <div>${stars}</div>
                        </div>
                        <small class="text-muted">just now</small>
                        <p class="mt-2 text-muted mb-0">${review.comment}</p>
                    </div>
                `;

                container.insertAdjacentHTML('beforeend', html);
            });

            currentIndex += step;

            // Hide button if no more reviews
            if (currentIndex >= allReviews.length) {
                btn.style.display = 'none';
            }
        });
    }
</script>
@endpush