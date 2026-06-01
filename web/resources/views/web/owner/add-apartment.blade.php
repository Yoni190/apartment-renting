@extends('web.client.layout.app')

@section('title', 'Gojoye - Add Apartment')

@section('content')
<div class="container mt-4">
    <div class="info-card card p-4 mx-auto mw-800">
        @php
            $user = auth()->user();
        @endphp

        @if(!$user || !$user->subscribed)
            <div class="alert alert-warning text-center">
                <h4>{{ __('subscription_required') }}</h4>
                <p>{{ __('subscription_message') }}</p>
                <a href="{{ route('owner.dashboard') }}" class="btn btn-primary">{{ __('go_back') }}</a>
            </div>
        @else
        <h3 class="mb-4">{{ __('add_apartment') }}</h3>

        <form action="{{ route('apartment.store') }}" method="POST" enctype="multipart/form-data">
            @csrf

            <div class="row mb-3">
                <div class="col-md-6 mb-3 mb-md-0">
                    <label class="form-label">{{ __('title') }}</label>
                    <input type="text" name="title" class="form-control" placeholder="{{ __('title_placeholder') }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">{{ __('address') }}</label>
                    <input type="text" name="address" class="form-control" placeholder="{{ __('address_placeholder') }}" required>
                </div>
            </div>

             <!-- Location Details Section -->
            <div class="mb-3">
                <label class="form-label fw-bold">{{ __('location_details') }}</label>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label">{{ __('sub_city') }}</label>
                        <select name="sub_city" class="form-control" required>
                            <option value="">{{ __('select_sub_city') }}</option>
                            <option value="Addis Ketema">Addis Ketema</option>
                            <option value="Akaky Kaliti">Akaky Kaliti</option>
                            <option value="Arada">Arada</option>
                            <option value="Bole">Bole</option>
                            <option value="Gulele">Gulele</option>
                            <option value="Kirkos">Kirkos</option>
                            <option value="Kolfe Keranio">Kolfe Keranio</option>
                            <option value="Lideta">Lideta</option>
                            <option value="Nifas Silk-Lafto">Nifas Silk-Lafto</option>
                            <option value="Yeka">Yeka</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">{{ __('woreda') }}</label>
                        <input type="text" name="woreda" class="form-control" placeholder="{{ __('woreda_placeholder') }}" required>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">{{ __('kebele') }}</label>
                        <input type="text" name="kebele" class="form-control" placeholder="{{ __('kebele_placeholder') }}" required>
                    </div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="form-label">{{ __('type') }}</label>
                    <select name="type" class="form-control" required>
                        <option value="sale" selected>{{ __('sale') }}</option>
                        <option value="rent">{{ __('rent') }}</option>
                    </select>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="form-label">{{ __('price') }}</label>
                    <input type="number" name="price" class="form-control" placeholder="5000" required>
                </div>
                <div class="col-md-4 mb-3 mb-md-0">
                    <label class="form-label">{{ __('bedrooms') }}</label>
                    <input type="number" name="bedrooms" class="form-control" placeholder="2" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">{{ __('bathrooms') }}</label>
                    <input type="number" name="bathrooms" class="form-control" placeholder="1" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">{{ __('size') }}</label>
                    <input type="number" name="size" class="form-control" placeholder="120" required>
                </div>
            </div>


            <div class="mb-3">
                <label class="form-label">{{ __('description') }}</label>
                <textarea name="description" rows="4" class="form-control" placeholder="{{ __('description_placeholder') }}" required></textarea>
            </div>

            <div class="mb-4">
                <label class="form-label">{{ __('images') }}</label>
                <input type="file" name="images[]" class="form-control" multiple>
                <div class="form-text text-muted">{{ __('image_hint') }}</div>
            </div>

            <div class="d-flex justify-content-end">
                <a href="{{ url()->previous() }}" class="btn btn-ghost me-2">{{ __('cancel') }}</a>
                <button type="submit" class="btn btn-primary">{{ __('submit') }}</button>
            </div>
        </form>
        @endif
    </div>
</div>
@endsection
