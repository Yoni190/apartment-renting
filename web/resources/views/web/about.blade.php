@extends('web.client.layout.app')

@section('title', __('Gojoye - About Us'))

@push('styles')
<style>
.about-hero {
    background: url('/images/about-hero.jpg') center/cover no-repeat;
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    position: relative;
    border-radius: 12px;
}

.about-hero::before {
    content: "";
    position: absolute;
    top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.5);
    border-radius: 12px;
}

.about-section {
    padding: 60px 0;
}

.about-section h2 {
    font-weight: 700;
    margin-bottom: 20px;
}

.about-section p {
    color: #555;
    line-height: 1.8;
}

.team-card {
    border-radius: 12px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
}

.team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.team-card img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-bottom: 15px;
}
</style>
@endpush

@section('content')

<!-- Hero -->
<section class="about-hero mb-5">
    <div class="container position-relative">
        <h1 class="display-4 fw-bold">{{ __('About Gojoye') }}</h1>
        <p class="lead">{{ __('Connecting you with your dream apartment easily and reliably') }}</p>
    </div>
</section>

<!-- Our Story -->
<section class="about-section container">
    <h2>{{ __('Our Story') }}</h2>
    <p>
        {{ __('Gojoye was founded with a mission to simplify apartment renting and buying for everyone. Whether you are looking for your first home or an investment property, we make the process smooth, fast, and transparent. Our team is dedicated to connecting clients with landlords, providing verified listings, and offering a seamless online experience.') }}
    </p>
</section>

<!-- Our Mission -->
<section class="about-section bg-light">
    <div class="container">
        <h2>{{ __('Our Mission') }}</h2>
        <p>
            {{ __('We aim to make apartment renting and buying stress-free, trustworthy, and enjoyable. With a focus on verified listings, responsive support, and a user-friendly platform, Gojoye strives to empower renters to make informed choices.') }}
        </p>
    </div>
</section>

<!-- Our Team -->
<section class="about-section container">
    <h2>{{ __('Meet Our Team') }}</h2>
    <div class="row g-4 mt-3">

        @php
            $teamMembers = [
                'Yonatan Fisuhu',
                'Hani Abesha',
                'Khalid Wayu',
                'Zuleyha Towfik',
                'Yitbarek Daniel',
                'Aymen Teyb'
            ];
        @endphp

        @foreach($teamMembers as $member)
        <div class="col-md-3">
            <div class="team-card">
                <!-- Circle with initials -->
                <div style="
                    width:100px;
                    height:100px;
                    border-radius:50%;
                    background:#e9ecef;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:28px;
                    font-weight:600;
                    color:#6c757d;
                    margin:0 auto 15px;
                ">
                    {{ strtoupper(substr($member,0,1)) }}
                </div>
                <h6 class="fw-bold mb-0">{{ $member }}</h6>
            </div>
        </div>
        @endforeach

    </div>
</section>


@endsection