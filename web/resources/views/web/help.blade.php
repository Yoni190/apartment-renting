@extends('web.client.layout.app')

@section('title', __('Gojoye - Help'))

@push('styles')
<style>
    .help-hero {
        background: linear-gradient(135deg, #9fc5f8, #5b9def);
        color: white;
        padding: 60px 0;
        border-radius: 0 0 20px 20px;
        text-align: center;
    }

    .help-section {
        margin-top: 40px;
    }

    .help-card {
        border: none;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        transition: transform 0.2s ease;
        height: 100%;
    }

    .help-card:hover {
        transform: translateY(-5px);
    }

    .step-badge {
        background: #9fc5f8;
        color: white;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .faq-item {
        border-bottom: 1px solid #eee;
        padding: 15px 0;
    }

    .faq-question {
        font-weight: 600;
        cursor: pointer;
    }

    .faq-answer {
        margin-top: 8px;
        color: #666;
    }
</style>
@endpush

@section('content')

<!-- Hero -->
<div class="help-hero">
    <div class="container">
        <h1 class="fw-bold">{{ __('How Gojoye Works') }}</h1>
        <p class="lead mb-0">{{ __('Find help for renters, buyers, and property owners') }}</p>
    </div>
</div>

<div class="container help-section">

    <!-- Overview -->
    <div class="text-center mb-5">
        <h2 class="fw-bold">{{ __('What is Gojoye?') }}</h2>
        <p class="text-muted">
            {{ __('Gojoye is a real estate platform where property owners can list apartments for rent or sale after subscribing, and clients can easily browse, book, and communicate with owners.') }}
        </p>
    </div>

    <!-- Two Roles -->
    <div class="row g-4">

        <!-- Owners -->
        <div class="col-md-6">
            <div class="card help-card p-4">
                <h4 class="fw-bold mb-3">{{ __('For Property Owners') }}</h4>

                <div class="d-flex mb-3">
                    <div class="step-badge me-3">1</div>
                    <div>
                        <strong>{{ __('Subscribe') }}</strong>
                        <p class="mb-0 text-muted">{{ __('Choose a subscription plan to start listing your properties.') }}</p>
                    </div>
                </div>

                <div class="d-flex mb-3">
                    <div class="step-badge me-3">2</div>
                    <div>
                        <strong>{{ __('Add Properties') }}</strong>
                        <p class="mb-0 text-muted">{{ __('Post your apartments for rent or sale with images and details.') }}</p>
                    </div>
                </div>

                <div class="d-flex">
                    <div class="step-badge me-3">3</div>
                    <div>
                        <strong>{{ __('Manage Requests') }}</strong>
                        <p class="mb-0 text-muted">{{ __('Receive booking requests and chat with potential clients.') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Clients -->
        <div class="col-md-6">
            <div class="card help-card p-4">
                <h4 class="fw-bold mb-3">{{ __('For Clients') }}</h4>

                <div class="d-flex mb-3">
                    <div class="step-badge me-3">1</div>
                    <div>
                        <strong>{{ __('Browse Listings') }}</strong>
                        <p class="mb-0 text-muted">{{ __('Search apartments by location, price, or type.') }}</p>
                    </div>
                </div>

                <div class="d-flex mb-3">
                    <div class="step-badge me-3">2</div>
                    <div>
                        <strong>{{ __('Make Booking Requests') }}</strong>
                        <p class="mb-0 text-muted">{{ __('Request to view or reserve apartments easily.') }}</p>
                    </div>
                </div>

                <div class="d-flex">
                    <div class="step-badge me-3">3</div>
                    <div>
                        <strong>{{ __('Chat with Owners') }}</strong>
                        <p class="mb-0 text-muted">{{ __('Communicate directly to ask questions or negotiate.') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- FAQ -->
    <div class="mt-5">
        <h3 class="fw-bold text-center mb-4">{{ __('Frequently Asked Questions') }}</h3>

        <div class="card help-card p-4">

            <div class="faq-item">
                <div class="faq-question">{{ __('Do I need to pay to browse apartments?') }}</div>
                <div class="faq-answer">{{ __('No, browsing apartments is completely free for clients.') }}</div>
            </div>

            <div class="faq-item">
                <div class="faq-question">{{ __('How do property owners post listings?') }}</div>
                <div class="faq-answer">{{ __('Owners must subscribe to a plan before they can add properties.') }}</div>
            </div>

            <div class="faq-item">
                <div class="faq-question">{{ __('Can I chat with property owners?') }}</div>
                <div class="faq-answer">{{ __('Yes, clients can directly chat with owners after viewing a property.') }}</div>
            </div>

        </div>
    </div>

    <!-- CTA -->
    <div class="text-center mt-5 mb-5">
        <h4 class="fw-bold">{{ __('Need more help?') }}</h4>
        <p class="text-muted">{{ __('Contact our support team anytime.') }}</p>

        <a href="mailto:yonatanadhanom00@gmail.com?subject=Support%20Request%20-%20Gojoye"
        class="btn btn-primary px-4">
            {{ __('Contact Support') }}
        </a>
    </div>

</div>

@endsection