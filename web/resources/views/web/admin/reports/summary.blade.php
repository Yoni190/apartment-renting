<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; }
        h2 { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #555; padding: 10px; text-align: left; }
        .section-title { margin: 20px 0 10px; font-size: 18px; }
    </style>
</head>

<body>

<h2>Gojoye Summary Report</h2>

<h3 class="section-title">Summary</h3>
<table>
    <tr>
        <th>Total Users</th>
        <td>{{ $totalUsers }}</td>
    </tr>
    <tr>
        <th>Total Sales</th>
        <td>{{ number_format($totalSales) }} Birr</td>
    </tr>
    <tr>
        <th>Total Orders</th>
        <td>{{ $totalOrders }}</td>
    </tr>
</table>

<h3 class="section-title">Monthly Sales</h3>
<table>
    <tr>
        @foreach ($months as $m)
            <th>{{ $m }}</th>
        @endforeach
    </tr>
    <tr>
        @foreach ($monthlySales as $s)
            <td>{{ number_format($s) }} Birr</td>
        @endforeach
    </tr>
</table>

</body>
</html>
