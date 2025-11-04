<div class="d-flex flex-column align-items-start px-3">
    <h5 class="mb-4">Admin Menu</h5>
    <ul class="nav nav-pills flex-column w-100">
        <li class="nav-item mb-2">
            <a href="{{ route('admin.dashboard') }}" class="nav-link text-dark">🏠 Dashboard</a>
        </li>
        <li class="nav-item mb-2">
            <a href="{{ route('admin.users') }}" class="nav-link text-dark">👥 Users</a>
        </li>
        <li class="nav-item mb-2">
            <a href="{{ route('admin.apartments') }}" class="nav-link text-dark">🏢 Apartments</a>
        </li>
        <li class="nav-item mb-2">
            <a href="{{ route('admin.admins.index') }}" class="nav-link text-dark">Admins</a>
        </li>
        <li class="nav-item mb-2">
            <a href="{{ route('admin.settings') }}" class="nav-link text-dark">⚙️ Settings</a>
        </li>
        <li class="nav-item mt-3">
            <form method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button type="submit" class="btn btn-outline-danger w-100">Logout</button>
            </form>
        </li>

    </ul>
</div>
