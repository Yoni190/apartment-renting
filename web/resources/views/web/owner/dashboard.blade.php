    @extends('web.client.layout.app')

    @section('title', 'Gojoye - Dashboard')

    @push('styles')
<style>
.empty-home {
    font-size: 5rem;
    display: inline-block;
    animation: floatHome 3s ease-in-out infinite;
}

@keyframes floatHome {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-12px);
    }
}
</style>
@endpush

    @section('content')
    <div class="container mt-4">
        <h2 class="fw-bold mb-4">{{ __('Owner Dashboard') }}</h2>

        <div class="row">
            <div class="col-lg-6">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0">{{ __('Your Listings') }}</h4>
                    @if(auth()->user()->subscribed)
                        <a href="{{ route('apartment-create') }}" class="btn btn-primary rounded-pill">
                            <i class="bi bi-plus-circle"></i> {{ __('Add Apartment') }}
                        </a>
                    @endif
                </div>
                <form method="GET" class="mb-3">
                    <div class="input-group">
                        <input type="text" name="q" value="{{ $q ?? '' }}" class="form-control" placeholder="{{ __('Search bookings by listing or client') }}" />
                        <button class="btn btn-outline-secondary" type="submit">
                            <i class="bi bi-search"></i> {{ __('Search') }}
                        </button>
                    </div>
                </form>
                @if($listings->isEmpty())
                    <div class="card border-0 shadow-sm text-center py-5">
                        <div class="card-body">
                            <div class="empty-home mb-3">
                                <i class="bi bi-house-heart"></i>
                            </div>

                            <h5 class="fw-bold">{{ __('No apartments yet') }}</h5>

                            <p class="text-muted mb-4">
                                {{ __('Your listings will appear here once you add your first apartment.') }}
                            </p>

                            @if(auth()->user()->subscribed)
                                <a href="{{ route('apartment-create') }}" class="btn btn-primary rounded-pill">
                                    <i class="bi bi-plus-circle"></i>
                                    {{ __('Add Your First Apartment') }}
                                </a>
                            @else
                                <a href="{{ route('subscription.page') }}" class="btn btn-secondary rounded-pill">
                                    <i class="bi bi-lock"></i>
                                    {{ __('Subscribe to Add Apartment') }}
                                </a>
                            @endif
                        </div>
                    </div>
                @else
                    @foreach($listings as $listing)
                        <a href="{{ route('listing.details', $listing) }}" class="text-decoration-none text-reset">
                            <div class="apartment-card card mb-3">
                                @if($listing->images && count($listing->images) > 0)
                                    <img src="{{ url('/storage/' . $listing->images[0]->path) }}" class="card-img-top object-fit-cover" height="180" alt="{{ $listing->title }}">
                                @else
                                    <img src="https://via.placeholder.com/400x200?text=No+Image" class="card-img-top object-fit-cover" height="180" alt="No image">
                                @endif
                                <div class="card-body">
                                    <h5 class="card-title">{{ $listing->title }}</h5>
                                    <p class="card-text text-muted small">{{ $listing->address }}</p>
                                    <a href="{{ route('bookings.create', $listing) }}" class="btn btn-sm btn-outline-primary">{{ __('Request test booking') }}</a>
                                </div>
                            </div>
                        </a>
                    @endforeach
                @endif
            </div>

            <div class="col-lg-6">
                <h4>{{ __('Bookings') }}</h4>
                @if($bookings->isEmpty())
                    <p class="text-muted">{{ __('No bookings yet.') }}</p>
                @else
                    <div class="list-group">
                    @foreach($bookings as $b)
                        <div class="list-group-item list-group-item-action mb-2 rounded-xl">
                            <div class="d-flex gap-3">
                                @if($b->listing->images && count($b->listing->images) > 0)
                                    <img src="{{ url('/storage/' . $b->listing->images[0]->path) }}" class="object-fit-cover rounded" width="80" height="80" alt="">
                                @endif
                                <div class="flex-grow-1 min-w-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <strong class="text-truncate">{{ $b->listing->title }}</strong>
                                        <span class="badge status-{{ $b->status }}">{{ ucfirst($b->status) }}</span>
                                    </div>
                                    <div class="text-muted small text-truncate">{{ $b->listing->address }}</div>
                                    <div class="small mt-1">
                                        <i class="bi bi-calendar3"></i> {{ \Carbon\Carbon::parse($b->scheduled_at)->toDayDateTimeString() }}
                                    </div>
                                    <div class="text-muted small">{{ __('Client') }}: {{ $b->user->name }} &mdash; {{ $b->user->email }}</div>
                                    @if($b->status === \App\Models\TourBooking::STATUS_PENDING)
                                        <div class="mt-2 d-flex gap-2">
                                            <form method="POST" action="{{ route('owner.bookings.accept', $b->id) }}">
                                                @csrf
                                                @method('PATCH')
                                                <button class="btn btn-sm btn-success">{{ __('Accept') }}</button>
                                            </form>
                                            <form method="POST" action="{{ route('owner.bookings.reject', $b->id) }}">
                                                @csrf
                                                @method('PATCH')
                                                <button class="btn btn-sm btn-danger">{{ __('Reject') }}</button>
                                            </form>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @endforeach
                    </div>
                @endif

                <h4 class="mt-4">{{ __('Notifications') }}</h4>
                @if($notifications->isEmpty())
                    <p class="text-muted">{{ __('No notifications.') }}</p>
                @else
                    <ul class="list-group">
                        @foreach($notifications as $n)
                            <li class="list-group-item {{ $n->read_at ? '' : 'fw-bold' }}">
                                <div>{{ data_get($n->data, 'listing_title') }} &mdash; {{ data_get($n->data, 'scheduled_at') }}</div>
                                <small class="text-muted">{{ __('Received') }} {{ $n->created_at->diffForHumans() }}</small>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </div>
    </div>
    @endsection
