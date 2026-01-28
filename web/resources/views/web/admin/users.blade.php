@extends('web.admin.layout.app')
@section('title', 'Gojoye - User Management')

@section('content')

<h1>Users</h1>

<div class="container-fluid py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">User Management</h1>
        <a href="{{ route('admin.dashboard') }}" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-arrow-left"></i> Back to Dashboard
        </a>
    </div>

    {{-- Filter Card --}}
    <div class="card shadow-sm mb-4">
        <div class="card-header bg-light">
            <h5 class="mb-0">Filter Users</h5>
        </div>
        <div class="card-body">
            <form method="GET" action="{{ route('admin.users') }}" class="row g-3 align-items-end">

                <div class="col-md-4">
                    <label for="name" class="form-label">Search by Name</label>
                    <input type="text" name="name" id="name" value="{{ request('name') }}" class="form-control" placeholder="Enter name...">
                </div>

                <div class="col-md-4">
                    <label for="role" class="form-label">Role</label>
                    <select name="role" id="role" class="form-select">
                        <option value="">All</option>
                        <option value="0" {{ request('role') == '0' ? 'selected' : '' }}>Apartment Owner</option>
                        <option value="1" {{ request('role') == '1' ? 'selected' : '' }}>Renter</option>
                    </select>
                </div>

                <div class="col-md-4">
                    <label for="status" class="form-label">Status</label>
                    <select name="status" id="status" class="form-select">
                        <option value="">All</option>
                        <option value="0" {{ request('status') == '0' ? 'selected' : '' }}>Inactive</option>
                        <option value="1" {{ request('status') == '1' ? 'selected' : '' }}>Active</option>
                    </select>
                </div>

                <div class="col-md-4 d-flex gap-2">
                    <form action="{{ route('admin.users') }}" method="GET">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-funnel"></i> Apply Filters
                        </button>
                    </form>
                    
                    <a href="{{ route('admin.users') }}" class="btn btn-outline-secondary">
                        <i class="bi bi-x-circle"></i> Reset
                    </a>
                </div>
            </form>
        </div>
    </div>

<div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h5 class="mb-0">Users List</h5>
        </div>
        <div class="card-body table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Number of Apartments</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($users as $index => $user)
                        <tr>
                            <td>{{ $users->firstItem() + $index }}</td>
                            <td>{{ $user->name }}</td>
                            <td>{{ $user->email }}</td>
                            <td>{{ $user->role == 0 ? 'Apartment Owner' : 'Renter' }}</td>
                            <td>
                                @if($user->status === 1)
                                    <span class="badge bg-success">Active</span>
                                @else
                                    <span class="badge bg-danger">Inactive</span>
                                @endif
                            </td>
                            <td class="text-center">
                                {{ $user->apartments->count() }}
                            </td>
                            <td class="text-end">
                                <form action="{{ route('admin.users.toggleStatus', $user) }}" method="POST" class="status-form">
                                    @csrf
                                    @method('PATCH')
                                    <button class="btn btn-sm btn-danger">
                                        <i class="bi bi-slash-circle"></i> Change Status
                                    </button>
                                </form>
                                
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No users found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            {{-- Pagination --}}
            <div class="d-flex justify-content-center mt-3">
                {{ $users->onEachSide(1)->links('pagination::bootstrap-5') }}
            </div>

        </div>
    </div>

</div>


@push('scripts')
<script>
    document.querySelectorAll('.status-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault()

            Swal.fire({
                title: 'Are you sure?',
                text: "This will change the user's status!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, change it'
            }).then((result) => {
                if(result.isConfirmed) {
                    form.submit()
                }
            })
        })
    })
</script>


@endpush

@endsection