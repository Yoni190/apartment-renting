@extends('web.admin.layout.app')
@section('title', 'Gojoye - Apartments')

@section('content')

<h1>Apartments</h1>

{{-- Filter Card --}}
    <div class="card shadow-sm mb-4">
        <div class="card-header bg-light">
            <h5 class="mb-0">Filter Apartments</h5>
        </div>
        <div class="card-body">
            <form method="GET" action="{{ route('admin.apartments') }}" class="row g-3 align-items-end">

                <div class="col-md-4">
                    <label for="name" class="form-label">Search by Title</label>
                    <input type="text" name="title" id="title" value="{{ request('title') }}" class="form-control" placeholder="Enter title...">
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
                    
                    <a href="{{ route('admin.apartments') }}" class="btn btn-outline-secondary">
                        <i class="bi bi-x-circle"></i> Reset
                    </a>
                </div>
            </form>
        </div>
    </div>

<div class="card shadow-sm">
        <div class="card-header bg-dark text-white">
            <h5 class="mb-0">Apartments List</h5>
        </div>
        <div class="card-body table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Address</th>
                        <th>Bedrooms</th>
                        <th>Bathrooms</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($apartments as $apartment)
                        <tr>
                            <td>{{ $apartment->id }}</td>
                            <td>{{ $apartment->title }}</td>
                            <td>{{ $apartment->description }}</td>
                            <td>{{ $apartment->price }}
                                <svg width="15" height="15" viewBox="0 0 1143 1278" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 ml-1 text-gray-600" data-state="closed"><path d="M738.75 0.0653076C832.888 0.0653076 909.376 17.128 968.213 51.2533C1028.23 84.2019 1072.35 133.036 1100.59 197.757C1128.84 261.301 1142.96 338.965 1142.96 430.75V1278H920.555V439.576C920.555 358.381 906.434 296.603 878.193 254.24C849.951 210.701 801.705 188.931 733.454 188.931C686.385 188.931 649.318 199.522 622.253 220.703C595.188 241.884 575.772 271.303 564.004 308.958C553.414 346.614 548.118 390.741 548.118 441.341V1278H325.715V427.22C325.715 342.495 339.836 268.361 368.078 204.817C397.496 140.097 442.212 90.0856 502.226 54.7836C562.239 18.3048 641.08 0.0653076 738.75 0.0653076Z" fill="currentColor"></path><path d="M726.148 822.07L71.3848 809.729L123.657 926.784L778.421 939.125L726.148 822.07Z" fill="currentColor"></path><path d="M654.763 616.216L0 603.875L52.2726 720.93L707.036 733.271L654.763 616.216Z" fill="currentColor"></path></svg>
                            </td>
                            <td>{{ $apartment->address }}</td>
                            <td>{{ $apartment->bedrooms }}</td>
                            <td>{{ $apartment->bathrooms }}</td>
                            <td>
                                @if($apartment->status === 1)
                                    <span class="badge bg-success">Active</span>
                                @else
                                    <span class="badge bg-danger">Inactive</span>
                                @endif
                            </td>
                            <td class="text-end">
                                <form action="{{ route('admin.apartments.toggleStatus', $apartment) }}" method="POST" class="status-form">
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
                            <td colspan="6" class="text-center text-muted py-4">No apartments found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

            {{-- Pagination --}}
            <div class="d-flex justify-content-center mt-3">
                {{ $apartments->links() }}
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
                text: "This will change the apartment's status!",
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