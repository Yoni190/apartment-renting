@extends('web.client.layout.app')

@section('title', __('subscription.title'))

@section('content')
<div class="container my-5">
    <div class="row g-4 justify-content-center">

        <!-- Basic Plan -->
        <div class="col-md-6 col-lg-5">
            <div class="card shadow-sm h-100 p-4 border-0 rounded-4">
                <h4 class="mb-2">Basic Plan</h4>
                <p class="text-muted mb-3">2000 birr / annually</p>

                <ul class="mb-4">
                    <li>Access to basic features</li>
                    <li>Annual subscription</li>
                    <li>Affordable option</li>
                </ul>

                <form method="POST" action="{{ route('pay') }}">
                    @csrf
                    <input type="hidden" name="amount" value="2000">
                    <input type="hidden" name="plan_type" value="basic">
                    <button type="submit" class="btn btn-primary w-100">
                        Subscribe to Basic
                    </button>
                </form>
            </div>
        </div>

        <!-- Premium Plan -->
        <div class="col-md-6 col-lg-5">
            <div class="card shadow-sm h-100 p-4 border-0 rounded-4">
                <h4 class="mb-2">Premium Plan</h4>
                <p class="text-muted mb-3">5000 birr / annually</p>

                <ul class="mb-4">
                    <li>All basic features</li>
                    <li>Premium support</li>
                    <li>Full access to advanced features</li>
                </ul>

                <form method="POST" action="{{ route('pay') }}">
                    @csrf
                    <input type="hidden" name="amount" value="5000">
                    <input type="hidden" name="plan_type" value="premium">
                    <button type="submit" class="btn btn-success w-100">
                        Subscribe to Premium
                    </button>
                </form>
            </div>
        </div>

    </div>
</div>
@endsection