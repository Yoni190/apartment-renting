@extends('web.admin.layout.app')
@section('title', 'Gojoye - Logs')

@section('content')
<div class="container mt-4">
    <h1 class="mb-4">Admin Logs</h1>

    {{-- Filter Card --}}
    <div class="card shadow-sm mb-4">
        <div class="card-header bg-light">
            <h5 class="mb-0">Filter Logs</h5>
        </div>
        <div class="card-body">
            <form method="GET" action="{{ route('admin.logs') }}">
                <div class="row g-3">

                    {{-- Admin combo box --}}
                    <div class="col-md-3">
                        <label class="form-label">Admin</label>
                        <select name="admin_id" class="form-select">
                            <option value="">All Admins</option>
                            @foreach($admins as $admin)
                                <option value="{{ $admin->id }}"
                                    {{ request('admin_id') == $admin->id ? 'selected' : '' }}>
                                    {{ $admin->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    {{-- Action --}}
                    <div class="col-md-2">
                        <label class="form-label">Action</label>
                        <select name="action" class="form-select">
                            <option value="">All</option>
                            <option value="Create" {{ request('action') == 'Create' ? 'selected' : '' }}>Create</option>
                            <option value="Update" {{ request('action') == 'Update' ? 'selected' : '' }}>Update</option>
                            <option value="Delete" {{ request('action') == 'Delete' ? 'selected' : '' }}>Delete</option>
                        </select>
                    </div>

                    {{-- Entity Type --}}
                    <div class="col-md-2">
                        <label class="form-label">Entity Type</label>
                        <select name="entity_type" class="form-select">
                            <option value="">All</option>
                            <option value="User" {{ request('entity_type') == 'User' ? 'selected' : '' }}>User</option>
                            <option value="Apartment" {{ request('entity_type') == 'Apartment' ? 'selected' : '' }}>Apartment</option>
                        </select>
                    </div>

                    {{-- From Date --}}
                    <div class="col-md-2">
                        <label class="form-label">From</label>
                        <input type="date" name="from" value="{{ request('from') }}" class="form-control">
                    </div>

                    {{-- To Date --}}
                    <div class="col-md-2">
                        <label class="form-label">To</label>
                        <input type="date" name="to" value="{{ request('to') }}" class="form-control">
                    </div>

                    {{-- Buttons --}}
                    <div class="col-md-1 d-flex align-items-end">
                        <button class="btn btn-primary w-100">Filter</button>
                    </div>

                    <div class="col-md-12">
                        <a href="{{ route('admin.logs') }}" class="btn btn-secondary btn-sm">
                            Reset Filters
                        </a>
                    </div>

                </div>
            </form>

        </div>
    </div>

    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>#</th>
                <th>Admin</th>
                <th>Entity Type</th>
                <th>Entity</th>
                <th>Action</th>
                <th>Timestamp</th>
            </tr>
        </thead>
        <tbody>
            @forelse($logs as $log)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $log->admin->name ?? 'System' }}</td>
                    <td>{{ $log->entity_type }}</td>
                    <td>{{ $log->entity_name }}</td>
                    <td>
                        <span class="badge bg-info text-dark">
                            {{ $log->action }}
                        </span>
                    </td>
                    <td>{{ $log->created_at }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">No logs found</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection
