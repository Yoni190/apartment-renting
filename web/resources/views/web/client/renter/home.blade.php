@extends('web.client.layout.app')

@section('title', 'Welcome - Find Your Perfect Apartment')

@push('styles')
<style>
    .hero-section {
        background: url('/images/apartments/hero.jpg') center/cover no-repeat;
        height: 70vh;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .hero-section::after {
        content: "";
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.45);
    }

    .hero-content {
        position: relative;
        z-index: 5;
        text-align: center;
    }

    .category-card {
        transition: 0.3s;
        cursor: pointer;
        border-radius: 15px;
    }

    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 25px rgba(0,0,0,0.15);
    }

    .apartment-card {
        transition: 0.3s;
        border-radius: 15px;
        overflow: hidden;
    }

    .apartment-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 20px rgba(0,0,0,0.12);
    }
</style>
@endpush

@section('content')

<div class="container mt-4">

    <!-- Hero Section -->
    <div class="hero-section mb-5">
        <div class="hero-content">
            <h1 class="display-4 fw-bold">Find Your Next Apartment</h1>
            <p class="lead mb-4">Browse beautiful homes, studios, and condos crafted for your lifestyle.</p>

            <!-- Search bar -->
            <form action="#" method="GET" class="d-flex justify-content-center">
                <input type="text" 
                       name="search" 
                       class="form-control form-control-lg w-50 rounded-pill px-4" 
                       placeholder="Search city, neighborhood, or apartment type...">
            </form>
        </div>
    </div>

    <!-- Categories -->
    <h3 class="fw-bold mb-3">Explore Categories</h3>
    <div class="row g-4 mb-5">
        <div class="col-md-3">
            <div class="card category-card p-4 text-center shadow-sm">
                <i class="bi bi-building display-4 text-primary"></i>
                <h5 class="mt-3">Apartments</h5>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card category-card p-4 text-center shadow-sm">
                <i class="bi bi-house-door display-4 text-success"></i>
                <h5 class="mt-3">Houses</h5>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card category-card p-4 text-center shadow-sm">
                <i class="bi bi-person-workspace display-4 text-warning"></i>
                <h5 class="mt-3">Studios</h5>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card category-card p-4 text-center shadow-sm">
                <i class="bi bi-building-check display-4 text-danger"></i>
                <h5 class="mt-3">Condos</h5>
            </div>
        </div>
    </div>

    <!-- Featured Apartments -->
    <h3 class="fw-bold mb-3">Featured Apartments</h3>

    <div class="row g-4">
        @foreach ($featuredApartments as $apt)
            <div class="col-md-4">
                <div class="card apartment-card shadow-sm">
                    <img src="{{ asset('storage/' . $apt->image) }}" 
                         class="card-img-top" 
                         alt="Apartment Image" 
                         style="height: 230px; object-fit: cover;">

                    <div class="card-body">
                        <h5 class="card-title">{{ $apt->title }}</h5>
                        <p class="text-muted mb-2">{{ $apt->location }}</p>
                        <p class="fw-bold text-primary">ETB {{ number_format($apt->price) }}/month</p>

                        <a href="#" class="btn btn-primary w-100">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <!-- CTA Section -->
    <div class="mt-5 p-5 bg-light rounded-4 shadow-sm text-center">
        <h3 class="fw-bold mb-3">Still Searching for the Perfect Home?</h3>
        <p class="text-muted mb-4">We help renters find verified apartments with reliable landlords.</p>
        <a href="#" class="btn btn-lg btn-dark px-5">Browse All Apartments</a>
    </div>
</div>

@endsection
