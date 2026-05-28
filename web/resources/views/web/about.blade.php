@extends('web.client.layout.app')

@section('title', __('Gojoye - About Us'))

@section('content')

<section class="about-hero mb-5">
    <div class="container">
        <h1 class="display-4 fw-bold">{{ __('About Gojoye') }}</h1>
        <p class="lead">{{ __('Connecting you with your dream apartment easily and reliably') }}</p>
    </div>
</section>

<section class="container py-5">
    <h2 class="fw-bold mb-3">{{ __('Our Story') }}</h2>
    <p class="text-secondary lh-lg">
        {{ __('Gojoye was founded with a mission to simplify apartment renting and buying for everyone. Whether you are looking for your first home or an investment property, we make the process smooth, fast, and transparent. Our team is dedicated to connecting clients with landlords, providing verified listings, and offering a seamless online experience.') }}
    </p>
</section>

<section class="bg-light py-5">
    <div class="container">
        <h2 class="fw-bold mb-3">{{ __('Our Mission') }}</h2>
        <p class="text-secondary lh-lg">
            {{ __('We aim to make apartment renting and buying stress-free, trustworthy, and enjoyable. With a focus on verified listings, responsive support, and a user-friendly platform, Gojoye strives to empower renters to make informed choices.') }}
        </p>
    </div>
</section>

<section class="container py-5">
    <h2 class="fw-bold mb-4">{{ __('Meet Our Team') }}</h2>
    <div class="row g-4">

        @php
            $teamMembers = ['Yonatan Fisuhu', 'Hani Abesha', 'Khalid Wayu', 'Zuleyha Towfik', 'Yitbarek Daniel', 'Aymen Teyb'];
        @endphp

        @foreach($teamMembers as $member)
            <div class="col-6 col-md-4 col-lg-3">
                <div class="team-card">
                    <div class="profile-avatar mx-auto mb-3">
                        {{ strtoupper(substr($member, 0, 1)) }}
                    </div>
                    <h6 class="fw-bold mb-0">{{ $member }}</h6>
                </div>
            </div>
        @endforeach

    </div>
</section>

@endsection
