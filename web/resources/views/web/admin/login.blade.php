    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gojoye - Admin Login</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
        <style>
            body {
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            form {
                width: 100%;
                max-width: 400px;
            }


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
            .position-fixed {
                right: 30%;
                transform: translateX(-50%);
            }
        </style>
    </head>
    <body>
        <div class="position-fixed top-0 end-0 p-3" style="z-index: 1055;">
            @if(session('message'))
                <div class="toast align-items-center text-bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            {{ session('message') }}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            @endif

            @if($errors->any())
                <div class="toast align-items-center text-bg-danger border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            <ul class="mb-0">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            @endif
        </div>
        <form action="{{ route('admin.login.submit') }}" method="POST" class="border p-5 rounded shadow-lg d-flex flex-column">
            @csrf
            <h2>Login</h2>
            <label for="email" class="form-label">Email Address</label>
            <input type="email" name="email" id="email" placeholder="Email Address" class="form-control mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="mb-3 password-wrapper">
                <input type="password" name="password" id="password" placeholder="Password" class="form-control" required>
                <i class="bi bi-eye-slash toggle-password" id="togglePassword"></i>
            </div>
            <button type="submit" class="btn btn-primary">Log In</button>
        </form>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>


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

        <!-- Auto Close alert messages -->
        <script>
            const toastElList = [].slice.call(document.querySelectorAll('.toast'))
            const toastList = toastElList.map(function(toastEl) {
                return new bootstrap.Toast(toastEl, { delay: 4000, autohide: true });
            });
            toastList.forEach(toast => toast.show());
        </script>
    </body>
    </html>