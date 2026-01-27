<div class="d-flex flex-column align-items-start px-3">
    <h5 class="mb-4">Admin Menu</h5>

    <ul class="nav nav-pills flex-column w-100">

        <li class="nav-item mb-2">
            <a href="{{ route('admin.dashboard') }}" class="nav-link text-dark d-flex align-items-center gap-2">
                <i class="bi bi-speedometer2"></i>
                Dashboard
            </a>
        </li>

        <li class="nav-item mb-2">
            <a href="{{ route('admin.users') }}" class="nav-link text-dark d-flex align-items-center gap-2">
                <i class="bi bi-people"></i>
                Users
            </a>
        </li>

        <li class="nav-item mb-2">
            <a href="{{ route('admin.apartments') }}" class="nav-link text-dark d-flex align-items-center gap-2">
                <i class="bi bi-building"></i>
                Apartments
            </a>
        </li>

        <li class="nav-item mb-2">
            <a href="{{ route('admin.admins.index') }}" class="nav-link text-dark d-flex align-items-center gap-2">
                <i class="bi bi-person-badge"></i>
                Admins
            </a>
        </li>

        <li class="nav-item mb-2">
            <a href="{{ route('admin.logs') }}" class="nav-link text-dark d-flex align-items-center gap-2">
                <i class="bi bi-journal-text"></i>
                Logs
            </a>
        </li>

        <li class="nav-item mb-2">
            <a href="{{ route('admin.settings') }}" class="nav-link text-dark d-flex align-items-center gap-2">
                <i class="bi bi-gear"></i>
                Settings
            </a>
        </li>

        <li class="nav-item mt-3">
            <form method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button type="submit" class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-box-arrow-right"></i>
                    Logout
                </button>
            </form>
        </li>

    </ul>
</div>
