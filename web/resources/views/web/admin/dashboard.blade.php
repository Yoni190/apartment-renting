@extends('web.admin.layout.app')
@section('title', 'Gojoye - Dashboard')

@section('content')


<div class="container mt-4">

    <div class="d-flex justify-content-between align-items-center">
        <h2 class="mb-4">Admin Dashboard</h2>
        <a href="{{ route('admin.downloadReport') }}" class="btn btn-primary p-2">
                Download Report (PDF)
            </a>
    </div>
    

    <!-- Summary Cards -->
    <div class="row mb-4">
        <div class="col-md-4">
            <div class="card p-3 shadow-sm">
                <h5>Total Users</h5>
                <h3>{{ $totalUsers }}</h3>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card p-3 shadow-sm bg-success text-white">
                <h5>Total Apartments</h5>
                <h3>{{ $totalApartments }}</h3>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card p-3 shadow-sm bg-warning text-dark">
                <h5>Active Listings</h5>
                <h3>{{ $activeApartments }}</h3>
            </div>
        </div>
    </div>

    <!-- Charts -->
    <div class="row mt-4">
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="text-center">Monthly Sales</h5>
                <canvas id="salesChart"></canvas>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="text-center">User Growth</h5>
                <canvas id="userChart"></canvas>
            </div>
        </div>
    </div>

</div>

@endsection


@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>




@endpush