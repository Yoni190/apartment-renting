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

            <!-- Location Details Section -->
            <div class="mb-3">
                <label class="form-label fw-bold">Location Details</label>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Sub City</label>
                        <select name="sub_city" class="form-control" required>
                            <option value="">Select Sub City</option>
                            <option value="Addis Ketema" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Addis Ketema' ? 'selected' : '' }}>Addis Ketema</option>
                            <option value="Akaky Kaliti" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Akaky Kaliti' ? 'selected' : '' }}>Akaky Kaliti</option>
                            <option value="Arada" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Arada' ? 'selected' : '' }}>Arada</option>
                            <option value="Bole" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Bole' ? 'selected' : '' }}>Bole</option>
                            <option value="Gulele" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Gulele' ? 'selected' : '' }}>Gulele</option>
                            <option value="Kirkos" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Kirkos' ? 'selected' : '' }}>Kirkos</option>
                            <option value="Kolfe Keranio" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Kolfe Keranio' ? 'selected' : '' }}>Kolfe Keranio</option>
                            <option value="Lideta" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Lideta' ? 'selected' : '' }}>Lideta</option>
                            <option value="Nifas Silk-Lafto" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Nifas Silk-Lafto' ? 'selected' : '' }}>Nifas Silk-Lafto</option>
                            <option value="Yeka" {{ old('sub_city', $apartment->location->sub_city ?? '') == 'Yeka' ? 'selected' : '' }}>Yeka</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Woreda</label>
                        <input type="text" name="woreda" class="form-control" 
                               value="{{ old('woreda', $apartment->location->woreda ?? '') }}" 
                               placeholder="e.g., Woreda 03" required>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Kebele</label>
                        <input type="text" name="kebele" class="form-control" 
                               value="{{ old('kebele', $apartment->location->kebele ?? '') }}" 
                               placeholder="e.g., Kebele 16/17" required>
                    </div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="form-label">Type</label>
                    <select name="type" class="form-control" required>
                        <option value="sale" {{ old('type', $apartment->type) === 'sale' ? 'selected' : '' }}>
                            Sale
                        </option>
                        <option value="rent" {{ old('type', $apartment->type) === 'rent' ? 'selected' : '' }}>
                            Rent
                        </option>
                    </select>
                </div>
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
