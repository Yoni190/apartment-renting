@extends('web.client.layout.app')

@section('content')
<div class="container mt-4">
    <h3>Request a Tour for: {{ $listing->title }}</h3>

    <p>{{ $listing->address }}</p>

    <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">Choose date & time</h5>

            @if($errors->any())
                <div class="alert alert-danger">{{ implode(', ', $errors->all()) }}</div>
            @endif

            @if(session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif

            <form method="POST" action="{{ route('bookings.store', $listing) }}">
                @csrf
                <div class="mb-3">
                    <label for="date" class="form-label">Date</label>
                    <input id="date" name="date" type="date" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="time" class="form-label">Time</label>
                    <input id="time" name="time" type="time" class="form-control" required />
                    <small class="text-muted">Available times depend on the listing open hours for the selected day.</small>
                </div>

                <div class="mb-3">
                    <label for="note" class="form-label">Note (optional)</label>
                    <textarea id="note" name="note" class="form-control"></textarea>
                </div>

                <button class="btn btn-primary">Request Tour</button>
            </form>
        </div>
    </div>

    <h6 class="mt-3">Listing open hours</h6>
    <ul class="list-group">
        @foreach($openHours as $h)
            <li class="list-group-item">Day {{ $h->day_of_week }}: {{ \Carbon\Carbon::createFromFormat('H:i:s', $h->start_time)->format('H:i') }} - {{ \Carbon\Carbon::createFromFormat('H:i:s', $h->end_time)->format('H:i') }}</li>
        @endforeach
    </ul>
</div>

@endsection
