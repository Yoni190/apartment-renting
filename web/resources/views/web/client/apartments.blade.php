@extends('web.client.layout.app')

@section('title', 'Gojoye - Apartments')

@push('styles')
<style>
.apartment-card {
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.apartment-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.apartment-img {
    height: 220px;
    object-fit: cover;
}

.price-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: #000;
    color: #fff;
    padding: 6px 12px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
}
</style>

@endpush

@section('content')


<div class="container py-5">

    <h2 class="fw-bold mb-4">Explore Apartments</h2>

    <div class="row g-4">
        @foreach($apartments as $apartment)
            @php
                $image = $apartment->mainImage;
                $avg = round($apartment->reviews_avg_rating, 1);
            @endphp

            <div class="col-md-6 col-lg-4">
                <div class="card apartment-card border-0 shadow-sm h-100">

                    {{-- Image --}}
                    <div class="position-relative">
                        <img 
                            src="{{ $image ? asset('storage/'.$image->path) : 'https://via.placeholder.com/400x250' }}" 
                            class="card-img-top apartment-img"
                        >

                        {{-- Featured Badge --}}
                        @if($apartment->is_featured)
                            <span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
                                Featured
                            </span>
                        @endif

                        {{-- Price --}}
                        <span class="price-badge">
                            {{ number_format($apartment->price) }} Birr
                        </span>
                    </div>

                    {{-- Content --}}
                    <div class="card-body d-flex flex-column">

                        <h5 class="fw-bold mb-1">
                            {{ $apartment->title }}
                        </h5>

                        <p class="text-muted small mb-2">
                            {{ Str::limit($apartment->address, 50) }}
                        </p>

                        {{-- Details --}}
                        <div class="d-flex justify-content-between small text-muted mb-2">
                            <span>🛏 {{ $apartment->bedrooms }} Beds</span>
                            <span>🛁 {{ $apartment->bathrooms }} Baths</span>
                            <span>📐 {{ $apartment->size }} m²</span>
                        </div>

                        {{-- Rating --}}
                        <div class="mb-3">
                            @if($avg)
                                ⭐ {{ $avg }}
                            @else
                                <span class="text-muted small">No reviews yet</span>
                            @endif
                        </div>

                        {{-- Button --}}
                        <a href="" 
                           class="btn btn-dark w-100 mt-auto">
                            View Details
                        </a>

                    </div>
                </div>
            </div>
        @endforeach
    </div>

    {{-- Pagination --}}
    <div class="mt-5 d-flex justify-content-center">
        {{ $apartments->links() }}
    </div>

</div>



@endsection