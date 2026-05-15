@extends('web.client.layout.app')

@section('title', 'Owner Register - Gojoye')

@section('content')
<div class="min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="auth-card">

        <h3 class="fw-bold text-center">Create an Account</h3>
        <p class="text-muted text-center mb-4">List your properties and reach thousands of tenants</p>

        <form action="{{ route('user.owner.register-user') }}" method="POST">
            @csrf

            <div class="row g-3">
                <div class="col-md-6">
                    <label for="f_name" class="form-label">First Name</label>
                    <input type="text" name="f_name" id="f_name" class="form-control form-control-lg" placeholder="John" required>
                </div>
                <div class="col-md-6">
                    <label for="l_name" class="form-label">Last Name</label>
                    <input type="text" name="l_name" id="l_name" class="form-control form-control-lg" placeholder="Doe" required>
                </div>
                <div class="col-md-6">
                    <label for="telNo" class="form-label">Phone Number</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                        <input type="text" name="telNo" id="telNo" class="form-control form-control-lg" placeholder="09xxxxxxxx" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="email" class="form-label">Email Address</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                        <input type="email" name="email" id="email" class="form-control form-control-lg" placeholder="example@mail.com" required>
                    </div>
                </div>
                <div class="col-12">
                    <label for="fan" class="form-label">FAN</label>
                    <input type="text" name="fan" id="fan" class="form-control form-control-lg" placeholder="Fayda ID number" required>
                </div>
                <div class="col-md-6">
                    <label for="password" class="form-label">Password</label>
                    <div class="password-wrapper">
                        <input type="password" name="password" id="password" class="form-control form-control-lg" placeholder="********" required>
                        <i class="bi bi-eye-slash toggle-password" id="togglePassword"></i>
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="confirm-password" class="form-label">Confirm Password</label>
                    <div class="password-wrapper">
                        <input type="password" name="password_confirmation" id="confirm-password" class="form-control form-control-lg" placeholder="********" required>
                        <i class="bi bi-eye-slash toggle-password" id="toggleConfirmPassword"></i>
                    </div>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 btn-lg mt-4">Register</button>

            <div class="auth-divider d-flex align-items-center my-4">
                <hr class="flex-grow-1">
                <span class="px-3 text-muted small fw-medium">or continue with</span>
                <hr class="flex-grow-1">
            </div>

            <a href="{{ route('google.redirect', ['role' => 0]) }}" class="btn btn-outline-dark w-100 btn-lg">
                <i class="bi bi-google"></i> Continue with Google
            </a>

            <p class="text-center mt-4 mb-0">
                Already have an account?
                <a href="{{ route('login') }}" class="fw-semibold">Login</a>
            </p>

        </form>

    </div>
</div>
@endsection

@push('scripts')
<script>
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('bi-eye');
        this.classList.toggle('bi-eye-slash');
    });

    const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
    const confirmPassword = document.querySelector('#confirm-password');

    toggleConfirmPassword.addEventListener('click', function () {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
        this.classList.toggle('bi-eye');
        this.classList.toggle('bi-eye-slash');
    });
</script>

<script>
    const form = document.querySelector('form');
    const confirmField = document.querySelector('#confirm-password');

    const errorMsg = document.createElement('small');
    errorMsg.classList.add('text-danger', 'mt-1', 'd-none');
    confirmField.parentNode.appendChild(errorMsg);

    form.addEventListener('submit', function (e) {
        if (password.value !== confirmPassword.value) {
            e.preventDefault();
            errorMsg.textContent = 'Passwords do not match.';
            errorMsg.classList.remove('d-none');
            confirmPassword.classList.add('is-invalid');
        } else {
            errorMsg.classList.add('d-none');
            confirmPassword.classList.remove('is-invalid');
        }
    });

    confirmPassword.addEventListener('input', function () {
        if (password.value === confirmPassword.value) {
            errorMsg.classList.add('d-none');
            confirmPassword.classList.remove('is-invalid');
        }
    });
</script>
@endpush
