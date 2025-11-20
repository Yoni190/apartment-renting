@extends('web.admin.layout.app')

@section('title', 'Gojoye - Add Admin')

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

<div class="container mt-4">

    <div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">Add New Admin</h4>
        </div>

        <div class="card-body">

            <form action="{{ route('admin.add-admin') }}" method="POST">
                @csrf

                <div class="row g-4">
                    <!-- Admin Name -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Admin Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            class="form-control" 
                            placeholder="Enter admin name..." 
                        >
                    </div>

                    <!-- Email -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            class="form-control"
                            placeholder="Enter email..."
                        >
                    </div>

                    <!-- Password -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Password</label>
                        <div class="mb-3 password-wrapper">
                            <input type="password" name="password" id="password" placeholder="Password" class="form-control" required>
                            <i class="bi bi-eye-slash toggle-password" id="togglePassword"></i>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Role</label>
                        <select name="role" id="role" class="form-select">
                            <option selected disabled>Select role...</option>
                            @foreach($roles as $role)
                                <option value="{{ $role->id }}">{{ $role->name }}</option>
                            @endforeach
                        </select>
                    </div>




                </div>

                <div class="mt-4 text-end">
                    <button class="btn btn-success px-4 py-2">
                        <i class="bi bi-plus-circle"></i> Add Admin
                    </button>
                </div>

            </form>
        </div>
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