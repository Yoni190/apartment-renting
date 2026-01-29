@extends('web.admin.layout.app')
@section('title', 'Gojoye - Apartments')


@push('styles')
<style>
.range-container {
    position: relative;
    height: 40px;
}

.range-slider {
    position: absolute;
    width: 100%;
    pointer-events: none;
    -webkit-appearance: none;
    background: transparent;
}

.range-slider::-webkit-slider-thumb {
    pointer-events: all;
    height: 20px;
    width: 20px;
    background: #0d6efd;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
}

.slider-track {
    position: absolute;
    height: 6px;
    background: #d3d3d3;
    top: 8px;
    left: 0;
    right: 0;
    border-radius: 3px;
}

.slider-track-active {
    position: absolute;
    height: 6px;
    background: linear-gradient(90deg, #0d6efd, #007bff);
    top: 18px;
    border-radius: 3px;
}

#filterCard {
    transition: max-height 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
}

#filterCard.show {
    max-height: 2000px;
    opacity: 1;
}
/* Image Gallery Styles */
.apartment-image {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.apartment-image:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.image-preview-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
}

.more-images-badge {
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    cursor: pointer;
}

/* Modal Styles */
.image-modal img {
    max-height: 70vh;
    object-fit: contain;
}

.image-carousel img {
    height: 400px;
    object-fit: cover;
}
</style>



@endpush
@section('content')

<div class="d-flex justify-content-between align-items-center">
    <h1>Apartments</h1>
    <div>
        <button class="btn btn-secondary" id="toggleFilterBtn">Filter</button>
    <a href="{{ route('admin.apartments', ['verification_status' => 'pending']) }}" class="btn btn-warning">Pending verification</a>
        <a href="{{ route('admin.apartments.add') }}" class="btn btn-primary">
                Add Apartment
        </a>
        
    </div>
</div>

{{-- Filter Card --}}
    <div class="card shadow-sm mb-4" id="filterCard">
        <div class="card-header bg-light">
            <h5 class="mb-0">Filter Apartments</h5>
        </div>
        <div class="card-body">
            <form method="GET" action="{{ route('admin.apartments') }}" class="row g-3 align-items-end">

                <div class="col-md-4">
                    <label for="owner" class="form-label">Search by Owner</label>
                    <input type="text" name="owner" id="owner" value="{{ request('owner') }}" class="form-control" placeholder="Enter owner...">
                </div>
                <div class="col-md-4">
                    <label for="title" class="form-label">Search by Title</label>
                    <input type="text" name="title" id="title" value="{{ request('title') }}" class="form-control" placeholder="Enter title...">
                </div>

                <div class="col-md-4">
                    <label for="address" class="form-label">Search by Address</label>
                    <input type="text" name="address" id="address" value="{{ request('address') }}" class="form-control" placeholder="Enter address...">
                </div>

                <div class="col-md-4">
                    <label for="bedrooms" class="form-label">Search by Bedrooms</label>
                    <input type="text" name="bedrooms" id="bedrooms" value="{{ request('bedrooms') }}" class="form-control" placeholder="Enter bedrooms...">
                </div>

                <div class="col-md-4">
                    <label for="bathrooms" class="form-label">Search by Bathrooms</label>
                    <input type="text" name="bathrooms" id="bathrooms" value="{{ request('bathrooms') }}" class="form-control" placeholder="Enter bathrooms...">
                </div>


                <div class="col-md-4">
                    <label for="status" class="form-label">Status</label>
                    <select name="status" id="status" class="form-select">
                        <option value="">All</option>
                        <option value="0" {{ request('status') == '0' ? 'selected' : '' }}>Inactive</option>
                        <option value="1" {{ request('status') == '1' ? 'selected' : '' }}>Active</option>
                    </select>
                </div>

                <div class="col-md-12">
                    <label class="form-label">Price Range</label>

                    <div class="range-container">
                        <input type="range" id="minPrice" name="min_price"
                            min="0" max="{{ $max_price }}"
                            value="{{ request('min_price', 0) }}"
                            class="range-slider">

                        <input type="range" id="maxPrice" name="max_price"
                            min="0" max="{{ $max_price }}"
                            value="{{ request('max_price', $max_price) }}"
                            class="range-slider">

                        <div class="slider-track"></div>
                    </div>

                    <div class="d-flex justify-content-between small mt-1">
                        <span>Min: <strong id="minPriceValue">{{ request('min_price', 0) }}</strong></span>
                        <span>Max: <strong id="maxPriceValue">{{ request('max_price', $max_price) }}</strong></span>
                    </div>
                </div>

                <div class="col-md-12 mt-3">
                    <label class="form-label">Size Range (sq.m)</label>

                    <div class="range-container">
                        <input type="range" id="minSize" name="min_size"
                            min="0" max="{{ $max_size }}"
                            value="{{ request('min_size', 0) }}"
                            class="range-slider">

                        <input type="range" id="maxSize" name="max_size"
                            min="0" max="{{ $max_size }}"
                            value="{{ request('max_size', $max_size) }}"
                            class="range-slider">

                        <div class="slider-track"></div>
                    </div>

                    <div class="d-flex justify-content-between small mt-1">
                        <span>Min: <strong id="minSizeValue">{{ request('min_size', 0) }}</strong></span>
                        <span>Max: <strong id="maxSizeValue">{{ request('max_size', $max_size) }}</strong></span>
                    </div>
                </div>

                



                <div class="d-flex gap-2">
                    <div>
                        <form action="{{ route('admin.users') }}" method="GET">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-funnel"></i> Apply Filters
                            </button>
                        </form>
                        
                        <a href="{{ route('admin.apartments') }}" class="btn btn-outline-secondary">
                            <i class="bi bi-x-circle"></i> Reset
                        </a>
                    </div>

                    
                </div>
            </form>
        </div>
    </div>

