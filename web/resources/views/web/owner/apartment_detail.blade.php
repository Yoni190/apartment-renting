@extends('web.client.layout.app')

@section('content')
@php
$daysMap = [
    0 => 'Sunday',
    1 => 'Monday',
    2 => 'Tuesday',
    3 => 'Wednesday',
    4 => 'Thursday',
    5 => 'Friday',
    6 => 'Saturday',
];
@endphp
<div class="container mt-4">

    <div class="row">
        {{-- LEFT: Images + Details --}}
        <div class="col-md-8">

            {{-- Image Gallery --}}
            <div class="mb-3">
                @if($listing->images && count($listing->images) > 0)
                    <div class="rounded-xl overflow-hidden h-350">
                        <img src="{{ url('/storage/' . $listing->images[0]->path) }}"
                             class="w-100 h-100 object-fit-cover">
                    </div>

                    {{-- Thumbnails --}}
                    <div class="d-flex mt-2 gap-2 overflow-x-auto">
                        @foreach($listing->images as $image)
                            <img src="{{ url('/storage/' . $image->path) }}"
                                 class="object-fit-cover rounded" width="80" height="60">
                        @endforeach
                    </div>
                @else
                    <img src="https://via.placeholder.com/800x400?text=No+Image"
                         class="w-100 rounded">
                @endif
            </div>

            {{-- Title + Address --}}
            <h2 class="fw-bold">{{ $listing->title }}</h2>
            <p class="text-muted">{{ $listing->address }}</p>

            {{-- Description --}}
            @if(isset($listing->description))
                <div class="mt-3">
                    <h5>Description</h5>
                    <p>{{ $listing->description }}</p>
                </div>
            @endif

        </div>

        {{-- RIGHT: Booking / Price Card --}}
        <div class="col-md-4">
            <div class="card shadow-sm rounded-xl">
                <div class="card-body">

                    <h4 class="fw-bold mb-3">
                        {{ $listing->price }} Birr
                        <span class="text-muted fs-6">/ month</span>
                    </h4>

                    <a href="{{ route('apartment.edit', $listing) }}"
                       class="btn btn-primary w-100 mb-2">
                        Edit Listing
                    </a>

                    <form method="POST" action="{{ route('apartment.destroy', $listing->id) }}">
                        @csrf
                        @method('DELETE')

                        <button type="button"
                                class="btn btn-danger w-100 mb-2"
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal">
                            Delete Listing
                        </button>
                    </form>

                    <a href="{{ route('owner.dashboard') }}"
                       class="btn btn-outline-secondary w-100">
                        Back
                    </a>

                </div>
            </div>
        </div>

        <div class="card shadow-sm mt-3 rounded-xl">
            <div class="card-body">

                <h5 class="fw-bold mb-3">Set Open Hours</h5>

                <form action="{{ route('listing.hours.store', $listing) }}" method="POST">
                    @csrf

                    <div id="scheduleWrapper">

                    @if(isset($grouped) && count($grouped) > 0)

                        @foreach($grouped as $row)
                            <div class="border rounded p-3 mb-3 bg-light">

                                <div class="row g-2">

                                    <div class="col-6">
                                        <label class="form-label small text-muted">From Day</label>
                                        <select name="days_from[]" class="form-select">
                                            @foreach($daysMap as $key => $day)
                                                <option value="{{ $day }}"
                                                    {{ $day == $daysMap[$row['from_day']] ? 'selected' : '' }}>
                                                    {{ $day }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <div class="col-6">
                                        <label class="form-label small text-muted">To Day</label>
                                        <select name="days_to[]" class="form-select">
                                            @foreach($daysMap as $key => $day)
                                                <option value="{{ $day }}"
                                                    {{ $day == $daysMap[$row['to_day']] ? 'selected' : '' }}>
                                                    {{ $day }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <div class="col-6">
                                        <label class="form-label small text-muted">Open Time</label>
                                        <input type="time" name="time_from[]" class="form-control"
                                            value="{{ $row['start_time'] }}">
                                    </div>

                                    <div class="col-6">
                                        <label class="form-label small text-muted">Close Time</label>
                                        <input type="time" name="time_to[]" class="form-control"
                                            value="{{ $row['end_time'] }}">
                                    </div>

                                </div>
                            </div>
                        @endforeach

                    @else

                        <div class="border rounded p-3 mb-3 bg-light">
                            <div class="row g-2">
                                <div class="col-6">
                                    <label class="form-label small text-muted">From Day</label>
                                    <select name="days_from[]" class="form-select">
                                        @foreach($daysMap as $day)
                                            <option value="{{ $day }}">{{ $day }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="col-6">
                                    <label class="form-label small text-muted">To Day</label>
                                    <select name="days_to[]" class="form-select">
                                        @foreach($daysMap as $day)
                                            <option value="{{ $day }}">{{ $day }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="col-6">
                                    <input type="time" name="time_from[]" class="form-control">
                                </div>

                                <div class="col-6">
                                    <input type="time" name="time_to[]" class="form-control">
                                </div>
                            </div>
                        </div>

                    @endif

                    </div>

                    <button type="submit" class="btn btn-primary w-100">
                        Save Open Hours
                    </button>

                </form>

            </div>
        </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-xl">

            <div class="modal-body text-center p-4">

                <div class="mb-3">
                    <div class="icon-circle bg-danger-subtle">
                        <i class="bi bi-trash-fill text-danger fs-2"></i>
                    </div>
                </div>

                <h5 class="fw-bold mb-2">Delete Listing?</h5>

                <p class="text-muted mb-4 small">
                    This action cannot be undone. All related bookings and data will be permanently removed.
                </p>

                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-light w-50" data-bs-dismiss="modal">
                        Cancel
                    </button>

                    <form method="POST" action="{{ route('apartment.destroy', $listing->id) }}" class="w-50">
                        @csrf
                        @method('DELETE')

                        <button class="btn btn-danger w-100">
                            Yes, Delete
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </div>
</div>
</div>
@endsection