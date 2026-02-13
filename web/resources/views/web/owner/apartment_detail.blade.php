@extends('web.client.layout.app')

@section('content')
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
    </div>

</div>
@endsection