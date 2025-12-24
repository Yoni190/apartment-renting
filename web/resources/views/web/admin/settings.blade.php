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

            <form action="#">
                <div class="row g-4">
                    <div class="col-md-6">
                            <label class="form-label fw-semibold">API Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                class="form-control" 
                                placeholder="Enter API name..." 
                            >
                    </div>

                    <div class="col-md-6">
                        <label for="key" class="form-label fw-semibold">API Key</label>
                        <input type="text"
                            name="key"
                            id="key"
                            class="form-control"
                            placeholder="Enter API Key..."
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