@extends('web.client.layout.app')

@section('title', 'Home - Rent Your Dream Apartment')

@push('styles')
<style>
.featured-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(255, 193, 7, 0.95); /* strong yellow */
    color: #111;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 999px;
    z-index: 10;
    box-shadow: 0 6px 14px rgba(0,0,0,0.2);
}
</style>

@endpush
@section('content')

<section class="hero-section mb-5" style="background-image: url('/images/apartment_hero2.jpg'); background-size: cover; background-position: center;">
    <div class="hero-content">
        <h1 class="display-4 fw-bold">{{__('Find Your Dream Apartment')}}</h1>
        <p class="lead">{{__('Browse thousands of apartments for rent/sale in your city')}}</p>
        <a href="{{ route('login') }}" class="btn btn-primary btn-lg mt-3">{{__('Start Searching')}}</a>
    </div>
</section>

<section class="container mb-5">
    <h2 class="mb-4">{{__('Featured Apartments')}}</h2>
    <div class="row g-4">
        @foreach($featuredApartments as $apartment)
        <div class="col-md-4">
            <div class="card apartment-card h-100 shadow-sm">
                <div class="position-relative">
    @if($apartment->is_featured)
        <span class="featured-badge">
            {{ __('Featured') }}
        </span>
    @endif

    @if($apartment->images && $apartment->images->count() > 0)
        @php
            $firstImage = $apartment->images->first();
        @endphp
        <img src="{{ asset('storage/' . $firstImage->path) }}"
             class="card-img-top"
             alt="{{ $apartment->title }}">
    @else
        <div class="card-img-top bg-light d-flex align-items-center justify-content-center p-5">
            <div class="text-center text-muted">
                <i class="bi bi-image fs-1"></i>
                <p class="mt-2">{{ __('No Image') }}</p>
            </div>
        </div>
    @endif
</div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{{ $apartment->title }}</h5>
                    <p class="card-text flex-grow-1">{{ Str::limit($apartment->description, 80) }}</p>
                    <div class="mt-auto">
                        <span class="badge-price">
                            {{ number_format($apartment->price) }} {{ __('ETB') }}
                            @if($apartment->type === 'rent')
                                / {{ __('month') }}
                            @endif
                        </span>

                        <a href="{{ route('login') }}" class="btn btn-outline-primary btn-sm w-100 mt-2">
                            {{ __('View Details') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</section>

<section class="bg-dark text-white py-5">
    <div class="container text-center">
        <h2 class="fw-bold">{{__('List Your Apartment with Us')}}</h2>
        <p class="lead">{{__('Reach thousands of potential renters quickly and easily')}}</p>
        <a href="{{ route('login') }}" class="btn btn-light btn-lg">{{__('Add Your Apartment')}}</a>
    </div>
</section>

@endsection
