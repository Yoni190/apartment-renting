<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', __('Gojoye'))</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="{{ asset('images/logo2.png') }}">

    @vite('resources/css/app.css')

    @stack('styles')
</head>
<body>

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg sticky-top custom-navbar">
        <div class="container">
            <a class="navbar-brand fw-bold" href="{{ auth()->check() ? (auth()->user()->role === 1 ? url('/home') : url('/owner/dashboard')) : url('/') }}">
                <i class="bi bi-building"></i> {{ __('Gojoye') }}
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="mainNavbar">
                <ul class="navbar-nav ms-auto align-items-lg-center gap-1">

                    @auth
                        @if(auth()->user()->role === 1)
                            <li class="nav-item">
                                <a class="nav-link {{ request()->is('/home') ? 'active' : '' }}" href="{{ url('/home') }}">{{ __('Home') }}</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ request()->is('apartments') ? 'active' : '' }}" href="{{ route('client.apartments') }}">{{ __('Apartments') }}</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ request()->is('favorites') ? 'active' : '' }}" href="{{ url('/favorites') }}">{{ __('Favorites') }}</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ request()->is('tours') ? 'active' : '' }}" href="{{ url('/client/tours') }}">{{ __('Tours') }}</a>
                            </li>
                        @endif
                    @endauth

                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('about') ? 'active' : '' }}" href="{{ url('/about') }}">{{ __('About Us') }}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('help') ? 'active' : '' }}" href="{{ url('/help') }}">{{ __('Help') }}</a>
                    </li>

                    <li class="nav-item d-flex gap-1 ms-lg-2">
                        <a href="/lang/en" class="lang-btn">EN</a>
                        <a href="/lang/am" class="lang-btn">አማ</a>
                    </li>

                    @auth('web')
                        <li class="nav-item dropdown ms-lg-2">
                            <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown" href="#">
                                <i class="bi bi-person-circle fs-5"></i>
                                <span class="d-none d-lg-inline">{{ auth()->user()->name }}</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="{{ route('user.client.profile') }}"><i class="bi bi-person me-2"></i>{{ __('Profile') }}</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <form action="{{ route('logout') }}" method="POST">
                                        @csrf
                                        <button class="dropdown-item" type="submit"><i class="bi bi-box-arrow-right me-2"></i>{{ __('Logout') }}</button>
                                    </form>
                                </li>
                            </ul>
                        </li>
                    @else
                        <li class="nav-item ms-lg-2">
                            <a href="{{ route('login') }}" class="navbar-auth-btn">{{ __('Login') }}</a>
                        </li>
                        <li class="nav-item dropdown ms-lg-1">
                            <a class="navbar-auth-btn navbar-auth-btn-primary dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                {{ __('Register') }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="{{ route('user.renter.register') }}"><i class="bi bi-person me-2"></i>{{ __('As a Renter') }}</a></li>
                                <li><a class="dropdown-item" href="{{ route('user.owner.register') }}"><i class="bi bi-building me-2"></i>{{ __('As an Owner') }}</a></li>
                            </ul>
                        </li>
                    @endauth

                </ul>
            </div>
        </div>
    </nav>

    <!-- TOASTS -->
    <div class="toast-container">
        @if(session('message') || session('success'))
            <div class="toast align-items-center text-bg-success border-0 show" role="alert">
                <div class="d-flex">
                    <div class="toast-body">{{ session('message') ? session('message') : session('success') }}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        @elseif(session('error'))
            <div class="toast align-items-center text-bg-danger border-0 show" role="alert">
                <div class="d-flex">
                    <div class="toast-body">{{ session('error') }}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        @elseif($errors->any())
            <div class="toast align-items-center text-bg-danger border-0 show" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <ul class="mb-0 ps-3">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        @endif
    </div>

    <!-- MAIN -->
    <main class="min-vh-100">
        @yield('content')
    </main>

    <!-- FOOTER -->
    <footer class="site-footer">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-4">
                    <h5><i class="bi bi-building me-2"></i>{{ __('Gojoye') }}</h5>
                    <p class="mb-3 small">{{ __('Find your perfect apartment with ease.') }}</p>
                    <div class="social-links d-flex gap-2">
                        <a href="#"><i class="bi bi-facebook"></i></a>
                        <a href="#"><i class="bi bi-twitter-x"></i></a>
                        <a href="#"><i class="bi bi-instagram"></i></a>
                        <a href="#"><i class="bi bi-telegram"></i></a>
                    </div>
                </div>
                <div class="col-md-2">
                    <h5>{{ __('Quick Links') }}</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="{{ url('/') }}">{{ __('Home') }}</a></li>
                        <li class="mb-2"><a href="{{ route('client.apartments') }}">{{ __('Apartments') }}</a></li>
                        <li class="mb-2"><a href="{{ url('/about') }}">{{ __('About Us') }}</a></li>
                        <li class="mb-2"><a href="{{ url('/help') }}">{{ __('Help') }}</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>{{ __('For Owners') }}</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="{{ route('user.owner.register') }}">{{ __('List Your Property') }}</a></li>
                        <li class="mb-2"><a href="{{ route('login') }}">{{ __('Owner Login') }}</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>{{ __('Contact') }}</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2"><i class="bi bi-envelope me-2"></i><a href="mailto:yonatanadhanom00@gmail.com">yonatanadhanom00@gmail.com</a></li>
                        <li class="mb-2"><i class="bi bi-geo-alt me-2"></i>{{ __('Addis Ababa, Ethiopia') }}</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom text-center">
                <p class="mb-0">&copy; {{ date('Y') }} {{ __('Gojoye. All rights reserved.') }}</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        document.querySelectorAll('.toast').forEach(function(el) {
            var toast = new bootstrap.Toast(el, { delay: 4000, autohide: true });
            toast.show();
        });
    </script>

    @stack('scripts')

    <!-- Chatbot -->
    <div id="chatbot-toggle" class="btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle shadow">
        <i class="bi bi-chat-dots"></i>
    </div>

    <div id="chatbot-box" class="card shadow position-fixed bottom-0 end-0 m-4 d-none">
        <div class="card-header bg-primary text-white d-flex justify-content-between">
            <span>Chat</span>
            <button class="btn-close btn-close-white" id="chatbot-close"></button>
        </div>
        <div id="chatbot-messages" class="card-body"></div>
        <div class="card-footer d-flex">
            <input type="text" id="chatbot-input" class="form-control me-2" placeholder="Ask something...">
            <button class="btn btn-primary" id="chatbot-send">Send</button>
        </div>
    </div>

    <script>
        const toggleBtn = document.getElementById('chatbot-toggle');
        const chatBox = document.getElementById('chatbot-box');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const messages = document.getElementById('chatbot-messages');

        toggleBtn.onclick = () => chatBox.classList.remove('d-none');
        closeBtn.onclick = () => chatBox.classList.add('d-none');

        sendBtn.onclick = sendMessage;
        input.addEventListener("keypress", function(e) {
            if (e.key === "Enter") sendMessage();
        });

        function appendMessage(text, sender) {
            const div = document.createElement('div');
            div.className = sender === 'user'
                ? 'd-flex justify-content-end mb-2'
                : 'd-flex justify-content-start mb-2';
            const bubble = document.createElement('div');
            bubble.className = sender === 'user'
                ? 'bg-primary text-white p-2 rounded'
                : 'bg-light border p-2 rounded';
            bubble.style.maxWidth = "75%";
            bubble.style.wordWrap = "break-word";
            bubble.innerText = text;
            div.appendChild(bubble);
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function sendMessage() {
            const text = input.value.trim();
            if (!text) return;
            appendMessage(text, 'user');
            input.value = '';
            fetch("{{ route('chat') }}", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": "{{ csrf_token() }}"
                },
                body: JSON.stringify({ message: text })
            })
            .then(res => res.json())
            .then(data => appendMessage(data.reply, 'bot'))
            .catch(() => appendMessage("Error connecting to AI", 'bot'));
        }
    </script>
</body>
</html>