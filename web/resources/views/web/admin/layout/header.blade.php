

<nav class="navbar navbar-expand-lg navbar-light bg-dark p-3">
    <a href="{{ route('admin.dashboard') }}" class="navbar-brand text-white">Apartment Renting</a>
    {{--
    <ul class="navbar-nav mr-auto">
        <li class="nav-item">
            <a href="#" class="nav-link text-white">
                Admin
            </a>
        </li>
        <li class="nav-item">
            <a href="#" class="nav-link text-white">
                Setting
            </a>    
        </li>
    </ul>
    --}}    
</nav>

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
    </div>

    
