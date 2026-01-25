@extends('web.admin.layout.app')
@section('title', 'Gojoye - Logs')

@section('content')
<div class="container mt-4">
    <h1 class="mb-4">Admin Logs</h1>

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
