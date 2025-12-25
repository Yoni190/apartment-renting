@extends('web.client.layout.app')

@section('content')
<div class="container mt-4">
    <div class="card">
        <div class="card-body">
            <h3>{{ $listing->title }}</h3>
            <p>{{ $listing->address }}</p>
            <div><strong>Price:</strong> {{ $listing->price }}</div>
            <div class="mt-3">
                <a href="{{ route('owner.dashboard') }}" class="btn btn-outline-secondary">Back</a>
                @if($booking_id)
                    <a href="{{ route('owner.booking.client', ['booking' => $booking_id]) }}" class="btn btn-primary">View Client Profile</a>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection
