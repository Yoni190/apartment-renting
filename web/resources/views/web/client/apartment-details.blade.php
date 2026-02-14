@extends('web.client.layout.app')

@section('title', $apartment->title)

@push('styles')
<style>
/* Hero Image */
.apartment-hero {
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
}
.apartment-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Card Sections */
.info-card {
    border-radius: 12px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

/* Price Box */
.price-box {
    border-radius: 12px;
    padding: 20px;
    background: #f8f9fa;
    text-align: center;
}

/* Meta badges */
.badge-soft {
    background: #eef2ff;
    color: #4f46e5;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
}
</style>
@endpush

@section('content')

<div class="container my-5">

    <!-- Title -->
    <div class="mb-3">
        <h2 class="fw-bold">{{ $apartment->title }}</h2>
        <p class="text-muted mb-1">
            <i class="bi bi-geo-alt"></i> {{ $apartment->address }}
        </p>
    </div>

    <!-- Hero Image -->
    <div class="apartment-hero mb-4">
        @if($apartment->images && $apartment->images->count() > 0)
            <img src="{{ asset('storage/' . $apartment->images->first()->path) }}" alt="">
        @else
            <img src="https://via.placeholder.com/1200x400?text=No+Image" alt="">
        @endif
    </div>

    <div class="row g-4">

        <!-- LEFT SIDE -->
        <div class="col-lg-8">

            <!-- Overview -->
            <div class="info-card mb-4">
                <h5 class="fw-bold mb-3">Overview</h5>

                <div class="d-flex gap-3 mb-3 flex-wrap">
                    <span class="badge-soft">{{ $apartment->bedrooms }} Bedrooms</span>
                    <span class="badge-soft">{{ $apartment->bathrooms }} Bathrooms</span>
                    <span class="badge-soft">{{ $apartment->size }} m²</span>
                </div>

                <p class="text-muted">
                    {{ $apartment->description }}
                </p>
            </div>

            <!-- Details -->
            <div class="info-card mb-4">
                <h5 class="fw-bold mb-3">Details</h5>

                <div class="row">
                    <div class="col-md-6 mb-2">
                        <strong>Status:</strong> 
                        {{ $apartment->status ? 'Available' : 'Not Available' }}
                    </div>

                    <div class="col-md-6 mb-2">
                        <strong>Verification:</strong> 
                        {{ ucfirst($apartment->verification_status) }}
                    </div>

                    <div class="col-md-6 mb-2">
                        <strong>Listed On:</strong> 
                        {{ \Carbon\Carbon::parse($apartment->created_at)->format('M d, Y') }}
                    </div>

                    <div class="col-md-6 mb-2">
                        <strong>Featured:</strong> 
                        {{ $apartment->is_featured ? 'Yes' : 'No' }}
                    </div>
                </div>
            </div>

        </div>

        <!-- RIGHT SIDE -->
        <div class="col-lg-4">

            <!-- Price Box -->
            <div class="price-box mb-4">
                <h3 class="fw-bold text-primary">
                    ${{ number_format($apartment->price) }}
                </h3>
                <p class="text-muted mb-3">per month</p>

                <button class="btn btn-primary w-100 mb-2">
                    Contact Owner
                </button>

                <form action="{{ route('favorites.store') }}" method="POST">
                    @csrf

                    <input type="hidden" name="apartment_id" value="{{ $apartment->id }}">

                    <button type="submit" class="btn btn-outline-secondary w-100">
                        Save Listing
                    </button>
                </form>
            </div>

            <!-- Owner Info (optional if relation exists) -->
            @if(isset($apartment->owner))
            <div class="info-card">
                <h6 class="fw-bold mb-3">Owner</h6>
                <p class="mb-1">{{ $apartment->owner->name ?? 'Owner' }}</p>
                <small class="text-muted">Property Owner</small>
            </div>
            @endif

            <div class="card p-3 mt-3" style="border-radius:15px;">
                <h6 class="fw-bold mb-3">Available Tour Times</h6>

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

                    $grouped = $apartment->openHours
                        ->groupBy(fn($i) => $i->start_time . '-' . $i->end_time);
                @endphp

                @foreach($grouped as $key => $items)
                    @php
                        $days = $items->pluck('day_of_week')->sort()->values();
                    @endphp

                    <div class="border rounded p-2 mb-2">
                        <strong>
                            {{ $daysMap[$days->first()] }} - {{ $daysMap[$days->last()] }}
                        </strong>
                        <br>
                        <small class="text-muted">
                            {{ \Carbon\Carbon::parse($items->first()->start_time)->format('h:i A') }}
                            -
                            {{ \Carbon\Carbon::parse($items->first()->end_time)->format('h:i A') }}
                        </small>
                    </div>
                @endforeach
            </div>
            <form action="" method="POST" class="mt-3">
                @csrf

                <input type="hidden" name="apartment_id" value="{{ $apartment->id }}">

                {{-- SELECT DAY --}}
                <div class="mb-2">
                    <label class="form-label">Select Day</label>
                    <select name="day" class="form-select" required>
                        @foreach($apartment->openHours->unique('day_of_week') as $hour)
                            <option value="{{ $hour->day_of_week }}">
                                {{ $daysMap[$hour->day_of_week] }}
                            </option>
                        @endforeach
                    </select>
                </div>

            {{-- SELECT TIME --}}
            <div class="mb-2">
                <label class="form-label">Select Time</label>
                <select name="time" id="timeSelect" class="form-select" required>
                    <option value="">Select a time</option>
                </select>
            </div>

                <button type="submit" class="btn btn-success w-100">
                    Request Tour
                </button>
            </form>

        </div>

    </div>

</div>

@endsection


@push('scripts')

<script>
document.addEventListener('DOMContentLoaded', function () {

    const openHours = @json($apartment->openHours);

    const daySelect = document.querySelector('select[name="day"]');
    const timeSelect = document.getElementById('timeSelect');

    if (!daySelect || !timeSelect) return; // safety

    function generateSlots(day) {
        timeSelect.innerHTML = '<option value="">Select a time</option>';

        const slots = openHours.filter(h => Number(h.day_of_week) === Number(day));

        slots.forEach(slot => {
            let current = new Date(`1970-01-01T${slot.start_time}`);
            let endTime = new Date(`1970-01-01T${slot.end_time}`);

            while (current < endTime) {
                let hours = String(current.getHours()).padStart(2, '0');
                let minutes = String(current.getMinutes()).padStart(2, '0');

                let option = document.createElement('option');
                option.value = `${hours}:${minutes}:00`;
                option.textContent = formatTime(current);

                timeSelect.appendChild(option);

                current.setMinutes(current.getMinutes() + 30);
            }
        });
    }

    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${ampm}`;
    }

    daySelect.addEventListener('change', function () {
        generateSlots(this.value);
    });

    // trigger on load
    generateSlots(daySelect.value);

});
</script>
@endpush