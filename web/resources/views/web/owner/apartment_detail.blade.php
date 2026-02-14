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
                    <div style="height:350px; overflow:hidden; border-radius:15px;">
                        <img src="{{ url('/storage/' . $listing->images[0]->path) }}"
                             style="width:100%; height:100%; object-fit:cover;">
                    </div>

                    {{-- Thumbnails --}}
                    <div class="d-flex mt-2" style="gap:10px; overflow-x:auto;">
                        @foreach($listing->images as $image)
                            <img src="{{ url('/storage/' . $image->path) }}"
                                 style="width:80px; height:60px; object-fit:cover; border-radius:8px;">
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

            {{-- Description (optional if exists) --}}
            @if(isset($listing->description))
                <div class="mt-3">
                    <h5>Description</h5>
                    <p>{{ $listing->description }}</p>
                </div>
            @endif

        </div>

        {{-- RIGHT: Booking / Price Card --}}
        <div class="col-md-4">
            <div class="card shadow-sm" style="border-radius:15px;">
                <div class="card-body">

                    <h4 class="fw-bold mb-3">
                        ${{ $listing->price }}
                        <span class="text-muted fs-6">/ month</span>
                    </h4>

                    {{-- Action Button --}}
                    <a href="{{ route('apartment.edit', $listing) }}"
                       class="btn btn-primary w-100 mb-2">
                        Edit Listing
                    </a>

                    <a href="{{ route('owner.dashboard') }}"
                       class="btn btn-outline-secondary w-100">
                        Back
                    </a>

                </div>
            </div>
        </div>

        <div class="card shadow-sm mt-3" style="border-radius:15px;">
            <div class="card-body">

                <h5 class="fw-bold mb-3">Set Open Hours</h5>

                <form action="{{ route('listing.hours.store', $listing) }}" method="POST">
                    @csrf

                    <div id="scheduleWrapper">

                    @if(isset($grouped) && count($grouped) > 0)

                        @foreach($grouped as $row)
                            <div class="schedule-row border rounded p-3 mb-3" style="border-radius:12px; background:#f9fbfd;">

                                <div class="row g-2">

                                    {{-- FROM DAY --}}
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

                                    {{-- TO DAY --}}
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

                                    {{-- START TIME --}}
                                    <div class="col-6">
                                        <label class="form-label small text-muted">Open Time</label>
                                        <input type="time" name="time_from[]" class="form-control"
                                            value="{{ $row['start_time'] }}">
                                    </div>

                                    {{-- END TIME --}}
                                    <div class="col-6">
                                        <label class="form-label small text-muted">Close Time</label>
                                        <input type="time" name="time_to[]" class="form-control"
                                            value="{{ $row['end_time'] }}">
                                    </div>

                                </div>
                            </div>
                        @endforeach

                    @else

                        {{-- fallback empty row --}}
                        <div class="schedule-row border rounded p-3 mb-3" style="border-radius:12px; background:#f9fbfd;">
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


                    {{-- SUBMIT --}}
                    <button type="submit" class="btn btn-primary w-100">
                        Save Open Hours
                    </button>

                </form>

            </div>
        </div>
    </div>

</div>
@endsection