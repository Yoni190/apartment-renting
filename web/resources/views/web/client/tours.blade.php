@extends('web.client.layout.app')

@section('title', __('Gojoye - Tours'))

@section('content')
<div class="container py-5">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold mb-1">{{ __('My Tour Requests') }}</h2>
            <p class="text-muted mb-0">{{ __('Track and manage your apartment tour bookings') }}</p>
        </div>
    </div>

    @if($tours->isEmpty())
        <div class="empty-state">
            <i class="bi bi-calendar-check"></i>
            <h4 class="fw-bold">{{ __('No tour requests yet') }}</h4>
            <p class="text-muted">{{ __('Start exploring apartments and book your first tour.') }}</p>
        </div>
    @else
        <div class="row g-4">
            @foreach($tours as $tour)
                <div class="col-md-6 col-lg-4">
                    <div class="tour-card">

                        @if($tour->listing && $tour->listing->images->isNotEmpty())
                            <img src="{{ url('/storage/' . $tour->listing->images->first()->path) }}" class="tour-img" alt="{{ $tour->listing->title ?? __('Apartment') }}">
                        @else
                            <img src="https://via.placeholder.com/400x200" class="tour-img" alt="{{ __('Apartment') }}">
                        @endif

                        <div class="p-3">
                            <h5 class="fw-semibold mb-1">{{ $tour->listing->title ?? __('Apartment') }}</h5>

                            <p class="text-muted small mb-2">
                                <i class="bi bi-calendar me-1"></i>
                                {{ \Carbon\Carbon::parse($tour->scheduled_at)->format('M d, Y - H:i') }}
                            </p>

                            <div class="mb-3">
                                <span class="badge status-{{ strtolower($tour->status) }}">
                                    {{ __($tour->status) }}
                                </span>
                            </div>

                            @if($tour->note)
                                <p class="small text-muted mb-3">&quot;{{ $tour->note }}&quot;</p>
                            @endif

                            <div class="d-flex justify-content-between align-items-center">
                                <a href="{{ route('listing.details', $tour->listing) }}" class="btn btn-outline-primary btn-sm">
                                    {{ __('View') }}
                                </a>

                                @if($tour->status === \App\Models\TourBooking::STATUS_PENDING)
                                    <form method="POST" action="{{ route('tours.cancel', $tour->id) }}">
                                        @csrf
                                        @method('PATCH')
                                        <button class="btn btn-outline-danger btn-sm">{{ __('Cancel') }}</button>
                                    </form>
                                @endif
                            </div>
                        </div>

                    </div>
                </div>
            @endforeach
        </div>
    @endif

</div>
@endsection
