@extends('web.layout.app')

@section('title', 'Home - Rent Your Dream Apartment')

@push('styles')
<style>
/* Hero Section */
.hero {
    background: url('/images/hero-apartment.jpg') center/cover no-repeat;
    height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    position: relative;
}

.hero::before {
    content: "";
    position: absolute;
    top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.5);
}

/* Search Bar */
.search-bar {
    position: relative;
    top: -50px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* Apartment Card */
.apartment-card {
    transition: transform 0.3s;
}
.apartment-card:hover {
    transform: translateY(-5px);
}

/* Categories */
.category-card {
    text-align: center;
    padding: 30px;
    border-radius: 10px;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    background: #f8f9fa;
}
.category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* Featured */
.featured-label {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #0d6efd;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8rem;
}
</style>
@endpush

@section('content')

<!-- Hero Section -->
<section class="hero mb-5">
    <div class="container position-relative">
        <h1 class="display-4 fw-bold">Find Your Dream Apartment</h1>
        <p class="lead">Browse thousands of apartments for rent in your city</p>
        <a href="#searchSection" class="btn btn-primary btn-lg mt-3">Start Searching</a>
    </div>
</section>

<!-- Search / Filter Bar -->
<section id="searchSection" class="container search-bar mb-5">
    <form method="GET" action="#" class="row g-3 align-items-center">
        <div class="col-md-3">
            <input type="text" name="location" class="form-control" placeholder="City or Address">
        </div>
        <div class="col-md-2">
            <input type="number" name="min_price" class="form-control" placeholder="Min Price">
        </div>
        <div class="col-md-2">
            <input type="number" name="max_price" class="form-control" placeholder="Max Price">
        </div>
        <div class="col-md-2">
            <select name="bedrooms" class="form-select">
                <option value="">Bedrooms</option>
                @for($i=1; $i<=5; $i++)
                <option value="{{ $i }}">{{ $i }}+</option>
                @endfor
            </select>
        </div>
        <div class="col-md-3 d-grid">
            <button class="btn btn-primary">Search Apartments</button>
        </div>
    </form>
</section>

<!-- Featured Apartments -->
<section class="container mb-5">
    <h2 class="mb-4">Featured Apartments</h2>
    <div class="row g-4">
        @foreach($featuredApartments as $apartment)
        <div class="col-md-4">
            <div class="card apartment-card position-relative">
                @if($apartment->is_featured)
                <div class="featured-label">Featured</div>
                @endif
                <img src="{{ $apartment->image_url }}" class="card-img-top" alt="{{ $apartment->title }}">
                <div class="card-body">
                    <h5 class="card-title">{{ $apartment->title }}</h5>
                    <p class="card-text">{{ Str::limit($apartment->description, 80) }}</p>
                    <p class="fw-bold">${{ number_format($apartment->price) }} / month</p>
                    <a href="#" class="btn btn-outline-primary btn-sm">View Details</a>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</section>
{{--
<!-- Apartment Categories -->
<section class="container mb-5">
    <h2 class="mb-4">Browse by Category</h2>
    <div class="row g-4">
        @foreach($categories as $category)
        <div class="col-md-3">
            <div class="category-card" onclick="window.location='{{ route('apartments.index', ['category' => $category->id]) }}'">
                <i class="{{ $category->icon }} fs-1 mb-3 text-primary"></i>
                <h5>{{ $category->name }}</h5>
            </div>
        </div>
        @endforeach
    </div>
</section>
--}}
<!-- Call to Action -->
<section class="bg-primary text-white py-5">
    <div class="container text-center">
        <h2 class="fw-bold">List Your Apartment with Us</h2>
        <p class="lead">Reach thousands of potential renters quickly and easily</p>
        <a href="#" class="btn btn-light btn-lg">Add Your Apartment</a>
    </div>
</section>

@endsection
