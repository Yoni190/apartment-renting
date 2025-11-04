@extends('web.admin.layout.app')
@section('title', 'Gojoye - Admin Management')

@section('content')

<h1>Admins</h1>

<div class="container-fluid py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Admin Management</h1>
        <a href="{{ route('admin.dashboard') }}" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-arrow-left"></i> Back to Dashboard
        </a>
    </div>

    {{-- Filter Card --}}
    <div class="card shadow-sm mb-4">
        <div class="card-header bg-light">
            <h5 class="mb-0">Filter admins</h5>
        </div>
        <div class="card-body">
            <form method="GET" action="{{ route('admin.admins.index') }}" class="row g-3 align-items-end">

                <div class="col-md-4">
                    <label for="name" class="form-label">Search by Name</label>
                    <input type="text" name="name" id="name" value="{{ request('name') }}" class="form-control" placeholder="Enter name...">
                </div>



                <div class="col-md-4 d-flex gap-2">
                    <form action="{{ route('admin.admins.index') }}" method="GET">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-funnel"></i> Apply Filters
                        </button>
                    </form>
                    
                    <a href="{{ route('admin.admins.index') }}" class="btn btn-outline-secondary">
                        <i class="bi bi-x-circle"></i> Reset
                    </a>
                </div>
            </form>
        </div>
    </div>

<div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h5 class="mb-0">admins List</h5>
        </div>
        <div class="card-body table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($admins as $admin)
                        <tr>
                            <td>{{ $admin->id }}</td>
                            <td>{{ $admin->name }}</td>
                            <td>{{ $admin->email }}</td>
                            <td>{{ $admin->role->name }}</td>
                            
                            <td class="text-end">
                                <form action="{{ route('admin.delete', $admin) }}" method="POST" class="delete-form">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-sm btn-danger">
                                        <i class="bi bi-slash-circle"></i> Delete Admin
                                    </button>
                                </form>
                                
                            </td>
                            
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">No admins found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            {{-- Pagination --}}
            <div class="d-flex justify-content-center mt-3">
                {{ $admins->links() }}
            </div>
        </div>
    </div>

</div>


@push('scripts')
<script>
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault()

            Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the admin!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes'
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