<div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h5 class="mb-0">Apartments List</h5>
        </div>
        <div class="card-body table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Images</th>
                        <th>Title</th>
                        <th>Owner</th>
                        <th>Price</th>
                        <th>Address</th>
                        <th>Size</th>
                        <th>Bedrooms</th>
                        <th>Bathrooms</th>
                        <th>Featured Status</th>
                        <th>Status</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($apartments as $apartment)
                        <tr>
                            <td>{{ $apartment->id }}</td>
                              <td>
                                @if($apartment->images && $apartment->images->count() > 0)
                                    <div class="image-preview-container">
                                        @php
                                            $firstImage = $apartment->images->first();
                                            $totalImages = $apartment->images->count();
                                        @endphp
                                        <div class="position-relative">
                                            <img 
                                                src="{{ asset('storage/' . $firstImage->path) }}" 
                                                alt="Apartment Image"
                                                class="apartment-image"
                                                data-bs-toggle="modal" 
                                                data-bs-target="#imageModal"
                                                data-apartment-id="{{ $apartment->id }}"
                                                data-all-images='@json($apartment->images->map(function($img) { 
                                                    return [
                                                        'src' => asset('storage/' . $img->path),
                                                        'alt' => 'Apartment Image'
                                                    ];
                                                }))'
                                            >
                                            @if($totalImages > 1)
                                                <span class="position-absolute top-0 end-0 translate-middle badge bg-dark rounded-pill more-images-indicator">
                                                    +{{ $totalImages - 1 }}
                                                </span>
                                            @endif
                                        </div>
                                    </div>
                                @else
                                    <div class="text-center text-muted">
                                        <i class="bi bi-image" style="font-size: 2rem;"></i>
                                        <div class="small">No images</div>
                                    </div>
                                @endif
                            </td>
                            <td>{{ $apartment->title }}</td>
                            <td>{{ optional($apartment->owner)->name ?? '—' }}</td>
                            <td>{{ $apartment->price }}
                                <svg width="15" height="15" viewBox="0 0 1143 1278" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 ml-1 text-gray-600" data-state="closed"><path d="M738.75 0.0653076C832.888 0.0653076 909.376 17.128 968.213 51.2533C1028.23 84.2019 1072.35 133.036 1100.59 197.757C1128.84 261.301 1142.96 338.965 1142.96 430.75V1278H920.555V439.576C920.555 358.381 906.434 296.603 878.193 254.24C849.951 210.701 801.705 188.931 733.454 188.931C686.385 188.931 649.318 199.522 622.253 220.703C595.188 241.884 575.772 271.303 564.004 308.958C553.414 346.614 548.118 390.741 548.118 441.341V1278H325.715V427.22C325.715 342.495 339.836 268.361 368.078 204.817C397.496 140.097 442.212 90.0856 502.226 54.7836C562.239 18.3048 641.08 0.0653076 738.75 0.0653076Z" fill="currentColor"></path><path d="M726.148 822.07L71.3848 809.729L123.657 926.784L778.421 939.125L726.148 822.07Z" fill="currentColor"></path><path d="M654.763 616.216L0 603.875L52.2726 720.93L707.036 733.271L654.763 616.216Z" fill="currentColor"></path></svg>
                            </td>
                            <td>{{ $apartment->address }}</td>
                            <td>{{ $apartment->size }}</td>
                            <td>{{ $apartment->bedrooms }}</td>
                            <td>{{ $apartment->bathrooms }}</td>
                            <td>
                                @if($apartment->is_featured === 1)
                                    <form action="{{ route('admin.apartments.toggleFeatured', $apartment) }}" method="POST">
                                        @csrf
                                        @method('PATCH')
                                        <button style="all:unset;cursor:pointer">
                                            <span class="badge bg-success">Active</span>
                                        </button>
                                    </form>
                                @else
                                    <form action="{{ route('admin.apartments.toggleFeatured', $apartment) }}" method="POST">
                                        @csrf
                                        @method('PATCH')
                                        <button type="submit" style="all:unset;cursor:pointer">
                                            <span class="badge bg-danger">Inactive</span>
                                        </button>
                                    </form>
                                @endif
                            </td>
                            <td>
                                @if($apartment->status === 1)
                                    <span class="badge bg-success">Active</span>
                                @else
                                    <span class="badge bg-danger">Inactive</span>
                                @endif
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2">

                                    {{-- Toggle Status --}}
                                    <form action="{{ route('admin.apartments.toggleStatus', $apartment) }}" method="POST" class="status-form">
                                        @csrf
                                        @method('PATCH')
                                        <button type="submit" class="btn btn-sm btn-outline-warning" data-bs-toggle="tooltip" data-bs-placement="top" title="Change Status">
                                            <i class="bi bi-slash-circle"></i>
                                        </button>
                                    </form>

                                    {{-- Delete Apartment --}}
                                    <form action="{{ route('admin.apartments.destroy', $apartment) }}" method="POST" class="delete-form">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Apartment">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>

                                    {{-- Edit apartment --}}
                                    {{-- View apartment details --}}
                                    <form action="{{ route('admin.apartments.show', $apartment) }}" method="GET">
                                        <button type="submit" class="btn btn-sm btn-outline-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </form>

                                    {{-- Edit apartment --}}
                                    <form action="{{ route('admin.apartments.edit', $apartment) }}" method="GET">
                                        <button type="submit" class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Apartment">
                                            <i class="bi bi-pen"></i>
                                        </button>
                                    </form>

                                    @if($apartment->verification_status === 'pending')
                                            {{-- Approve --}}
                                            <form action="{{ route('admin.apartments.approve', $apartment) }}" method="POST">
                                                    @csrf
                                                    <button type="submit" class="btn btn-sm btn-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Approve Listing">
                                                            <i class="bi bi-check-lg"></i>
                                                    </button>
                                            </form>

                                            {{-- Reject: open modal to capture reason --}}
                                            <button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#rejectModal{{ $apartment->id }}" title="Reject Listing">
                                                    <i class="bi bi-x-lg"></i>
                                            </button>

                                            <!-- Reject Modal -->
                                            <div class="modal fade" id="rejectModal{{ $apartment->id }}" tabindex="-1" aria-labelledby="rejectModalLabel{{ $apartment->id }}" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="rejectModalLabel{{ $apartment->id }}">Reject Listing #{{ $apartment->id }}</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <form action="{{ route('admin.apartments.reject', $apartment) }}" method="POST">
                                                            @csrf
                                                            <div class="modal-body">
                                                                <div class="mb-3">
                                                                    <label for="rejection_reason{{ $apartment->id }}" class="form-label">Rejection Reason</label>
                                                                    <textarea id="rejection_reason{{ $apartment->id }}" name="rejection_reason" class="form-control" rows="4" required></textarea>
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
                                    @endif

                                </div>
                            </td>

                        </tr>
                    @empty
                        <tr>
                            <td colspan="12" class="text-center text-muted py-4">No apartments found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            {{-- Pagination --}}
            <div class="d-flex justify-content-center mt-3">
                {{ $apartments->onEachSide(1)->links('pagination::bootstrap-5') }}
            </div>
        </div>
    </div>

