@extends('web.client.layout.app')

@section('title', __('subscription.title'))

@section('content')
<div class="container my-5">
    <div class="row g-4 justify-content-center">

        <!-- Basic Plan -->
        <div class="col-md-6 col-lg-5">
            <div class="card shadow-sm h-100 p-4 border-0 rounded-4">
                <h4 class="mb-2">{{ __('basic_plan') }}</h4>
                <p class="text-muted mb-3">{{ __('basic_plan_price') }}</p>

                <ul class="mb-4">
                    <li>{{ __('basic_plan_feature_1') }}</li>
                    <li>{{ __('basic_plan_feature_2') }}</li>
                    <li>{{ __('basic_plan_feature_3') }}</li>
                </ul>

                <form method="POST" action="{{ route('pay') }}">
                    @csrf
                    <input type="hidden" name="amount" value="2000">
                    <input type="hidden" name="plan_type" value="basic">
                    <button type="submit" class="btn btn-primary w-100">
                        {{ __('subscribe_to_basic') }}
                    </button>
                </form>
            </div>
        </div>

        <!-- Premium Plan -->
        <div class="col-md-6 col-lg-5">
            <div class="card shadow-sm h-100 p-4 border-0 rounded-4">
                <h4 class="mb-2">{{ __('premium_plan') }}</h4>
                <p class="text-muted mb-3">{{ __('premium_plan_price') }}</p>

                <ul class="mb-4">
                    <li>{{ __('premium_plan_feature_1') }}</li>
                    <li>{{ __('premium_plan_feature_2') }}</li>
                    <li>{{ __('premium_plan_feature_3') }}</li>
                </ul>

                <form method="POST" action="{{ route('pay') }}">
                    @csrf
                    <input type="hidden" name="amount" value="5000">
                    <input type="hidden" name="plan_type" value="premium">
                    <button type="submit" class="btn btn-success w-100">
                        {{ __('subscribe_to_premium') }}
                    </button>
                </form>
            </div>
        </div>

    </div>
</div>
@endsection