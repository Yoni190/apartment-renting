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

.search-box {
    background: #fff;
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
}
</style>
@endpush

@section('content')
<div class="container py-5">

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 class="fw-bold mb-0">Explore Apartments</h2>

        <form method="GET" action="{{ route('client.apartments') }}" class="search-box w-100 mb-4">
            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label small text-muted">Search</label>
                    <input
                        type="text"
                        name="search"
                        class="form-control"
                        placeholder="Search by title, address, description..."
                        value="{{ request('search') }}"
                    >
                </div>

                <div class="col-md-2">
                    <label class="form-label small text-muted">Min Price</label>
                    <input
                        type="number"
                        name="min_price"
                        class="form-control"
                        placeholder="0"
                        value="{{ request('min_price') }}"
                    >
                </div>

                <div class="col-md-2">
                    <label class="form-label small text-muted">Max Price</label>
                    <input
                        type="number"
                        name="max_price"
                        class="form-control"
                        placeholder="100000"
                        value="{{ request('max_price') }}"
                    >
                </div>

                <div class="col-md-2">
                    <label class="form-label small text-muted">Bedrooms</label>
                    <select name="bedrooms" class="form-select">
                        <option value="">Any</option>
                        @foreach([1,2,3,4,5,6] as $num)
                            <option value="{{ $num }}" @selected(request('bedrooms') == $num)>
                                {{ $num }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="col-md-2">
                    <label class="form-label small text-muted">Bathrooms</label>
                    <select name="bathrooms" class="form-select">
                        <option value="">Any</option>
                        @foreach([1,2,3,4,5,6] as $num)
                            <option value="{{ $num }}" @selected(request('bathrooms') == $num)>
                                {{ $num }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label small text-muted">Sort By</label>
                    <select name="sort" class="form-select">
                        <option value="" @selected(!request('sort'))>Newest</option>
                        <option value="price_asc" @selected(request('sort') === 'price_asc')>Price: Low to High</option>
                        <option value="price_desc" @selected(request('sort') === 'price_desc')>Price: High to Low</option>
                        <option value="rating_desc" @selected(request('sort') === 'rating_desc')>Top Rated</option>
                    </select>
                </div>

                <div class="col-md-9 d-flex align-items-end gap-2">
                    <button class="btn btn-dark" type="submit">Apply Filters</button>
                    <a href="{{ route('client.apartments') }}" class="btn btn-outline-secondary">Reset</a>
                </div>
            </div>
        </form>
    </div>

    @if(request('search'))
        <div class="mb-3">
            <span class="text-muted">
                Showing results for: <strong>{{ request('search') }}</strong>
            </span>
            <a href="{{ route('client.apartments') }}" class="ms-2 text-decoration-none">Clear</a>
        </div>
    @endif

    <div class="row g-4">
        @forelse($apartments as $apartment)
            @php
                $image = $apartment->mainImage;
                $avg = $apartment->reviews_avg_rating ? round($apartment->reviews_avg_rating, 1) : null;
            @endphp

            <div class="col-md-6 col-lg-4">
                <div class="card apartment-card border-0 shadow-sm h-100">

                    <div class="position-relative">
                        <img
                            src="{{ $image ? asset('storage/'.$image->path) : 'https://via.placeholder.com/400x250' }}"
                            class="card-img-top apartment-img"
                            alt="{{ $apartment->title }}"
                        >

                        @if($apartment->is_featured)
                            <span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
                                Featured
                            </span>
                        @endif

                        <span class="price-badge">
                            {{ number_format($apartment->price) }} Birr
                        </span>
                    </div>

                    <div class="card-body d-flex flex-column">
                        <h5 class="fw-bold mb-1">{{ $apartment->title }}</h5>

                        <p class="text-muted small mb-2">
                            {{ Str::limit($apartment->address, 50) }}
                        </p>

                        <div class="d-flex justify-content-between small text-muted mb-2">
                            <span>🛏 {{ $apartment->bedrooms }} Beds</span>
                            <span>🛁 {{ $apartment->bathrooms }} Baths</span>
                            <span>📐 {{ $apartment->size }} m²</span>
                        </div>

                        <div class="mb-3">
                            @if($avg)
                                ⭐ {{ $avg }}
                            @else
                                <span class="text-muted small">No reviews yet</span>
                            @endif
                        </div>

                        <a href="{{ route('user.client.apartment-details', $apartment->id) }}"
                           class="btn btn-dark w-100 mt-auto">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12">
                <div class="alert alert-light border text-center py-5">
                    No apartments found.
                </div>
            </div>
        @endforelse
    </div>

    <div class="mt-5 d-flex justify-content-center">
        {{ $apartments->links() }}
    </div>

</div>
@endsection