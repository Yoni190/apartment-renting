@extends('web.client.layout.app')

@section('title', 'Gojoye - Edit Apartment')

@section('content')
<div class="container mt-4">
    <div class="info-card card p-4 mx-auto mw-800">
        <h3 class="mb-4">Edit Apartment</h3>

        <form action="{{ route('apartment.update', $apartment) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="row mb-3">
                <div class="col-md-6 mb-3 mb-md-0">
                    <label class="form-label">Title</label>
                    <input type="text" name="title" class="form-control" value="{{ old('title', $apartment->title) }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Address</label>
                    <input type="text" name="address" class="form-control" value="{{ old('address', $apartment->address) }}" required>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="form-label">Price</label>
                    <input type="number" name="price" class="form-control" value="{{ old('price', $apartment->price) }}" required>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="form-label">Bedrooms</label>
                    <input type="number" name="bedrooms" class="form-control" value="{{ old('bedrooms', $apartment->bedrooms) }}" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Bathrooms</label>
                    <input type="number" name="bathrooms" class="form-control" value="{{ old('bathrooms', $apartment->bathrooms) }}" required>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Size (m&sup2;)</label>
                    <input type="number" name="size" class="form-control" value="{{ old('size', $apartment->size) }}" required>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea name="description" rows="4" class="form-control" required>{{ old('description', $apartment->description) }}</textarea>
            </div>

            @if($apartment->images && count($apartment->images) > 0)
                <div class="mb-3">
                    <label class="form-label">Current Images</label>
                    <div class="d-flex flex-wrap gap-2">
                        @foreach($apartment->images as $image)
                            <img src="{{ url('/storage/' . $image->path) }}" class="object-fit-cover rounded" width="100" height="80" alt="">
                        @endforeach
                    </div>
                </div>
            @endif

            <div class="mb-4">
                <label class="form-label">Upload New Images</label>
                <input type="file" name="images[]" class="form-control" multiple>
                <div class="form-text text-muted">Uploading new images may replace old ones (depending on backend logic)</div>
            </div>

            <div class="d-flex justify-content-end">
                <a href="{{ url()->previous() }}" class="btn btn-ghost me-2">Cancel</a>
                <button type="submit" class="btn btn-primary">Update Apartment</button>
            </div>
        </form>
    </div>
</div>
@endsection
