<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>@yield('title', __('Gojoye'))</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">


    <!-- Custom Styles -->
    <!-- <link rel="stylesheet" href="{{ asset('css/main.css') }}"> -->

    <style>
        #chatbot-box {
    border-radius: 12px;
        }

        #chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }

        #chatbot-messages::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
        }
    </style>

    @stack('styles')
</head>
<body class="bg-light">

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
            @if(auth()->user())
                @if(auth()->user()->role === 1)
                    <a class="navbar-brand fw-bold" href="{{ url('/home') }}">
                        <i class="bi bi-building"></i> {{ __('Gojoye') }}
                    </a>
                @else
                    <a class="navbar-brand fw-bold" href="{{ url('/owner/dashboard') }}">
                        <i class="bi bi-building"></i> {{ __('Gojoye') }}
                    </a>
                @endif
            @else
                <a class="navbar-brand fw-bold" href="{{ url('/') }}">
                    <i class="bi bi-building"></i> {{ __('Gojoye') }}
                </a>
            @endif

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="mainNavbar">
                <ul class="navbar-nav ms-auto">

                    @if(auth()->user())
                        <li class="nav-item">
                            @if(auth()->user()->role === 1)
                                <a class="nav-link {{ request()->is('/home') ? 'active' : '' }}" href="{{ url('/home') }}">{{ __('Home') }}</a>
                            @else
                                <a class="nav-link {{ request()->is('/owner/dashboard') ? 'active' : '' }}" href="{{ url('/owner/dashboard') }}">{{ __('Home') }}</a>
                            @endif
                        </li>

                        <li class="nav-item">
                            @if(auth()->user()->role === 1)
                                <a class="nav-link {{ request()->is('/favorites') ? 'active' : '' }}" href="{{ url('/favorites') }}">{{ __('Favorites') }}</a>
                            @endif
                        </li>

                    
                        <li class="nav-item">
                            <a class="nav-link {{ request()->is('apartments') ? 'active' : '' }}" href="{{ route('client.apartments') }}">
                                {{ __('Apartments') }}
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link {{ request()->is('tours') ? 'active' : '' }}" href="{{ url('/client/tours') }}">
                                {{ __('Tours') }}
                            </a>
                        </li>
                    @endif

                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('about') ? 'active' : '' }}" href="{{ url('/about') }}">
                            {{ __('About Us') }}
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="/lang/en" class="btn btn-sm btn-outline-light">EN</a>
                        <a href="/lang/am" class="btn btn-sm btn-outline-light">አማ</a>
                    </li>

                    @auth('web')
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">
                                <i class="bi bi-person-circle"></i> {{ auth()->user()->name }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="{{ route('user.client.profile') }}">{{ __('Profile') }}</a></li>
                                <li>
                                    <form action="{{ route('logout') }}" method="POST">
                                        @csrf
                                        <button class="dropdown-item" type="submit">{{ __('Logout') }}</button>
                                    </form>
                                </li>
                            </ul>
                        </li>
                    @else
                        <li class="nav-item ms-2">
                            <a href="{{ route('login') }}" class="btn btn-outline-light btn-sm">{{ __('Login') }}</a>
                        </li>
                        <li class="nav-item ms-2">
                            <a href="{{ route('user.renter.register') }}" class="btn btn-primary btn-sm">{{ __('Register as Renter') }}</a>
                            <a href="{{ route('user.owner.register') }}" class="btn btn-primary btn-sm">{{ __('Register as Apartment Owner') }}</a>
                        </li>
                    @endauth

                </ul>
            </div>
        </div>
    </nav>

    <div class="position-fixed top-0 end-0 p-3" style="z-index: 1055;">
            @if(session('message') || session('success'))
                <div class="toast align-items-center text-bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            {{ session('message') ? session('message') : session('success') }}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            @elseif(session('error'))
                <div class="toast align-items-center text-bg-danger border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            {{ session('error') }}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            @endif
    </div>

    <!-- MAIN CONTENT -->
    <main class="min-vh-100">
        @yield('content')
    </main>

    <!-- FOOTER -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container text-center">
            <p class="mb-1">© {{ date('Y') }} {{ __('Gojoye. All rights reserved.') }}</p>
            <small>{{ __('Find your perfect apartment with ease.') }}</small>
        </div>
    </footer>

    <!-- JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        const toastElList = [].slice.call(document.querySelectorAll('.toast'))
        const toastList = toastElList.map(function(toastEl) {
            return new bootstrap.Toast(toastEl, { delay: 4000, autohide: true });
        });
        toastList.forEach(toast => toast.show());
    </script>
    

    @stack('scripts')
        <!-- Chatbot Button -->
        <div id="chatbot-toggle" class="btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle shadow">
            <i class="bi bi-chat-dots"></i>
        </div>

        <!-- Chatbox -->
        <div id="chatbot-box" class="card shadow position-fixed bottom-0 end-0 m-4" style="width: 380px; height: 500px; display:none;">
            <div class="card-header bg-primary text-white d-flex justify-content-between">
                <span>Chat</span>
                <button class="btn-close btn-close-white" id="chatbot-close"></button>
            </div>
            <div id="chatbot-messages" class="card-body" style="height: 380px; overflow-y:auto;"></div>
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

            toggleBtn.onclick = () => chatBox.style.display = 'block';
            closeBtn.onclick = () => chatBox.style.display = 'none';

            sendBtn.onclick = sendMessage;
            input.addEventListener("keypress", function(e) {
                if (e.key === "Enter") sendMessage();
            });

            function appendMessage(text, sender) {
                const div = document.createElement('div');
                div.className = sender === 'user' ? 'text-end mb-2' : 'text-start mb-2';

                const bubble = document.createElement('div');
                bubble.className = sender === 'user'
                    ? 'bg-primary text-white p-2 rounded'
                    : 'bg-light border p-2 rounded';

                bubble.style.maxWidth = "75%";
                bubble.style.wordWrap = "break-word";
                bubble.style.whiteSpace = "pre-wrap";

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
                .then(data => {
                    appendMessage(data.reply, 'bot');
                })
                .catch(() => {
                    appendMessage("Error connecting to AI", 'bot');
                });
            }
            </script>
</body>
</html>
