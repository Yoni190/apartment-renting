@extends('web.admin.layout.app')
@section('title', 'Gojoye - Settings')


@section('content')

<div class="container mt-4">
    <h1>Settings</h1>
    <div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">API Settings</h4>
        </div>

        <div class="card-body">

            <form action="{{ route('admin.settings.save') }}" method="POST">
                @csrf
                <div class="row g-4">
                    <div class="col-md-6">
                            <label class="form-label fw-semibold">API Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                class="form-control" 
                                placeholder="Enter API name..." 
                                value="{{ $paymentApi->name }}"
                                required
                            >
                    </div>

                    <div class="col-md-6">
                        <label for="key" class="form-label fw-semibold">API Key</label>
                        <input type="text"
                            name="key"
                            id="key"
                            class="form-control"
                            placeholder="Enter API Key..."
                            value="{{ $paymentApi->api_key }}"
                            required
                            >
                    </div>

                    <div class="col-md-6">
                        <label for="provider" class="form-label fw-semibold">API Provider</label>
                        <input type="text"
                            name="provider"
                            id="provider"
                            class="form-control"
                            placeholder="Enter API Provider..."
                            value="{{ $paymentApi->api_provider }}"
                            required
                            >
                    </div>
                </div>

                <div class="mt-4 text-end">
                    <button class="btn btn-success px-4 py-2">
                         Save API Settings
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection