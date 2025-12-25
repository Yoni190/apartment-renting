@extends('web.client.layout.app')

@section('content')
<div class="container mt-4">
    <h2>Owner Dashboard</h2>

    <div class="row">
        <div class="col-md-6">
            <h4>Your Listings</h4>
            <form method="GET" class="mb-3">
                <div class="input-group">
                    <input type="text" name="q" value="{{ $q ?? '' }}" class="form-control" placeholder="Search bookings by listing or client" />
                    <button class="btn btn-outline-secondary" type="submit">Search</button>
                </div>
            </form>
            @foreach($listings as $listing)
                <div class="card mb-2">
                    <div class="card-body">
                        <h5>{{ $listing->title }}</h5>
                        <p>{{ $listing->address }}</p>
                        <a href="{{ route('bookings.create', $listing) }}" class="btn btn-sm btn-outline-primary">Request test booking (open form)</a>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="col-md-6">
            <h4>Bookings</h4>
            @if($bookings->isEmpty())
                <p>No bookings yet.</p>
            @else
                <div class="list-group">
                @foreach($bookings as $b)
                    <a href="{{ route('owner.listing.show', ['apartment' => $b->listing->id, 'booking_id' => $b->id]) }}" class="list-group-item list-group-item-action mb-2">
                        <div class="d-flex">
                            <div style="width:100px; height:80px; overflow:hidden; flex-shrink:0; margin-right:12px;">
                                @if($b->listing->images && count($b->listing->images)>0)
                                    <img src="{{ url('/storage/' . $b->listing->images[0]->path) }}" style="width:100%; height:100%; object-fit:cover;" />
                                @endif
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <strong>{{ $b->listing->title }}</strong>
                                    <small>{{ ucfirst($b->status) }}</small>
                                </div>
                                <div class="text-muted">{{ $b->listing->address }}</div>
                                <div class="mt-2">Requested: {{ $b->scheduled_at->toDayDateTimeString() }}</div>
                                <div class="text-muted">Client: {{ $b->user->name }} — {{ $b->user->email }}</div>
                            </div>
                        </div>
                    </a>
                @endforeach
                </div>
            @endif

            <h4 class="mt-4">Notifications</h4>
            @if($notifications->isEmpty())
                <p>No notifications.</p>
            @else
                <ul class="list-group">
                    @foreach($notifications as $n)
                        <li class="list-group-item {{ $n->read_at ? '' : 'fw-bold' }}">
                            <div>{{ data_get($n->data, 'listing_title') }} — {{ data_get($n->data, 'scheduled_at') }}</div>
                            <small class="text-muted">Received {{ $n->created_at->diffForHumans() }}</small>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </div>
</div>

@endsection
