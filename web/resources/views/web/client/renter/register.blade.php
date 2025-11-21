@extends('web.client.layout.app')

@section('title', 'Register - Rent Your Dream Apartment')


@push('styles')
<style>
    .password-wrapper {
                position: relative;
            }

            .password-wrapper .toggle-password {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: #6c757d;
            }
</style>



@endpush
@section('content')

<div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 450px; border-radius: 15px;">

        <h3 class="text-center mb-4">Create an Account</h3>

        <form action="{{ route('user.renter.register-user') }}" method="POST">
            @csrf

            <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input type="text" 
                       name="name" 
                       id="name" 
                       class="form-control form-control-lg" 
                       placeholder="John Doe" 
                       required>
            </div>

            <div class="mb-3">
                <label for="telNo" class="form-label">Phone Number</label>
                <input type="text" 
                       name="telNo" 
                       id="telNo" 
                       class="form-control form-control-lg" 
                       placeholder="09xxxxxxxx" 
                       required>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input type="email" 
                       name="email" 
                       id="email" 
                       class="form-control form-control-lg" 
                       placeholder="example@mail.com" 
                       required>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="mb-3 password-wrapper">
                    <input type="password" 
                        name="password" 
                        id="password" 
                        class="form-control form-control-lg" 
                        placeholder="********" 
                        required>
                    <i class="bi bi-eye-slash toggle-password" id="togglePassword"></i>
            </div>
            </div>

            <div class="mb-4">
                <label for="confirm-password" class="form-label">Confirm Password</label>
                <div class="mb-3 password-wrapper">
                        <input type="password" 
                            name="password_confirmation" 
                            id="confirm-password" 
                            class="form-control form-control-lg" 
                            placeholder="********" 
                            required>
                        <i class="bi bi-eye-slash toggle-password" id="toggleConfirmPassword"></i>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 btn-lg">
                Register
            </button>

            <p class="text-center mt-3">
                Already have an account? 
                <a href="{{ route('user.login') }}">Login</a>
            </p>

        </form>

    </div>
</div>

@endsection

@push('scripts')

 <!-- Show Password Script -->
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


            <!-- Password Validation -->
        <script>
             const form = document.querySelector('form');
            const confirmField = document.querySelector('#confirm-password');

            // Create error message element
            const errorMsg = document.createElement('small');
            errorMsg.classList.add('text-danger', 'mt-1');
            errorMsg.style.display = 'none';
            confirmField.parentNode.appendChild(errorMsg);

            form.addEventListener('submit', function (e) {
                if (password.value !== confirmPassword.value) {
                    e.preventDefault(); // stop form submission
                    errorMsg.textContent = "Passwords do not match.";
                    errorMsg.style.display = 'block';
                    confirmPassword.classList.add('is-invalid');
                } else {
                    errorMsg.style.display = 'none';
                    confirmPassword.classList.remove('is-invalid');
                }
            });

            // Live validation as user types
            confirmPassword.addEventListener('input', function () {
                if (password.value === confirmPassword.value) {
                    errorMsg.style.display = 'none';
                    confirmPassword.classList.remove('is-invalid');
                }
            });
        </script>

@endpush