</div>

<!-- Image Modal -->
<div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="imageModalLabel">Apartment Images</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
                    <!-- Carousel Indicators -->
                    <div class="carousel-indicators" id="carousel-indicators">
                        <!-- Indicators will be dynamically added -->
                    </div>
                    
                    <!-- Carousel Items -->
                    <div class="carousel-inner" id="carousel-inner">
                        <!-- Images will be loaded here dynamically -->
                    </div>
                    
                    <!-- Carousel Controls -->
                    <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div class="modal-footer justify-content-center">
                <div id="imageCounter" class="text-muted fw-semibold"></div>
            </div>
        </div>
    </div>
</div>


@endsection

@push('scripts')

<!-- Show/Hide filter card -->
<script>
    document.addEventListener("DOMContentLoaded", () => {
        const toggleBtn = document.querySelector('#toggleFilterBtn')
        const filterCard = document.querySelector('#filterCard')

        toggleBtn.addEventListener('click', () => {
            filterCard.classList.toggle("show");
        })
    })
</script>

<!-- Warning for changing status of apartment -->
<script>
    document.querySelectorAll('.status-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault()

            Swal.fire({
                title: 'Are you sure?',
                text: "This will change the apartment's status!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, change it'
            }).then((result) => {
                if(result.isConfirmed) {
                    form.submit()
                }
            })
        })
    })
</script>

<!-- Warning for deleting an apartment -->
<script>
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault()

            Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the apartment!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it'
            }).then((result) => {
                if(result.isConfirmed) {
                    form.submit()
                }
            })
        })
    })
</script>

<!-- Script for price filter slider -->
<script>
    document.addEventListener("DOMContentLoaded", () => {
        const minSlider = document.getElementById("minPrice");
        const maxSlider = document.getElementById("maxPrice");
        const minValue = document.getElementById("minPriceValue");
        const maxValue = document.getElementById("maxPriceValue");
        const track = document.querySelector(".slider-track");

        function updateTrack() {
            const min = parseInt(minSlider.value);
            const max = parseInt(maxSlider.value);

            const percent1 = (min / minSlider.max) * 100;
            const percent2 = (max / maxSlider.max) * 100;

            track.style.background = `linear-gradient(
                to right,
                #d3d3d3 ${percent1}%,
                #0d6efd ${percent1}%,
                #0d6efd ${percent2}%,
                #d3d3d3 ${percent2}%
            )`;

            minValue.textContent = min;
            maxValue.textContent = max;
        }

        minSlider.addEventListener("input", function () {
            if (parseInt(minSlider.value) > parseInt(maxSlider.value)) {
                minSlider.value = maxSlider.value;
            }
            updateTrack();
        });

        maxSlider.addEventListener("input", function () {
            if (parseInt(maxSlider.value) < parseInt(minSlider.value)) {
                maxSlider.value = minSlider.value;
            }
            updateTrack();
        });

        updateTrack(); // initialize
    });
</script>

