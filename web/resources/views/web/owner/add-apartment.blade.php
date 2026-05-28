@extends('web.client.layout.app')

@section('title', 'Gojoye - Add Apartment')

@section('content')
<div class="container mt-4">
    <div class="info-card card p-4 mx-auto mw-800">
        <h3 class="mb-4">Add New Apartment</h3>

        <form action="{{ route('apartment.store') }}" method="POST" enctype="multipart/form-data">
            @csrf

            <div class="row mb-3">
                <div class="col-md-6 mb-3 mb-md-0">
                    <label class="form-label">Title</label>
                    <input type="text" name="title" class="form-control" placeholder="Modern 2-bedroom apartment" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Address</label>
                    <input type="text" name="address" class="form-control" placeholder="Bole, Addis Ababa" required>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="form-label">Price</label>
                    <input type="number" name="price" class="form-control" placeholder="5000" required>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="form-label">Bedrooms</label>
                    <input type="number" name="bedrooms" class="form-control" placeholder="2" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Bathrooms</label>
                    <input type="number" name="bathrooms" class="form-control" placeholder="1" required>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Size (m&sup2;)</label>
                    <input type="number" name="size" class="form-control" placeholder="120" required>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea name="description" rows="4" class="form-control" placeholder="Describe the apartment..." required></textarea>
            </div>

            <div class="mb-4">
                <label class="form-label">Images</label>
                <input type="file" name="images[]" class="form-control" multiple>
                <div class="form-text text-muted">You can upload multiple images</div>
            </div>

            <div class="d-flex justify-content-end">
                <a href="{{ url()->previous() }}" class="btn btn-ghost me-2">Cancel</a>
                <button type="submit" class="btn btn-primary">Create Apartment</button>
            </div>
        </form>
    </div>
</div>
@endsection
