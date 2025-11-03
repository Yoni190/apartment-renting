@extends('web.admin.layout.app')
@section('title', 'User Management')

@section('content')

<h1>Users</h1>

<table class="table table-striped">
    <thead class="table-dark">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach($users as $user)
            <tr>
                <td>{{ $user->id }}</td>
                <td>{{ $user->name }}</td>
                <td>{{ $user->email }}</td>
                <td>{{ $user->role === 0 ? 'Renter' : 'Apartment Owner' }}</td>
                <td>
                    <button class="btn btn-danger">
                        Block
                    </button>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>


@endsection