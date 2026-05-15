@extends('web.client.layout.app')

@section('title', __('Gojoye - Help'))

@section('content')

<div class="help-hero">
    <div class="container">
        <h1 class="fw-bold">{{ __('How Gojoye Works') }}</h1>
        <p class="lead mb-0">{{ __('Find help for renters, buyers, and property owners') }}</p>
    </div>
</div>

<div class="container py-5">

    <div class="text-center mb-5">
        <h2 class="fw-bold">{{ __('What is Gojoye?') }}</h2>
        <p class="text-muted mx-auto w-75">
            {{ __('Gojoye is a real estate platform where property owners can list apartments for rent or sale after subscribing, and clients can easily browse, book, and communicate with owners.') }}
        </p>
    </div>

    <div class="row g-4">
        <div class="col-md-6">
            <div class="help-card p-4">
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

        <div class="col-md-6">
            <div class="help-card p-4">
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

    <div class="mt-5">
        <h3 class="fw-bold text-center mb-4">{{ __('Frequently Asked Questions') }}</h3>
        <div class="card help-card p-4">
            <div class="accordion" id="faqAccordion">

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                            {{ __('Do I need to pay to browse apartments?') }}
                        </button>
                    </h2>
                    <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                        <div class="accordion-body text-muted">
                            {{ __('No, browsing apartments is completely free for clients.') }}
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                            {{ __('How do property owners post listings?') }}
                        </button>
                    </h2>
                    <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div class="accordion-body text-muted">
                            {{ __('Owners must subscribe to a plan before they can add properties.') }}
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                            {{ __('Can I chat with property owners?') }}
                        </button>
                    </h2>
                    <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div class="accordion-body text-muted">
                            {{ __('Yes, clients can directly chat with owners after viewing a property.') }}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="text-center mt-5 mb-5">
        <h4 class="fw-bold">{{ __('Need more help?') }}</h4>
        <p class="text-muted">{{ __('Contact our support team anytime.') }}</p>
        <a href="mailto:yonatanadhanom00@gmail.com?subject=Support%20Request%20-%20Gojoye" class="btn btn-primary px-4">
            {{ __('Contact Support') }}
        </a>
    </div>

</div>

@endsection
