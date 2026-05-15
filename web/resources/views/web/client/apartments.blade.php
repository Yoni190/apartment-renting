@extends('web.client.layout.app')

@section('title', __('Gojoye - Apartments'))

@section('content')
<div class="container py-5">

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 class="fw-bold mb-0">{{ __('Explore Apartments') }}</h2>
    </div>

    <form method="GET" action="{{ route('client.apartments') }}" class="search-box mb-4">
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label small text-muted">{{ __('Search') }}</label>
                <input type="text" name="search" class="form-control" placeholder="{{ __('Search by title, address, description...') }}" value="{{ request('search') }}">
            </div>

            <div class="col-md-2">
                <label class="form-label small text-muted">{{ __('Min Price') }}</label>
                <input type="number" name="min_price" class="form-control" placeholder="0" value="{{ request('min_price') }}">
            </div>

            <div class="col-md-2">
                <label class="form-label small text-muted">{{ __('Max Price') }}</label>
                <input type="number" name="max_price" class="form-control" placeholder="100000" value="{{ request('max_price') }}">
            </div>

            <div class="col-md-2">
                <label class="form-label small text-muted">{{ __('Bedrooms') }}</label>
                <select name="bedrooms" class="form-select">
                    <option value="">{{ __('Any') }}</option>
                    @foreach([1,2,3,4,5,6] as $num)
                        <option value="{{ $num }}" @selected(request('bedrooms') == $num)>{{ $num }}</option>
                    @endforeach
                </select>
            </div>

            <div class="col-md-2">
                <label class="form-label small text-muted">{{ __('Bathrooms') }}</label>
                <select name="bathrooms" class="form-select">
                    <option value="">{{ __('Any') }}</option>
                    @foreach([1,2,3,4,5,6] as $num)
                        <option value="{{ $num }}" @selected(request('bathrooms') == $num)>{{ $num }}</option>
                    @endforeach
                </select>
            </div>

            <div class="col-md-3">
                <label class="form-label small text-muted">{{ __('Sort By') }}</label>
                <select name="sort" class="form-select">
                    <option value="" @selected(!request('sort'))>{{ __('Newest') }}</option>
                    <option value="price_asc" @selected(request('sort') === 'price_asc')>{{ __('Price Low-High') }}</option>
                    <option value="price_desc" @selected(request('sort') === 'price_desc')>{{ __('Price High-Low') }}</option>
                    <option value="rating_desc" @selected(request('sort') === 'rating_desc')>{{ __('Top Rated') }}</option>
                </select>
            </div>

            <div class="col-md-9 d-flex align-items-end gap-2">
                <button type="submit" class="btn btn-primary">{{ __('Apply Filters') }}</button>
                <a href="{{ route('client.apartments') }}" class="btn btn-ghost">{{ __('Reset') }}</a>
            </div>
        </div>
    </form>

    @if(request('search'))
        <div class="mb-3">
            <span class="text-muted">{{ __('Showing results for:') }} <strong>{{ request('search') }}</strong></span>
            <a href="{{ route('client.apartments') }}" class="ms-2 text-decoration-none">{{ __('Clear') }}</a>
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
                        <img src="{{ $image ? asset('storage/'.$image->path) : 'https://via.placeholder.com/400x250' }}" class="card-img-top" alt="{{ $apartment->title }}">

                        @if($apartment->is_featured)
                            <span class="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
                                {{ __('Featured') }}
                            </span>
                        @endif

                        <span class="badge-price position-absolute bottom-0 end-0 m-3">
                            {{ __('ETB') }} {{ number_format($apartment->price) }}
                        </span>
                    </div>

                    <div class="card-body d-flex flex-column">
                        <h5 class="fw-bold mb-1">{{ $apartment->title }}</h5>

                        <p class="text-muted small mb-2">
                            <i class="bi bi-geo-alt"></i> {{ Str::limit($apartment->address, 50) }}
                        </p>

                        <div class="apartment-meta mb-2">
                            <span><i class="bi bi-grid"></i> {{ $apartment->bedrooms }} {{ __('Beds') }}</span>
                            <span><i class="bi bi-droplet"></i> {{ $apartment->bathrooms }} {{ __('Baths') }}</span>
                            <span><i class="bi bi-arrows-angle-expand"></i> {{ $apartment->size }} m²</span>
                        </div>

                        <div class="mb-3">
                            @if($avg)
                                <i class="bi bi-star-fill text-warning"></i> {{ $avg }}
                            @else
                                <span class="text-muted small">{{ __('No reviews yet') }}</span>
                            @endif
                        </div>

                        <a href="{{ route('user.client.apartment-details', $apartment->id) }}" class="btn btn-dark w-100 mt-auto">
                            {{ __('View Details') }}
                        </a>
                    </div>

                </div>
            </div>
        @empty
            <div class="col-12">
                <div class="alert alert-light border text-center py-5">
                    <i class="bi bi-building fs-1 d-block mb-2 text-muted"></i>
                    {{ __('No apartments found.') }}
                </div>
            </div>
        @endforelse
    </div>

    <div class="mt-5 d-flex justify-content-center">
        {{ $apartments->links() }}
    </div>

</div>
@endsection
