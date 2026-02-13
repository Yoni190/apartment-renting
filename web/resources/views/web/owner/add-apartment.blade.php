@extends('web.client.layout.app')

@push('styles')

<style>
.submit-btn {
    background: linear-gradient(135deg, #46c0e5ff, #33cfeaff);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    transition: all 0.25s ease;
    box-shadow: 0 6px 14px rgba(79, 70, 229, 0.25);
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.35);
}
</style>

@endpush

@section('content')
<div class="container mt-4">
    <div class="card shadow-sm border-0">
        <div class="card-body p-4">
            <h3 class="mb-4">Add New Apartment</h3>

            <form action="{{ route('apartment.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <!-- Title & Address -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Title</label>
                        <input type="text" name="title" class="form-control" placeholder="Modern 2-bedroom apartment" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Address</label>
                        <input type="text" name="address" class="form-control" placeholder="Bole, Addis Ababa" required>
                    </div>
                </div>

                <!-- Price, Bedrooms, Bathrooms -->
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label class="form-label">Price</label>
                        <input type="number" name="price" class="form-control" placeholder="5000" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Bedrooms</label>
                        <input type="number" name="bedrooms" class="form-control" placeholder="2" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Bathrooms</label>
                        <input type="number" name="bathrooms" class="form-control" placeholder="1" required>
                    </div>
                </div>

                <!-- Size -->
                <div class="mb-3">
                    <label class="form-label">Size (m²)</label>
                    <input type="number" name="size" class="form-control" placeholder="120" required>
                </div>

                <!-- Description -->
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea name="description" rows="4" class="form-control" placeholder="Describe the apartment..." required></textarea>
                </div>

                <!-- Images -->
                <div class="mb-4">
                    <label class="form-label">Images</label>
                    <input type="file" name="images[]" class="form-control" multiple>
                    <small class="text-muted">You can upload multiple images</small>
                </div>

                <!-- Submit -->
                <div class="d-flex justify-content-end">
                    <a href="{{ url()->previous() }}" class="btn btn-light me-2">Cancel</a>
                    <button type="submit" class="btn submit-btn">
                        Create Apartment
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection