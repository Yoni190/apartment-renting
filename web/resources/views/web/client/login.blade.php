@extends('web.client.layout.app')

@section('title', 'Login - Gojoye')

@section('content')
<div class="min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="auth-card">

        <h3 class="fw-bold text-center">Welcome Back!</h3>
        <p class="text-muted text-center mb-4">Sign in to your account</p>

        <form action="{{ route('login') }}" method="POST">
            @csrf

            <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <input type="email" name="email" id="email" class="form-control form-control-lg" placeholder="example@mail.com" required>
                </div>
            </div>

            <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <div class="password-wrapper">
                    <input type="password" name="password" id="password" class="form-control form-control-lg" placeholder="********" required>
                    <i class="bi bi-eye-slash toggle-password" id="togglePassword"></i>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 btn-lg">Login</button>

            <div class="auth-divider d-flex align-items-center my-4">
                <hr class="flex-grow-1">
                <span class="px-3 text-muted small fw-medium">or continue with</span>
                <hr class="flex-grow-1">
            </div>

            <a href="{{ route('google.redirect') }}" class="btn btn-outline-dark w-100 btn-lg">
                <i class="bi bi-google"></i> Continue with Google
            </a>

            <p class="text-center mt-4 mb-0">
                Don't have an account?
                <a href="{{ route('user.renter.register') }}" class="fw-semibold">Register</a>
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
</script>
@endpush
