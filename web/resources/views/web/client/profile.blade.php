@extends('web.client.layout.app')

@section('title', 'Gojoye - Profile')

@push('styles')
<style>
.profile-card {
    border-radius: 12px;
    padding: 25px;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
}

.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
    color: #6c757d;
}

.info-label {
    font-size: 0.85rem;
    color: #6c757d;
}

.info-value {
    font-weight: 500;
}

.section-title {
    font-weight: 600;
    margin-bottom: 15px;
}
</style>
@endpush

@section('content')

<div class="container my-5">

    <!-- Profile Header -->
    <div class="profile-card mb-4 d-flex justify-content-between flex-wrap align-items-center">

        <div class="d-flex align-items-center gap-3">
            <div class="profile-avatar">
                {{ strtoupper(substr(auth()->user()->name ?? 'U', 0, 1)) }}
            </div>

            <div>
                <h4 class="mb-1">{{ auth()->user()->name ?? 'User Name' }}</h4>
                <p class="text-muted mb-0">{{ auth()->user()->email ?? 'email@example.com' }}</p>
            </div>
        </div>

        <a href="{{ route('user.client.edit-profile') }}" class="btn btn-primary">
            Edit Profile
        </a>

    </div>

    <!-- Profile Details -->
    <div class="row g-4">

        <!-- Personal Info -->
        <div class="col-md-6">
            <div class="profile-card h-100">
                <h5 class="section-title">Personal Information</h5>

                <div class="mb-3">
                    <div class="info-label">Full Name</div>
                    <div class="info-value">{{ auth()->user()->name ?? '-' }}</div>
                </div>

                <div class="mb-3">
                    <div class="info-label">Email</div>
                    <div class="info-value">{{ auth()->user()->email ?? '-' }}</div>
                </div>

                <div class="mb-3">
                    <div class="info-label">Phone</div>
                    <div class="info-value">{{ auth()->user()->phone_number ?? '-' }}</div>
                </div>
            </div>
        </div>

        <!-- Account Info -->
        <div class="col-md-6">
            <div class="profile-card h-100">
                <h5 class="section-title">Account Information</h5>

                <div class="mb-3">
                    <div class="info-label">Joined</div>
                    <div class="info-value">
                        {{ \Carbon\Carbon::parse(auth()->user()->created_at)->format('M d, Y') }}
                    </div>
                </div>

                <div class="mb-3">
                    <div class="info-label">Status</div>
                    <div class="info-value text-success">
                        Active
                    </div>
                </div>
            </div>
        </div>

    </div>

</div>

@endsection