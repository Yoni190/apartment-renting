@extends('web.admin.layout.app')
@section('title', 'Apartment Details')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h1>Apartment #{{ $apartment->id }} — {{ $apartment->title }}</h1>
    <div>
        <a href="{{ route('admin.apartments') }}" class="btn btn-outline-secondary">Back to list</a>
    </div>
</div>

<div class="row justify-content-center">
    <div class="col-md-10">
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Images</h5>
                @if($apartment->images && $apartment->images->count())
                    <div id="apartmentCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            @foreach($apartment->images as $idx => $img)
                                <div class="carousel-item {{ $idx === 0 ? 'active' : '' }}">
                                    <img src="{{ asset('storage/' . $img->path) }}" class="d-block w-100 admin-apartment-image" alt="Apartment Image">
                                </div>
                            @endforeach
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#apartmentCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#apartmentCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                @else
                    <div class="text-muted">No images uploaded for this listing.</div>
                @endif

                <hr/>

                <h5 class="card-title">Description</h5>
                <p>{{ $apartment->description }}</p>

                <h6>Address</h6>
                <p>{{ $apartment->address }}</p>

                {{-- Owner summary (moved into main column for better balance) --}}
                <hr/>
                <h5 class="card-title">Owner</h5>
                <div class="mb-2"><strong>Name</strong>
                    <div>{{ optional($apartment->owner)->name ?? ($apartment->meta['owner_name'] ?? '—') }}</div>
                </div>
                <div class="mb-2"><strong>Email</strong>
                    <div>{{ optional($apartment->owner)->email ?? ($apartment->meta['owner_email'] ?? '—') }}</div>
                </div>
                <div class="mb-2"><strong>Phone</strong>
                    <div>{{ optional($apartment->owner)->phone ?? ($apartment->meta['owner_phone'] ?? ($apartment->meta['contact_phone'] ?? '—')) }}</div>
                </div>

                <div class="row">
                    <div class="col-md-4"><strong>Price</strong><div>{{ $apartment->price }}</div></div>
                    <div class="col-md-4"><strong>Size</strong><div>{{ $apartment->size }}</div></div>
                    <div class="col-md-4"><strong>Bedrooms</strong><div>{{ $apartment->bedrooms }}</div></div>
                </div>

                <div class="row mt-3">
                    <div class="col-md-4"><strong>Bathrooms</strong><div>{{ $apartment->bathrooms }}</div></div>
                    <div class="col-md-4"><strong>Featured</strong><div>{{ $apartment->is_featured ? 'Yes' : 'No' }}</div></div>
                    <div class="col-md-4"><strong>Status</strong><div>{{ $apartment->status ? 'Active' : 'Inactive' }}</div></div>
                </div>

                <hr/>

                <h5 class="card-title">Availability / Open-for-tour</h5>
                @php
                    $meta = is_array($apartment->meta) ? $apartment->meta : [];
                    $oft = $meta['open_for_tour'] ?? null;
                @endphp
                @if(!empty($oft) && is_array($oft))
                    @php
                        try {
                            $fromDate = $oft['date_from'] ? \Carbon\Carbon::parse($oft['date_from'])->format('M d, Y') : null;
                            $toDate = $oft['date_to'] ? \Carbon\Carbon::parse($oft['date_to'])->format('M d, Y') : null;
                            $timeFrom = $oft['time_from'] ?? null;
                            $timeTo = $oft['time_to'] ?? null;
                        } catch (Exception $e) {
                            $fromDate = $oft['date_from'] ?? null;
                            $toDate = $oft['date_to'] ?? null;
                            $timeFrom = $oft['time_from'] ?? null;
                            $timeTo = $oft['time_to'] ?? null;
                        }
                    @endphp
                    <div><strong>Dates</strong>
                        <div>{{ $fromDate ?? '—' }} @if($toDate) — {{ $toDate }}@endif</div>
                    </div>
                    <div class="mt-1"><strong>Times</strong>
                        <div>{{ $timeFrom ?? '—' }} @if($timeTo) — {{ $timeTo }}@endif</div>
                    </div>
                @elseif($apartment->openHours && $apartment->openHours->count())
                    <ul>
                        @foreach($apartment->openHours as $oh)
                            @php
                                // day_of_week stored as integer or string; attempt to show readable label
                                $dow = $oh->day_of_week ?? $oh->day ?? null;
                                $dayLabel = is_numeric($dow) ? \Carbon\Carbon::create()->startOfWeek()->addDays($dow)->format('l') : ($dow ?: 'Day');
                            @endphp
                            <li>{{ $dayLabel }}: {{ $oh->start_time ?? $oh->from_time ?? '—' }} - {{ $oh->end_time ?? $oh->to_time ?? '—' }}</li>
                        @endforeach
                    </ul>
                @else
                    <div class="text-muted">Not open for tour</div>
                @endif


                <h5 class="card-title">Bookings</h5>
                @if($apartment->bookings && $apartment->bookings->count())
                    <table class="table table-sm">
                        <thead>
                            <tr><th>ID</th><th>Client</th><th>Scheduled At</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            @foreach($apartment->bookings as $b)
                                <tr>
                                    <td>{{ $b->id }}</td>
                                    <td>{{ optional($b->client)->name }}</td>
                                    <td>{{ $b->scheduled_at ?? ($b->date_time ?? '—') }}</td>
                                    <td>{{ $b->status ?? '—' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <div class="text-muted">No bookings for this listing.</div>
                @endif

            </div>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Verification & Identity</h5>
                <div><strong>Verification status:</strong> {{ $apartment->verification_status ?? '—' }}</div>
                <div><strong>Verified at:</strong> {{ $apartment->verified_at ?? '—' }}</div>
                <div><strong>Rejection reason:</strong> {{ $apartment->rejection_reason ?? '—' }}</div>
                <div><strong>Verified by admin (meta):</strong>
                    @if(is_array($apartment->meta) && array_key_exists('verified_by_admin', $apartment->meta))
                        <div>
                            <div><strong>ID:</strong> {{ $apartment->meta['verified_by_admin']['id'] ?? '—' }}</div>
                            <div><strong>Name:</strong> {{ $apartment->meta['verified_by_admin']['name'] ?? '—' }}</div>
                            <div><strong>Email:</strong> {{ $apartment->meta['verified_by_admin']['email'] ?? '—' }}</div>
                        </div>
                    @else
                        —
                    @endif
                </div>
                <hr/>
                <h6>Owner-supplied information</h6>
                @php
                    // normalize meta
                    $meta = is_array($apartment->meta) ? $apartment->meta : [];
                    $location = $meta['location'] ?? ($meta['address'] ?? null);
                    if (is_string($location)) {
                        $maybe = json_decode($location, true);
                        if (is_array($maybe)) $location = $maybe;
                    }
                    $utilities = $meta['utilities'] ?? [];
                    if (is_string($utilities)) {
                        $u = json_decode($utilities, true); if (is_array($u)) $utilities = $u;
                    }
                    $amenities = $meta['amenities'] ?? [];
                    if (is_string($amenities)) {
                        $a = json_decode($amenities, true); if (is_array($a)) $amenities = $a;
                    }
                    $unique = $meta['unique_features'] ?? ($meta['unique_features'] ?? []);
                    if (is_string($unique)) {
                        $u2 = json_decode($unique, true); if (is_array($u2)) $unique = $u2;
                    }
                @endphp

                <div style="background:#f8f9fa; padding:12px; border-radius:6px;">
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <strong>Location</strong>
                            @if(is_array($location) && count($location))
                                <div class="mt-1">
                                    <div><strong>City:</strong> {{ $location['city'] ?? '—' }}</div>
                                    <div><strong>Sub-city:</strong> {{ $location['sub_city'] ?? '—' }}</div>
                                    <div><strong>Area:</strong> {{ $location['area'] ?? '—' }}</div>
                                    <div><strong>Landmark:</strong> {{ $location['landmark'] ?? '—' }}</div>
                                    @if(!empty($location['latitude']) && !empty($location['longitude']))
                                        <div class="mt-2"><a target="_blank" class="btn btn-sm btn-outline-primary" href="https://www.google.com/maps/search/?api=1&query={{ $location['latitude'] }},{{ $location['longitude'] }}">View in map</a></div>
                                    @endif
                                </div>
                            @else
                                <div class="text-muted">Not provided</div>
                            @endif
                        </div>

                        <div class="col-md-6 mb-2">
                            <strong>Utilities</strong>
                            <div class="mt-1">
                                @if(!empty($utilities) && count($utilities))
                                    @foreach($utilities as $ut)
                                        <span class="badge bg-secondary me-1">{{ $ut }}</span>
                                    @endforeach
                                @else
                                    <div class="text-muted">None provided</div>
                                @endif
                            </div>
                        </div>

                        <div class="col-md-6 mb-2">
                            <strong>Amenities</strong>
                            <div class="mt-1">
                                @if(!empty($amenities) && count($amenities))
                                    @foreach($amenities as $am)
                                        <span class="badge bg-info text-dark me-1">{{ $am }}</span>
                                    @endforeach
                                @else
                                    <div class="text-muted">None provided</div>
                                @endif
                            </div>
                        </div>

                        <div class="col-md-6 mb-2">
                            <strong>Unique features</strong>
                            <div class="mt-1">
                                @if(!empty($unique) && count($unique))
                                    @foreach($unique as $uf)
                                        <span class="badge bg-success me-1">{{ $uf }}</span>
                                    @endforeach
                                @else
                                    <div class="text-muted">None provided</div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>

                <hr/>
                <h5 class="card-title">Verification Documents</h5>
                @php
                    // canonical expected document keys used by controllers
                    $expectedDocs = [
                        'national_id' => 'National ID',
                        'ownership_certificate' => 'Ownership certificate',
                        'utility_bill' => 'Utility bill',
                        'rental_authorization_letter' => 'Rental authorization letter',
                        'agent_authorization_letter' => 'Agent authorization letter',
                    ];
                    // try to determine whether the listing is an agent listing
                    $isAgent = false;
                    if(array_key_exists('is_agent', $meta)) $isAgent = (bool)$meta['is_agent'];
                    if(!$isAgent && !empty($meta['verification']['is_agent'])) $isAgent = (bool)$meta['verification']['is_agent'];
                @endphp

                <div class="row">
                    @foreach($expectedDocs as $type => $label)
                        @if($type === 'agent_authorization_letter' && !$isAgent)
                            @continue
                        @endif
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <div class="card-body d-flex flex-column align-items-start">
                                    <h6 class="mb-2">{{ $label }}</h6>
                                    @php
                                        $docEntry = $docsByType[$type] ?? null;
                                        // fallback: older meta shape where documents were stored under meta.verification.documents
                                        $metaDocPath = null;
                                        if(!empty($meta['verification']['documents'][$type] ?? null)) {
                                            $metaDocPath = $meta['verification']['documents'][$type];
                                        } elseif(!empty($meta[$type])) {
                                            $metaDocPath = $meta[$type];
                                        }
                                    @endphp

                                    @if($docEntry && !empty($docEntry['model']))
                                        @php $doc = $docEntry['model']; $mime = $docEntry['mime'] ?? null; @endphp
                                        <div class="verification-tile w-100">
                                        @if($mime && \Illuminate\Support\Str::startsWith($mime, 'image/'))
                                            <img src="{{ route('admin.apartments.verification.preview', $doc) }}" alt="{{ $label }}">
                                        @elseif($mime === 'application/pdf')
                                            <embed src="{{ route('admin.apartments.verification.preview', $doc) }}" type="application/pdf" width="100%" height="160" />
                                        @else
                                            <div class="text-muted p-3">Preview not available.</div>
                                        @endif
                                        </div>
                                        <div class="mt-2 w-100 d-flex justify-content-between align-items-center">
                                            <small class="text-muted">Uploaded: {{ $doc->created_at->diffForHumans() }}</small>
                                            <div>
                                                <a href="{{ route('admin.apartments.verification.download', $doc) }}" class="btn btn-sm btn-outline-secondary">Download</a>
                                            </div>
                                        </div>
                                    @elseif($docEntry && !empty($docEntry['meta_path']))
                                        @php
                                            $metaPath = $docEntry['meta_path'];
                                            $url = \Illuminate\Support\Str::startsWith($metaPath, ['http://','https://']) ? $metaPath : asset('storage/' . ltrim($metaPath, '/'));
                                            $mime = $docEntry['mime'] ?? null;
                                        @endphp
                                        <div class="verification-tile w-100">
                                        @if($mime && \Illuminate\Support\Str::startsWith($mime, 'image/'))
                                            <img src="{{ $url }}" alt="{{ $label }}">
                                        @elseif($mime === 'application/pdf')
                                            <embed src="{{ $url }}" type="application/pdf" width="100%" height="160" />
                                        @else
                                            <div class="text-muted p-3">Stored in meta.</div>
                                        @endif
                                        </div>
                                        <div class="mt-2 w-100 d-flex justify-content-between align-items-center">
                                            <small class="text-muted">Stored in meta</small>
                                            <div>
                                                <a href="{{ $url }}" download class="btn btn-sm btn-outline-secondary">Download</a>
                                            </div>
                                        </div>
                                    @elseif($metaDocPath)
                                        @php
                                            // if metaDocPath is a storage path or URL (older fallback)
                                            $url = \Illuminate\Support\Str::startsWith($metaDocPath, ['http://','https://']) ? $metaDocPath : asset('storage/' . ltrim($metaDocPath, '/'));
                                        @endphp
                                        <div class="verification-tile w-100">
                                            <div class="text-muted p-3">Stored in meta.</div>
                                        </div>
                                        <div class="mt-2 w-100 d-flex justify-content-between align-items-center">
                                            <small class="text-muted">Stored in meta</small>
                                            <div>
                                                <a href="{{ $url }}" download class="btn btn-sm btn-outline-secondary">Download</a>
                                            </div>
                                        </div>
                                    @else
                                        <div class="text-muted">Not provided</div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

            </div>
        </div>

    </div>

</div>
</div>

<!-- Reject Modal -->
<div class="modal fade" id="rejectModal" tabindex="-1" aria-labelledby="rejectModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="rejectModalLabel">Reject Listing #{{ $apartment->id }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="{{ route('admin.apartments.reject', $apartment) }}" method="POST">
                @csrf
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="rejection_reason" class="form-label">Rejection Reason</label>
                        <textarea id="rejection_reason" name="rejection_reason" class="form-control" rows="4" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-danger">Reject Listing</button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection

@push('styles')
<style>
    .admin-action-bar { z-index: 1100; }
    .admin-apartment-image { height: 300px; object-fit: cover; }
    .admin-apartment-image + .carousel-caption { display: none; }
    .badge { font-size: 0.8rem; padding: 0.45em 0.6em; }
    /* Verification tile styling: fixed-height preview area with contained image/pdf */
    .verification-tile { height: 160px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e9ecef; border-radius: 6px; overflow: hidden; }
    .verification-tile img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .verification-tile embed { width: 100%; height: 160px; }
</style>
@endpush

@push('scripts')
<script>
// (Optional) prevent double submits
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.admin-action-bar form');
    forms.forEach(f => f.addEventListener('submit', () => {
        const btn = f.querySelector('button[type=submit]');
        if (btn) btn.disabled = true;
    }));
});
</script>
@endpush

{{-- Persistent action bar fixed to bottom of viewport --}}
<div class="admin-action-bar fixed-bottom bg-white border-top p-3 d-flex justify-content-end gap-2">
    <form action="{{ route('admin.apartments.edit', $apartment) }}" method="GET">
        <button type="submit" class="btn btn-outline-primary">Edit</button>
    </form>

    <form action="{{ route('admin.apartments.approve', $apartment) }}" method="POST">
        @csrf
        <button type="submit" class="btn btn-success">Approve</button>
    </form>

    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#rejectModal">Reject</button>

    <form action="{{ route('admin.apartments.destroy', $apartment) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this apartment?');">
        @csrf
        @method('DELETE')
        <button type="submit" class="btn btn-outline-danger">Delete</button>
    </form>
</div>
