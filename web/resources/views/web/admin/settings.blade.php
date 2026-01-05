@extends('web.admin.layout.app')
@section('title', 'Gojoye - Settings')


@section('content')

<div class="container mt-4">
    <h1>Settings</h1>
    <div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">Payment API Settings</h4>
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
                                value="{{ $paymentApi->name ?? '' }}"
                                required
                            >
                    </div>

                    <div class="col-md-6">
                        <div class="d-flex justify-content-between">
                            <label for="key" class="form-label fw-semibold">API Key</label>
                            <i
                            class="bi bi-info-circle fs-4"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Click the eye to view and edit the API key"
                            ></i>
                        </div>
                        <div class="input-group">
                            <input type="text"
                                id="key_display"
                                class="form-control"
                                value="{{ $paymentApi->masked_key ?? '' }}"
                                readonly>

                            <input type="hidden"
                                name="key"
                                id="key_real"
                                value="">

                            <button type="button"
                                class="btn btn-outline-secondary"
                                id="toggleKey"
                                >
                            👁️
                        </button>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label for="provider" class="form-label fw-semibold">API Provider</label>
                        <input type="text"
                            name="provider"
                            id="provider"
                            class="form-control"
                            placeholder="Enter API Provider..."
                            value="{{ $paymentApi->api_provider ?? '' }}"
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

@push('scripts')

<script>
document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
</script>


<script>
const displayInput = document.getElementById('key_display');
const realInput = document.getElementById('key_real');
const toggleButton = document.getElementById('toggleKey');

const maskedKey = @json($paymentApi->masked_key ?? '');
const fullKey = @json($paymentApi->api_key ?? '');

let showing = false;

toggleButton.addEventListener('click', () => {
    if (!showing) {
        // SHOW + ENABLE EDIT
        displayInput.type = 'text';
        displayInput.readOnly = false;
        displayInput.value = fullKey;

        realInput.value = fullKey;
    } else {
        // HIDE + LOCK
        displayInput.type = 'password';
        displayInput.readOnly = true;
        displayInput.value = maskedKey;

        realInput.value = '';
    }
    showing = !showing;
});

// Sync typing to hidden input
displayInput.addEventListener('input', () => {
    if (showing) {
        realInput.value = displayInput.value;
    }
});
</script>




@endpush