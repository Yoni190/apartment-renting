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
        <!-- Users Growth -->
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="text-center">New Users per Month</h5>
                <canvas id="userChart"></canvas>
            </div>
        </div>

        <!-- Apartments Added -->
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="text-center">New Apartments Added</h5>
                <canvas id="apartmentsChart"></canvas>
            </div>
        </div>
    </div>


    <div class="card mt-4 shadow-sm">
        <div class="card-header bg-dark text-white">
            <h5 class="mb-0">Recent Apartments</h5>
        </div>
        <div class="card-body table-responsive">
            <table class="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Owner</th>
                        <th>Area</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($recentApartments as $index => $apt)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $apt->title }}</td>
                        <td>{{ $apt->owner->name }}</td>
                        <td>{{ $apt->area }}</td>
                        <td>
                            <span class="badge {{ $apt->status ? 'bg-success' : 'bg-warning' }}">
                                {{ $apt->status ? 'Active' : 'Pending' }}
                            </span>
                        </td>
                        <td>{{ $apt->created_at->format('d M Y') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>


</div>

@endsection


@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
const userCtx = document.getElementById('userChart');
new Chart(userCtx, {
    type: 'bar',
    data: {
        labels: @json($labels),
        datasets: [{
            label: 'New Users',
            data: @json(array_values($userGrowth)),
            backgroundColor: 'rgba(75, 192, 192, 0.7)'
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});

const aptCtx = document.getElementById('apartmentsChart');
new Chart(aptCtx, {
    type: 'line',
    data: {
        labels: @json($labels),
        datasets: [{
            label: 'Apartments Added',
            data: @json(array_values($apartmentsGrowth)),
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});
</script>


@endpush