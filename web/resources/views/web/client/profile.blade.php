@extends('web.client.layout.app')

@section('title', __('profile.title'))

@section('content')
<div class="container my-5">

    <div class="profile-header-card mb-4">
        <div class="d-flex align-items-center gap-3">
            <div class="profile-avatar">
                {{ strtoupper(substr(auth()->user()->name ?? 'U', 0, 1)) }}
            </div>
            <div>
                <h4 class="mb-1">{{ auth()->user()->name ?? __('profile.user_name') }}</h4>
                <p class="text-muted mb-0">{{ auth()->user()->email ?? 'email@example.com' }}</p>
            </div>
        </div>
        <div class="d-flex">
            <a href="{{ route('user.client.edit-profile') }}" class="btn btn-primary">
                {{ __('profile.edit_profile') }}
            </a>
            @if(auth()->user()->role === 0 && auth()->user()->subscribed === 0)
                <a href="{{ route('subscription.page') }}" class="btn btn-warning ms-2">
                    {{ __('profile.subscribe_now') }}
                </a>
            @endif
        </div>
    </div>

    <div class="row g-4">
        <div class="col-md-6">
            <div class="info-card h-100">
                <h5 class="fw-semibold mb-3">{{ __('profile.personal_info') }}</h5>
                <div class="mb-3">
                    <div class="info-label">{{ __('profile.full_name') }}</div>
                    <div class="info-value">{{ auth()->user()->name ?? '-' }}</div>
                </div>
                <div class="mb-3">
                    <div class="info-label">{{ __('profile.email') }}</div>
                    <div class="info-value">{{ auth()->user()->email ?? '-' }}</div>
                </div>
                <div class="mb-3">
                    <div class="info-label">{{ __('profile.phone') }}</div>
                    <div class="info-value">{{ auth()->user()->phone_number ?? '-' }}</div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="info-card h-100">
                <h5 class="fw-semibold mb-3">{{ __('profile.account_info') }}</h5>
                <div class="mb-3">
                    <div class="info-label">{{ __('profile.joined') }}</div>
                    <div class="info-value">
                        {{ \Carbon\Carbon::parse(auth()->user()->created_at)->format('M d, Y') }}
                    </div>
                </div>
                <div class="mb-3">
                    <div class="info-label">{{ __('profile.status') }}</div>
                    <div class="info-value text-success">{{ __('profile.active') }}</div>
                </div>
                @if(auth()->user()->role === 0 && auth()->user()->subscribed === 1)
                    <div class="mb-3">
                        <div class="info-label">{{ __('subscription_plan') }}</div>
                        <div class="info-value">{{ ucfirst(auth()->user()->plan_type) }}</div>
                    </div>
                @endif
            </div>
        </div>
    </div>

</div>
@endsection
