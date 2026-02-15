@extends('web.client.layout.app')

@section('title', 'Gojoye - Tours')

@push('styles')
<style>
.tour-card {
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 8px 25px rgba(0,0,0,0.05);
    transition: all 0.25s ease;
    overflow: hidden;
}
.tour-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.08);
}

.status-badge {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 500;
}

.status-Pending { background: #fff3cd; color: #856404; }
.status-Approved { background: #d4edda; color: #155724; }
.status-Rejected { background: #f8d7da; color: #721c24; }
.status-Canceled { background: #e2e3e5; color: #383d41; }
.status-Completed { background: #d1ecf1; color: #0c5460; }

.tour-img {
    height: 180px;
    object-fit: cover;
    width: 100%;
}

.empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #777;
}
</style>
@endpush

@section('content')
<div class="container py-5">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold mb-1">My Tour Requests</h2>
            <p class="text-muted mb-0">Track and manage your apartment tour bookings</p>
        </div>
    </div>

    @if($tours->isEmpty())
        <div class="empty-state">
            <h4 class="fw-semibold">No tour requests yet</h4>
            <p>Start exploring apartments and book your first tour.</p>
        </div>
    @else
        <div class="row g-4">

            @foreach($tours as $tour)
                <div class="col-md-6 col-lg-4">
                    <div class="tour-card">

                        {{-- Thumbnails --}}
                        @if($tour->listing && $tour->listing->images->isNotEmpty())
                            <img 
                                src="{{ url('/storage/' . $tour->listing->images->first()->path) }}"
                                class="tour-img"
                            >
                        @else
                            <img 
                                src="https://via.placeholder.com/400x200" 
                                class="tour-img"
                            >
                        @endif

                        <div class="p-3">

                            <!-- Title -->
                            <h5 class="fw-semibold mb-1">
                                {{ $tour->listing->title ?? 'Apartment' }}
                            </h5>

                            <!-- Date -->
                            <p class="text-muted mb-2">
                                {{ \Carbon\Carbon::parse($tour->scheduled_at)->format('M d, Y • H:i') }}
                            </p>

                            <!-- Status -->
                            <div class="mb-3">
                                <span class="status-badge status-{{ str_replace(' ', '-', $tour->status) }}">
                                    {{ $tour->status }}
                                </span>
                            </div>

                            <!-- Note -->
                            @if($tour->note)
                                <p class="small text-muted mb-3">
                                    "{{ $tour->note }}"
                                </p>
                            @endif

                            <!-- Actions -->
                            <div class="d-flex justify-content-between align-items-center">

                                <a href="{{ route('listing.details', $tour->listing) }}" 
                                   class="btn btn-sm btn-outline-primary">
                                    View
                                </a>

                                @if($tour->status === \App\Models\TourBooking::STATUS_PENDING)
                                    <form method="POST" action="{{ route('tours.cancel', $tour->id) }}">
                                        @csrf
                                        @method('PATCH')
                                        <button class="btn btn-sm btn-outline-danger">
                                            Cancel
                                        </button>
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