@extends('web.admin.layout.app')
@section('title', 'Apartment Details')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h1>Apartment #{{ $apartment->id }} — {{ $apartment->title }}</h1>
    <div>
        <a href="{{ route('admin.apartments') }}" class="btn btn-outline-secondary">Back to list</a>
    </div>
</div>

{{-- Ensure global helper exists early so inline onclick handlers always work --}}
<script>
    window.openVerificationLightbox = function(src, alt) {
        try {
            var lightbox = document.getElementById('verificationLightbox');
            var lightboxImg = document.getElementById('verificationLightboxImg');
            if (!lightbox || !lightboxImg) return;

            function show(url) {
                lightboxImg.src = url || '';
                lightboxImg.alt = alt || 'Preview';
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                lightbox.querySelector('.inner').focus();
                lightboxImg.classList.remove('zoomed');
            }

            // Probe the URL first to detect tracking-prevention blocking
            var probe = new Image();
            probe.crossOrigin = 'anonymous';
            probe.onload = function() { show(src); };
            probe.onerror = function() {
                // Try fetching the resource via same-origin fetch and create a blob URL
                fetch(src, { credentials: 'same-origin' }).then(function(res) {
                    if (!res.ok) throw new Error('fetch failed');
                    return res.blob();
                }).then(function(blob) {
                    var blobUrl = URL.createObjectURL(blob);
                    show(blobUrl);
                }).catch(function(err) {
                    console.error('verification preview failed', err);
                    // last-resort: still attempt to show the original src
                    show(src);
                });
            };
            probe.src = src;
        } catch (e) {
            console.error('openVerificationLightbox error', e);
        }
    };
    // global close helper
    window.closeVerificationLightbox = function() {
        try {
            var lightbox = document.getElementById('verificationLightbox');
            var lightboxImg = document.getElementById('verificationLightboxImg');
            if (!lightbox || !lightboxImg) return;
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            if (lightboxImg.src && lightboxImg.src.startsWith('blob:')) {
                try { URL.revokeObjectURL(lightboxImg.src); } catch(e) {}
            }
            lightboxImg.src = '';
            lightboxImg.alt = '';
        } catch (e) {
            console.error('closeVerificationLightbox error', e);
        }
    };
