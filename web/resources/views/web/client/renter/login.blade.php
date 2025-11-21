@extends('web.client.layout.app')

@section('title', 'Login - Rent Your Dream Apartment')


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

        <h3 class="text-center mb-4">Welcome Back!</h3>

        <form action="#" method="POST">
            @csrf

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

            <button type="submit" class="btn btn-primary w-100 btn-lg">
                Login
            </button>


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
        </script>

@endpush