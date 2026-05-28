@extends('web.client.layout.app')

@section('title', __('Welcome - Find Your Perfect Apartment'))

@section('content')

<div class="container mt-4">

    <div class="hero-section mb-5" style="background-image: url('/images/apartment_hero.jpg'); background-size: cover; background-position: center;">
        <div class="hero-content">
            <h1 class="display-4 fw-bold">{{ __('Find next apartment') }}</h1>
            <p class="lead mb-4">{{ __('browse_homes')}}</p>
        </div>
    </div>

    <h3 class="fw-bold mb-3">{{ __('Explore Categories') }}</h3>
    <div class="row g-4 mb-5">
        <a href="{{ route('client.apartments') }}" class="col-md-3 text-decoration-none">
            <div class="card category-card p-4 text-center shadow-sm">
                <i class="bi bi-building display-4 text-primary"></i>
                <h5 class="mt-3">{{ __('Apartments') }}</h5>
            </div>
        </a>

        <div class="col-md-3">
            <div class="card category-card p-4 text-center shadow-sm">
                <i class="bi bi-house-door display-4 text-success"></i>
                <h5 class="mt-3">{{ __('Houses') }}</h5>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card category-card p-4 text-center shadow-sm">
                <i class="bi bi-person-workspace display-4 text-warning"></i>
                <h5 class="mt-3">{{ __('Studios') }}</h5>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card category-card p-4 text-center shadow-sm">
                <i class="bi bi-building-check display-4 text-danger"></i>
                <h5 class="mt-3">{{ __('Condos') }}</h5>
            </div>
        </div>
    </div>

    <h3 class="fw-bold mb-3">{{ __('Featured Apartments') }}</h3>

    <div class="row g-4">
        @foreach ($featuredApartments as $apt)
            @if($apt->images && $apt->images->count() > 0)
                @php
                    $firstImage = $apt->images->first();
                @endphp
                <div class="col-md-4">
                    <div class="card apartment-card shadow-sm">
                        <img src="{{ asset('storage/' . $firstImage->path) }}"
                            class="card-img-top object-fit-cover"
                            alt="{{ $apt->title }}">

                        <div class="card-body">
                            <h5 class="card-title">{{ $apt->title }}</h5>
                            <p class="fw-bold text-primary">{{ __('ETB') }} {{ number_format($apt->price) }}/{{ __('month') }}</p>

                            <a href="{{ route('user.client.apartment-details', $apt->id) }}" class="btn btn-primary w-100">
                                {{ __('View Details') }}
                            </a>
                        </div>
                    </div>
                </div>
            @endif
        @endforeach
    </div>

    <div class="mt-5 p-5 bg-light rounded-4 text-center">
        <h3 class="fw-bold mb-3">{{ __('Still Searching for the Perfect Home?') }}</h3>
        <p class="text-muted mb-4">{{ __('We help renters find verified apartments with reliable landlords.') }}</p>
        <a href="{{ route('client.apartments') }}" class="btn btn-lg btn-dark px-5">{{ __('Browse All Apartments') }}</a>
    </div>
</div>

@endsection
