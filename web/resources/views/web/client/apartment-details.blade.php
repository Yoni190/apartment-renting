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

                <button class="btn btn-outline-secondary w-100">
                    Save Listing
                </button>
            </div>

            <!-- Owner Info (optional if relation exists) -->
            @if(isset($apartment->owner))
            <div class="info-card">
                <h6 class="fw-bold mb-3">Owner</h6>
                <p class="mb-1">{{ $apartment->owner->name ?? 'Owner' }}</p>
                <small class="text-muted">Property Owner</small>
            </div>
            @endif

        </div>

    </div>

</div>

@endsection