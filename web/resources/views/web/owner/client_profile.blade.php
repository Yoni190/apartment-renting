@extends('web.client.layout.app')

@section('content')
<div class="container mt-4">
    <h3>Client profile for booking #{{ $booking->id }}</h3>
    <div class="card">
        <div class="card-body">
            <h5>{{ $user->name }}</h5>
            <p><strong>Email:</strong> {{ $user->email }}</p>
            <p><strong>Phone:</strong> {{ $user->phone_number ?? 'N/A' }}</p>
            <p><strong>Booking for:</strong> {{ $booking->listing->title }}</p>
            <p><strong>Scheduled at:</strong> {{ $booking->scheduled_at->toDayDateTimeString() }}</p>
            <a href="{{ route('owner.dashboard') }}" class="btn btn-outline-secondary">Back</a>
        </div>
    </div>
</div>
@endsection
