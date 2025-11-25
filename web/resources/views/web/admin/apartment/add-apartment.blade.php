@extends('web.admin.layout.app')
@section('title', 'Gojoye - Add Apartment')

@section('content')

<div class="container mt-4">

    <div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">Add New Apartment</h4>
        </div>

        <div class="card-body">

            <form action="{{ route('admin.add-apartment') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="row g-4">
                    <!-- Apartment Name -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Apartment Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            class="form-control" 
                            placeholder="Enter apartment name..." 
                        >
                    </div>

                    <!-- Address -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            class="form-control"
                            placeholder="Enter address..."
                        >
                    </div>

                    <!-- Price -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Price (ETB)</label>
                        <input 
                            type="number" 
                            name="price" 
                            class="form-control" 
                            placeholder="Enter price..."
                        >
                    </div>

                    <!-- Bedrooms -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Bedrooms</label>
                        <input 
                            type="number" 
                            name="bedrooms" 
                            class="form-control" 
                            placeholder="Number of bedrooms"
                        >
                    </div>

                    <!-- Bathrooms -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Bathrooms</label>
                        <input 
                            type="number" 
                            name="bathrooms" 
                            class="form-control" 
                            placeholder="Number of bathrooms"
                        >
                    </div>

                    <!-- Size -->
                     <div class="col-md-4">
                        <label class="form-label fw-semibold">Size</label>
                        <input 
                            type="number" 
                            name="size" 
                            class="form-control" 
                            placeholder="Size"
                        >
                    </div>

                    <!-- Owner -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Owner</label>
                        <select name="owner" class="form-select">
                            <option disabled selected>Select owner...</option>
                            @foreach($users as $user)
                                <option value="{{ $user->id }}">{{ $user->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Featured Status -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Featured Status</label>
                        <select name="featured" class="form-select">
                            <option disabled selected>Set featured status...</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>

                    <!-- Picture Upload -->
                    <div class="col-md-12">
                        <label class="form-label fw-semibold">Apartment Images</label>
                        <div class="border rounded p-4 text-center bg-light" 
                            style="border-style: dashed !important; border-color: #6c757d !important;">
                            
                            <input 
                                type="file" 
                                name="images[]" 
                                id="images" 
                                class="form-control" 
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" 
                                multiple
                                style="height: auto; padding: 0.5rem;"
                            >
                            
                            <div class="mt-2">
                                <small class="form-text text-muted">
                                    <i class="bi bi-info-circle"></i> 
                                    Hold <kbd>Ctrl</kbd> (Windows) or <kbd>Cmd</kbd> (Mac) to select multiple images
                                </small>
                            </div>
                            
                            <div id="preview" class="d-flex flex-wrap justify-content-center mt-3 gap-2"></div>
                            
                            <!-- File count indicator -->
                            <div id="fileCount" class="mt-2 text-info small fw-semibold" style="display: none;"></div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="col-md-12">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea 
                            name="description" 
                            class="form-control" 
                            rows="3" 
                            placeholder="Write a short description about the apartment..."
                        ></textarea>
                    </div>
                </div>

                <div class="mt-4 text-end">
                    <button class="btn btn-success px-4 py-2">
                        <i class="bi bi-plus-circle"></i> Add Apartment
                    </button>
                </div>

            </form>
        </div>
    </div>

</div>

@endsection

@push('scripts')
<script>
    document.getElementById('images').addEventListener('change', function(event) {
    const preview = document.getElementById('preview');
    
    
    const files = event.target.files;
    console.log('Total files selected:', files.length);
    
    // Debug: log each file
    for (let i = 0; i < files.length; i++) {
        console.log(`File ${i}:`, files[i].name, files[i].size, files[i].type);
    }
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
            console.log('Skipping non-image file:', file.name);
            continue;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('m-2', 'rounded', 'shadow-sm');
            img.style.width = '120px';
            img.style.height = '100px';
            img.style.objectFit = 'cover';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});
</script>
@endpush


