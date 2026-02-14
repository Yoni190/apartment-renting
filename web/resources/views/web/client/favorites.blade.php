@extends('web.client.layout.app')

@section('content')
<div class="container py-5">

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
            <h2 class="fw-bold mb-1">My Favorites</h2>
            <p class="text-muted mb-0">All apartments you saved in one place.</p>
        </div>

        <div class="mt-3 mt-md-0">
            <span class="badge bg-primary px-3 py-2 rounded-pill">
                {{ $favorites->count() }} Saved
            </span>
        </div>
    </div>

    @if($favorites->count())
        <div class="row g-4">
            @foreach($favorites as $favorite)
                @php
                    $apartment = $favorite->apartment;
                @endphp

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card border-0 shadow-sm h-100 rounded-4 overflow-hidden favorite-card">
                        <div class="position-relative bg-light" style="height: 220px;">
                            @if($apartment && $apartment->images && $apartment->images->count() > 0)
                                <img
                                    src="{{ asset('storage/' . $apartment->images->first()->path) }}"
                                    alt="{{ $apartment->title ?? 'Apartment' }}"
                                    class="w-100 h-100 object-fit-cover"
                                >
                            @else
                                <div class="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                                    <div class="text-center">
                                        <i class="bi bi-house-door fs-1 d-block mb-2"></i>
                                        <span>No image available</span>
                                    </div>
                                </div>
                            @endif

                            <div class="position-absolute top-0 end-0 p-3">
                                <span class="badge bg-white text-dark shadow-sm rounded-pill px-3 py-2">
                                    Saved
                                </span>
                            </div>
                        </div>

                        <div class="card-body p-4 d-flex flex-column">
                            <div class="mb-2">
                                <h5 class="card-title fw-bold mb-1">
                                    {{ $apartment->title ?? 'Apartment #' . $favorite->apartment_id }}
                                </h5>

                                <p class="text-muted small mb-0">
                                    <i class="bi bi-geo-alt me-1"></i>
                                    {{ $apartment->location ?? 'Location not available' }}
                                </p>
                            </div>

                            <div class="mb-3">
                                <span class="text-success fw-bold fs-5">
                                    {{ $apartment->price ?? 'N/A' }}
                                </span>
                                @if($apartment && isset($apartment->price))
                                    <span class="text-muted">/ month</span>
                                @endif
                            </div>

                            <div class="mt-auto d-flex gap-2">
                                @if($apartment)
                                    <a href="{{ route('user.client.apartment-details', $apartment) }}" class="btn btn-primary flex-fill rounded-pill">
                                        View Details
                                    </a>
                                @else
                                    <button class="btn btn-secondary flex-fill rounded-pill" disabled>
                                        View Details
                                    </button>
                                @endif

                                <form action="{{ route('favorites.destroy', $favorite->id) }}" method="POST">
                                    @csrf
                                    @method('DELETE')
                                    <button type="button"
                                        class="btn btn-outline-danger rounded-pill"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteModal{{ $favorite->id }}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="deleteModal{{ $favorite->id }}" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content rounded-4 border-0 shadow">
                            
                            <div class="modal-body text-center p-4">
                                <div class="mb-3">
                                    <i class="bi bi-exclamation-triangle text-danger fs-1"></i>
                                </div>

                                <h5 class="fw-bold">Remove from Favorites?</h5>
                                <p class="text-muted small">
                                    This apartment will be removed from your saved listings.
                                </p>

                                <div class="d-flex gap-2 mt-4">
                                    <button type="button" class="btn btn-light w-100 rounded-pill" data-bs-dismiss="modal">
                                        Cancel
                                    </button>

                                    <form action="{{ route('favorites.destroy', $favorite->id) }}" method="POST" class="w-100">
                                        @csrf
                                        @method('DELETE')

                                        <button type="submit" class="btn btn-danger w-100 rounded-pill">
                                            Yes, Remove
                                        </button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <div class="text-center py-5">
            <div class="mb-3">
                <i class="bi bi-heart fs-1 text-muted"></i>
            </div>
            <h4 class="fw-bold">No favorites yet</h4>
            <p class="text-muted mb-4">
                Start saving apartments you like so you can easily find them later.
            </p>
            <a href="{{ route('user.client.home') }}" class="btn btn-primary rounded-pill px-4">
                Browse Apartments
            </a>
        </div>
    @endif
</div>

@push('styles')
<style>
    .favorite-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .favorite-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.08) !important;
    }

    .object-fit-cover {
        object-fit: cover;
    }
</style>
@endpush
@endsection