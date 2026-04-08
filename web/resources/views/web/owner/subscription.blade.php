@extends('web.client.layout.app')

@section('title', __('subscription.title'))

@section('content')
<div class="container my-5">
    <div class="card p-4">
        <h3>{{ __('subscription.title') }}</h3>
        <p>{{ __('subscription.description') }}</p>
        <a href="#" class="btn btn-success">{{ __('subscription.pay_now') }}</a>
    </div>
</div>
@endsection