</script>

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
 
                    <div class="text-muted">Not open for tour</div>
                @endif


                <h5 class="card-title">Bookings</h5>
                @if($apartment->bookings && $apartment->bookings->count())
                    <table class="table table-sm">

                    @push('scripts')
                    <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const lightbox = document.getElementById('verificationLightbox');
                        const inner = lightbox.querySelector('.inner');
                        const lightboxImg = document.getElementById('verificationLightboxImg');
                        const closeBtn = lightbox.querySelector('.close-btn');

                        let scale = 1;
                        let translate = { x: 0, y: 0 };
                        let isDragging = false;
                        let dragStart = { x: 0, y: 0 };
                        let prevTranslate = { x: 0, y: 0 };

                        function applyTransform() {
                            lightboxImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
                        }

                        function resetTransform() {
                            scale = 1;
                            translate = { x: 0, y: 0 };
                            prevTranslate = { x: 0, y: 0 };
                            lightboxImg.style.transform = '';
                            lightboxImg.style.cursor = '';
                            inner.style.overflow = 'auto';
                        }

                        function openLightbox(src, alt) {
                            resetTransform();
                            lightboxImg.src = src;
                            lightboxImg.alt = alt || 'Preview';
                            lightbox.classList.add('active');
                            lightbox.setAttribute('aria-hidden', 'false');
                            inner.focus();
                        }

                        function closeLightbox() {
                            lightbox.classList.remove('active');
                            lightbox.setAttribute('aria-hidden', 'true');
                            // revoke any object URL created previously
                            try { if (lightboxImg.src && lightboxImg.src.startsWith('blob:')) URL.revokeObjectURL(lightboxImg.src); } catch(e){}
                            lightboxImg.src = '';
                            lightboxImg.alt = '';
                            resetTransform();
                        }

                        // toggle zoom: single click toggles between 1 and 2
                        function toggleZoom() {
                            if (scale === 1) {
                                scale = 2;
                                inner.style.overflow = 'hidden';
                                lightboxImg.style.cursor = 'grab';
                            } else {
                                resetTransform();
                            }
                            applyTransform();
                        }

                        // pointer / mouse handlers for panning when zoomed
                        lightboxImg.addEventListener('mousedown', function(e) {
                            if (scale <= 1) return;
                            isDragging = true;
                            dragStart = { x: e.clientX, y: e.clientY };
                            prevTranslate = { x: translate.x, y: translate.y };
                            lightboxImg.style.cursor = 'grabbing';
                            e.preventDefault();
                        });

                        document.addEventListener('mousemove', function(e) {
                            if (!isDragging) return;
                            const dx = e.clientX - dragStart.x;
                            const dy = e.clientY - dragStart.y;
                            translate.x = prevTranslate.x + dx;
                            translate.y = prevTranslate.y + dy;
                            applyTransform();
                        });

                        document.addEventListener('mouseup', function() {
                            if (!isDragging) return;
                            isDragging = false;
                            lightboxImg.style.cursor = 'grab';
                        });

                        // touch events for mobile panning
                        lightboxImg.addEventListener('touchstart', function(e) {
                            if (scale <= 1) return;
                            if (e.touches.length === 1) {
                                isDragging = true;
                                dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                                prevTranslate = { x: translate.x, y: translate.y };
                            }
                        }, { passive: true });

                        lightboxImg.addEventListener('touchmove', function(e) {
                            if (!isDragging || e.touches.length !== 1) return;
                            const dx = e.touches[0].clientX - dragStart.x;
                            const dy = e.touches[0].clientY - dragStart.y;
                            translate.x = prevTranslate.x + dx;
                            translate.y = prevTranslate.y + dy;
                            applyTransform();
                            e.preventDefault();
                        }, { passive: false });

                        lightboxImg.addEventListener('touchend', function(e) {
                            isDragging = false;
                        });

                        // click handlers
                        document.querySelectorAll('img.verification-preview-img').forEach(img => {
                            img.style.cursor = 'zoom-in';
                            img.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                const src = this.src;
                                const alt = this.alt || '';
                                openLightbox(src, alt);
                            });
                        });

                        // overlay and close button
                        lightbox.addEventListener('click', function(e) {
                            if (e.target === lightbox) closeLightbox();
                        });
                        closeBtn.addEventListener('click', function(e) { e.stopPropagation(); closeLightbox(); });

                        // image click toggles zoom
                        lightboxImg.addEventListener('click', function(e) {
                            e.stopPropagation();
                            // If clicking after dragging, ignore (to avoid immediate toggle)
                            if (isDragging) return;
                            toggleZoom();
                        });

                        // ESC to close
                        document.addEventListener('keydown', function(e) {
                            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
                        });
                    });
                    </script>
                    @endpush
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
                                            <img class="verification-preview-img" src="{{ route('admin.apartments.verification.preview', $doc) }}" alt="{{ $label }}" onclick="openVerificationLightbox(this.src, this.alt)">
                                        @else
                                            {{-- non-image: show file icon + filename --}}
                                            <div class="file-icon">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#6c757d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M14 2V8H20" stroke="#6c757d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <div class="file-meta text-muted small mt-2">{{ basename($doc->file_path ?? ($doc->path ?? 'document')) }}</div>
                                            </div>
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
                                            // use controller proxy routes to avoid direct storage URLs being blocked
                                            $b64 = base64_encode($metaPath);
                                            $previewUrl = route('admin.apartments.verification.preview_meta', $apartment) . '?p=' . urlencode($b64);
                                            $downloadUrl = route('admin.apartments.verification.download_meta', $apartment) . '?p=' . urlencode($b64);
                                            $mime = $docEntry['mime'] ?? null;
                                        @endphp
                                        <div class="verification-tile w-100">
                                        @if($mime && \Illuminate\Support\Str::startsWith($mime, 'image/'))
                                            <img class="verification-preview-img" src="{{ $previewUrl }}" alt="{{ $label }}" onclick="openVerificationLightbox(this.src, this.alt)">
                                        @else
                                            <div class="file-icon">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#6c757d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M14 2V8H20" stroke="#6c757d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <div class="file-meta text-muted small mt-2">{{ basename($metaPath) }}</div>
                                            </div>
                                        @endif
                                        </div>
                                        <div class="mt-2 w-100 d-flex justify-content-between align-items-center">
                                            <small class="text-muted">Stored in meta</small>
                                            <div>
                                                <a href="{{ $downloadUrl }}" class="btn btn-sm btn-outline-secondary">Download</a>
                                            </div>
                                        </div>
                                    @elseif($metaDocPath)
                                        @php
                                            // if metaDocPath is a storage path or URL (older fallback)
                                            $url = \Illuminate\Support\Str::startsWith($metaDocPath, ['http://','https://']) ? $metaDocPath : null;
                                            $b64 = $url ? base64_encode($metaDocPath) : null;
                                            $previewUrl = $b64 ? route('admin.apartments.verification.preview_meta', $apartment) . '?p=' . urlencode($b64) : null;
                                            $downloadUrl = $b64 ? route('admin.apartments.verification.download_meta', $apartment) . '?p=' . urlencode($b64) : ($url ?? null);
                                        @endphp
                                        <div class="verification-tile w-100">
                                            <div class="file-icon">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#6c757d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M14 2V8H20" stroke="#6c757d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <div class="file-meta text-muted small mt-2">{{ basename($metaDocPath) }}</div>
                                            </div>
                                        </div>
                                        <div class="mt-2 w-100 d-flex justify-content-between align-items-center">
                                            <small class="text-muted">Stored in meta</small>
                                            <div>
                                                @if($downloadUrl)
                                                    <a href="{{ $downloadUrl }}" class="btn btn-sm btn-outline-secondary">Download</a>
                                                @else
                                                    <span class="text-muted small">No file</span>
                                                @endif
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

<!-- Verification lightbox -->
<div id="verificationLightbox" class="verification-lightbox" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="inner" tabindex="-1">
    <button class="close-btn" aria-label="Close preview" onclick="closeVerificationLightbox()?false:void(0)">✕</button>
        <img id="verificationLightboxImg" src="" alt="Preview">
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
    .verification-tile img { width: 100%; height: 100%; object-fit: contain; display: block; background: #f8f9fa; padding: 6px; }
    .verification-tile embed { width: 100%; height: 160px; }
    .file-icon { display:flex; flex-direction:column; align-items:center; justify-content:center; color:#6c757d; }
    .file-icon svg { opacity:0.9; }
    .file-meta { max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    /* Lightbox / full-screen preview */
    .verification-lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.8); display:none; align-items:center; justify-content:center; z-index:1200; }
    .verification-lightbox.active { display:flex; }
    .verification-lightbox .inner { position:relative; max-width:96vw; max-height:96vh; overflow:auto; display:flex; align-items:center; justify-content:center; }
    .verification-lightbox .inner img { max-width:100%; max-height:100%; display:block; }
    .verification-lightbox .close-btn { position:absolute; top:8px; right:8px; background:rgba(255,255,255,0.9); border:none; border-radius:4px; padding:6px 8px; cursor:pointer; }
    .verification-lightbox .inner img.zoomed { transform:scale(2); cursor:zoom-out; }
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
