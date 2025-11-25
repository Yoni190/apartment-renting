@extends('web.admin.layout.app')
@section('title', 'Gojoye - Edit Apartment')

@section('content')

<div class="container mt-4">

    <div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">Edit Apartment</h4>
        </div>

        <div class="card-body">

            <form action="{{ route('admin.edit-apartment', $apartment) }}" method="POST" enctype="multipart/form-data">
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
                            value="{{ $apartment->title }}"
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
                            value="{{ $apartment->address }}"   
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
                            value="{{ $apartment->price }}"
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
                            value="{{ $apartment->bedrooms }}"
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
                            value="{{ $apartment->bathrooms }}"
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
                            value="{{ $apartment->size }}"
                        >
                    </div>

                    <!-- Owner -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Owner</label>
                        <select name="owner" class="form-select">
                            <option disabled>Select owner...</option>
                            @foreach($users as $user)
                                <option value="{{ $user->id }}" {{ $apartment->user_id == $user->id ? 'selected' : ''}}>{{ $user->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <!-- Existing Images -->
                    @if($apartment->images && $apartment->images->count() > 0)
                    <div class="col-md-12">
                        <label class="form-label fw-semibold">Current Images</label>
                        <div class="border rounded p-4 bg-light">
                            <div class="row g-3" id="existing-images">
                                @foreach($apartment->images as $image)
                                <div class="col-md-3 col-6 existing-image-item" data-image-id="{{ $image->id }}">
                                    <div class="card position-relative">
                                        <img 
                                            src="{{ asset('storage/' . $image->path) }}" 
                                            class="card-img-top" 
                                            alt="Apartment Image"
                                            style="height: 150px; object-fit: cover;"
                                        >
                                        <div class="card-body p-2 text-center">
                                            <small class="text-muted">Image {{ $loop->iteration }}</small>
                                        </div>
                                        <button 
                                            type="button" 
                                            class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 remove-image-btn"
                                            data-image-id="{{ $image->id }}"
                                            title="Remove this image"
                                        >
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                </div>
                                @endforeach
                            </div>
                            
                            <!-- Hidden input to track removed images -->
                            <input type="hidden" name="removed_images" id="removedImages" value="">
                        </div>
                    </div>
                    @endif

                       <!-- New Images Upload -->
                    <div class="col-md-12">
                        <label class="form-label fw-semibold">Add New Images</label>
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
                        >{{ $apartment->description }}</textarea>
                    </div>
                </div>

                <div class="mt-4 text-end">
                    <button class="btn btn-success px-4 py-2">
                        <i class="bi bi-pencil-square"></i> Edit Apartment
                    </button>
                </div>

            </form>
        </div>
    </div>

</div>

@endsection


@push('scripts')
<script>
    // Track removed images
    const removedImages = new Set();
    
    // Remove existing image
    document.querySelectorAll('.remove-image-btn').forEach(button => {
        button.addEventListener('click', function() {
            const imageId = this.getAttribute('data-image-id');
            const imageItem = this.closest('.existing-image-item');
            
            // Add to removed images set
            removedImages.add(imageId);
            
            // Update hidden input
            document.getElementById('removedImages').value = Array.from(removedImages).join(',');
            
            // Visual feedback - fade out and mark for removal
            imageItem.style.opacity = '0.5';
            imageItem.style.border = '2px solid red';
            this.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
            this.classList.remove('btn-danger');
            this.classList.add('btn-warning');
            this.title = 'Click to undo removal';
            
            // Change click handler to undo
            this.onclick = function() {
                removedImages.delete(imageId);
                document.getElementById('removedImages').value = Array.from(removedImages).join(',');
                imageItem.style.opacity = '1';
                imageItem.style.border = '';
                this.innerHTML = '<i class="bi bi-x-lg"></i>';
                this.classList.remove('btn-warning');
                this.classList.add('btn-danger');
                this.title = 'Remove this image';
                this.onclick = arguments.callee; // Restore original handler
            };
        });
    });

    // New images preview functionality
    document.getElementById('images').addEventListener('change', function(event) {
        const preview = document.getElementById('preview');
        const fileCount = document.getElementById('fileCount');
        
        const files = event.target.files;
        console.log('Total files selected:', files.length);
        
        // Update file count display
        if (files.length > 0) {
            fileCount.style.display = 'block';
            fileCount.textContent = `${files.length} new file(s) selected`;
        } else {
            fileCount.style.display = 'none';
        }
        
        // Clear previous preview (only new files preview)
        preview.innerHTML = '';
        
        // Debug: log each file
        for (let i = 0; i < files.length; i++) {
            console.log(`File ${i}:`, files[i].name, files[i].size, files[i].type);
        }
        
        // Create preview for each new file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (!file.type.startsWith('image/')) {
                console.log('Skipping non-image file:', file.name);
                continue;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const col = document.createElement('div');
                col.className = 'position-relative';
                col.style.width = '120px';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('m-1', 'rounded', 'shadow-sm');
                img.style.width = '100%';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                img.title = file.name;
                
                // Add file name badge (for new files)
                const badge = document.createElement('div');
                badge.className = 'position-absolute top-0 start-0 bg-success text-white px-1 small';
                badge.style.fontSize = '0.7rem';
                badge.textContent = 'NEW';
                
                col.appendChild(img);
                col.appendChild(badge);
                preview.appendChild(col);
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission confirmation
    document.querySelector('form').addEventListener('submit', function(e) {
        const removedCount = removedImages.size;
        const newFiles = document.getElementById('images').files.length;
        
        if (removedCount > 0 || newFiles > 0) {
            const message = 
                (removedCount > 0 ? `Removing ${removedCount} image(s). ` : '') +
                (newFiles > 0 ? `Adding ${newFiles} new image(s). ` : '') +
                'Continue?';
            
            if (!confirm(message)) {
                e.preventDefault();
            }
        }
    });
</script>

<style>
.existing-image-item {
    transition: all 0.3s ease;
}

.existing-image-item:hover {
    transform: translateY(-2px);
}

.remove-image-btn {
    opacity: 0.8;
    transition: all 0.3s ease;
}

.remove-image-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}
</style>
@endpush
