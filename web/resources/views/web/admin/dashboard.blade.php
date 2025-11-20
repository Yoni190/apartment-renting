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
            <div class="card p-3 shadow-sm">
                <h5>Total Sales</h5>
                <h3>${{ number_format($totalSales) }}</h3>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card p-3 shadow-sm">
                <h5>Total Orders</h5>
                <h3>{{ $totalOrders }}</h3>
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

<script>
// SALES CHART
const salesCtx = document.getElementById('salesChart');
new Chart(salesCtx, {
    type: 'line',
    data: {
        labels: @json($monthlySales['labels']),
        datasets: [{
            label: 'Sales',
            data: @json($monthlySales['data']),
            borderWidth: 2,
            borderColor: 'blue',
            fill: false
        }]
    }
});

// USER GROWTH CHART
const userCtx = document.getElementById('userChart');
new Chart(userCtx, {
    type: 'bar',
    data: {
        labels: @json($userGrowth['labels']),
        datasets: [{
            label: 'New Users',
            data: @json($userGrowth['data']),
            backgroundColor: 'green'
        }]
    }
});
</script>


@endpush