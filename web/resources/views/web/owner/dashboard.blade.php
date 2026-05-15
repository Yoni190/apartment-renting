@extends('web.client.layout.app')

@section('title', 'Gojoye - Dashboard')

@section('content')
<div class="container mt-4">
    <h2 class="fw-bold mb-4">Owner Dashboard</h2>

    <div class="row">
        <div class="col-lg-6">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="mb-0">Your Listings</h4>
                <a href="{{ route('apartment-create') }}" class="btn btn-primary rounded-pill">
                    <i class="bi bi-plus-circle"></i> Add Apartment
                </a>
            </div>
            <form method="GET" class="mb-3">
                <div class="input-group">
                    <input type="text" name="q" value="{{ $q ?? '' }}" class="form-control" placeholder="Search bookings by listing or client" />
                    <button class="btn btn-outline-secondary" type="submit">
                        <i class="bi bi-search"></i> Search
                    </button>
                </div>
            </form>
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
                            <a href="{{ route('bookings.create', $listing) }}" class="btn btn-sm btn-outline-primary">Request test booking</a>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>

        <div class="col-lg-6">
            <h4>Bookings</h4>
            @if($bookings->isEmpty())
                <p class="text-muted">No bookings yet.</p>
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
                                <div class="text-muted small">Client: {{ $b->user->name }} &mdash; {{ $b->user->email }}</div>
                                @if($b->status === \App\Models\TourBooking::STATUS_PENDING)
                                    <div class="mt-2 d-flex gap-2">
                                        <form method="POST" action="{{ route('owner.bookings.accept', $b->id) }}">
                                            @csrf
                                            @method('PATCH')
                                            <button class="btn btn-sm btn-success">Accept</button>
                                        </form>
                                        <form method="POST" action="{{ route('owner.bookings.reject', $b->id) }}">
                                            @csrf
                                            @method('PATCH')
                                            <button class="btn btn-sm btn-danger">Reject</button>
                                        </form>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
                </div>
            @endif

            <h4 class="mt-4">Notifications</h4>
            @if($notifications->isEmpty())
                <p class="text-muted">No notifications.</p>
            @else
                <ul class="list-group">
                    @foreach($notifications as $n)
                        <li class="list-group-item {{ $n->read_at ? '' : 'fw-bold' }}">
                            <div>{{ data_get($n->data, 'listing_title') }} &mdash; {{ data_get($n->data, 'scheduled_at') }}</div>
                            <small class="text-muted">Received {{ $n->created_at->diffForHumans() }}</small>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </div>
</div>
@endsection
