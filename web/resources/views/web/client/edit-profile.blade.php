@extends('web.client.layout.app')

@section('title', 'Gojoye - Edit Profile')

@push('styles')
<style>
.form-card {
    border-radius: 12px;
    padding: 25px;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.profile-avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    color: #6c757d;
}

.section-title {
    font-weight: 600;
    margin-bottom: 20px;
}

.form-control {
    border-radius: 8px;
}

.btn-save {
    border-radius: 8px;
    padding: 10px;
    font-weight: 500;
}
</style>
@endpush

@section('content')

<div class="container my-5">

    <div class="row justify-content-center">
        <div class="col-lg-8">

            <div class="form-card">

                <!-- Header -->
                <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="profile-avatar">
                        {{ strtoupper(substr(auth()->user()->name ?? 'U', 0, 1)) }}
                    </div>

                    <div>
                        <h4 class="mb-0">Edit Profile</h4>
                        <small class="text-muted">Update your personal information</small>
                    </div>
                </div>

                <!-- Form -->
                <form method="POST" action="">
                    @csrf
                    @method('PUT')

                    <div class="row g-3">

                        <!-- Name -->
                        <div class="col-md-6">
                            <label class="form-label">Full Name</label>
                            <input type="text" 
                                   name="name" 
                                   class="form-control"
                                   value="{{ old('name', auth()->user()->name) }}">
                        </div>

                        <!-- Email -->
                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" 
                                   name="email" 
                                   class="form-control"
                                   value="{{ old('email', auth()->user()->email) }}">
                        </div>

                        <!-- Phone -->
                        <div class="col-md-12">
                            <label class="form-label">Phone</label>
                            <input type="text" 
                                   name="phone" 
                                   class="form-control"
                                   value="{{ old('phone', auth()->user()->phone_number) }}">
                        </div>

                    </div>

                    <!-- Submit -->
                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary btn-save w-100">
                            Update Profile
                        </button>
                    </div>

                </form>

            </div>

        </div>
    </div>

</div>

@endsection