<!-- Script for size filter slider -->
<script>
    document.addEventListener("DOMContentLoaded", () => {
    const minSizeSlider = document.getElementById("minSize");
    const maxSizeSlider = document.getElementById("maxSize");
    const minSizeValue = document.getElementById("minSizeValue");
    const maxSizeValue = document.getElementById("maxSizeValue");
    const sizeTrack = minSizeSlider.parentElement.querySelector(".slider-track");

    function updateSizeTrack() {
        const min = parseInt(minSizeSlider.value);
        const max = parseInt(maxSizeSlider.value);

        const percent1 = (min / minSizeSlider.max) * 100;
        const percent2 = (max / maxSizeSlider.max) * 100;

        sizeTrack.style.background = `linear-gradient(
            to right,
            #d3d3d3 ${percent1}%,
            #0d6efd ${percent1}%,
            #0d6efd ${percent2}%,
            #d3d3d3 ${percent2}%
        )`;

        minSizeValue.textContent = min;
        maxSizeValue.textContent = max;
    }

    minSizeSlider.addEventListener("input", function () {
        if (parseInt(minSizeSlider.value) > parseInt(maxSizeSlider.value)) {
            minSizeSlider.value = maxSizeSlider.value;
        }
        updateSizeTrack();
    });

    maxSizeSlider.addEventListener("input", function () {
        if (parseInt(maxSizeSlider.value) < parseInt(minSizeSlider.value)) {
            maxSizeSlider.value = minSizeSlider.value;
        }
        updateSizeTrack();
    });

    updateSizeTrack(); // initialize
    });

</script>


<!-- Apartment Images Script -->
<script>
    // Image Modal Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const imageModal = document.getElementById('imageModal');
        
        imageModal.addEventListener('show.bs.modal', function(event) {
            const trigger = event.relatedTarget;
            const allImagesJSON = trigger.getAttribute('data-all-images');
            
            if (allImagesJSON) {
                const allImages = JSON.parse(allImagesJSON);
                loadAllApartmentImages(allImages);
            }
        });
        
        function loadAllApartmentImages(allImages) {
            const carouselInner = document.getElementById('carousel-inner');
            const carouselIndicators = document.getElementById('carousel-indicators');
            
            if (!allImages || allImages.length === 0) {
                carouselInner.innerHTML = '<div class="text-center py-5 text-muted">No images found</div>';
                document.getElementById('imageCounter').textContent = 'No images';
                return;
            }
            
            // Clear previous content
            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';
            
            // Build carousel items and indicators
            allImages.forEach((image, index) => {
                const isActive = index === 0 ? 'active' : '';
                
                // Carousel item
                const carouselItem = document.createElement('div');
                carouselItem.className = `carousel-item ${isActive}`;
                carouselItem.innerHTML = `
                    <img src="${image.src}" class="d-block carousel-image" alt="${image.alt}">
                `;
                carouselInner.appendChild(carouselItem);
                
                // Carousel indicator
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#imageCarousel');
                indicator.setAttribute('data-bs-slide-to', index);
                indicator.className = isActive ? 'active' : '';
                indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                carouselIndicators.appendChild(indicator);
            });
            
            // Update image counter
            document.getElementById('imageCounter').textContent = `1 of ${allImages.length}`;
            
            // Show/hide controls based on image count
            const prevControl = document.querySelector('.carousel-control-prev');
            const nextControl = document.querySelector('.carousel-control-next');
            
            if (allImages.length > 1) {
                prevControl.style.display = 'block';
                nextControl.style.display = 'block';
                carouselIndicators.style.display = 'flex';
            } else {
                prevControl.style.display = 'none';
                nextControl.style.display = 'none';
                carouselIndicators.style.display = 'none';
            }
        }
        
        // Update counter when carousel slides
        const imageCarousel = document.getElementById('imageCarousel');
        if (imageCarousel) {
            imageCarousel.addEventListener('slid.bs.carousel', function(event) {
                const activeIndex = event.to;
                const totalItems = this.querySelectorAll('.carousel-item').length;
                document.getElementById('imageCounter').textContent = `${activeIndex + 1} of ${totalItems}`;
            });
        }
        
        // Reset modal when closed
        imageModal.addEventListener('hidden.bs.modal', function() {
            const carouselInner = document.getElementById('carousel-inner');
            const carouselIndicators = document.getElementById('carousel-indicators');
            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';
            document.getElementById('imageCounter').textContent = '';
        });
    });

    // Your existing scripts for filters, tooltips, etc.
    document.addEventListener("DOMContentLoaded", () => {
        const toggleBtn = document.querySelector('#toggleFilterBtn');
        const filterCard = document.querySelector('#filterCard');

        toggleBtn.addEventListener('click', () => {
            filterCard.classList.toggle("show");
        });
        
        // Initialize tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    });

</script>




@endpush

