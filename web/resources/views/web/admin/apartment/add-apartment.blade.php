@extends('web.admin.layout.app')
@section('title', 'Gojoye - Add Apartment')

@section('content')

<div class="container mt-4">

    <div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">Add New Apartment</h4>
        </div>

        <div class="card-body">

            <form action="#" method="POST">
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
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Owner</label>
                        <select name="owner" class="form-select">
                            <option disabled selected>Select owner...</option>
                            @foreach($users as $user)
                                <option value="{{ $user->id }}">{{ $user->name }}</option>
                            @endforeach
                        </select>
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
