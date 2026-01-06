<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Gojoye Summary Report</title>

    <style>
        :root {
            --primary: #2563eb;
            --secondary: #64748b;
            --border: #e5e7eb;
            --bg-light: #f8fafc;
        }

        body {
            font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f1f5f9;
            margin: 0;
            padding: 40px;
            color: #0f172a;
        }

        .report-container {
            max-width: 900px;
            margin: auto;
            background: #ffffff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
        }

        h2 {
            text-align: center;
            margin-bottom: 8px;
            font-size: 28px;
            color: var(--primary);
        }

        .subtitle {
            text-align: center;
            color: var(--secondary);
            font-size: 14px;
            margin-bottom: 32px;
        }

        .section-title {
            margin: 32px 0 12px;
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            border-left: 4px solid var(--primary);
            padding-left: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: var(--bg-light);
            border-radius: 8px;
            overflow: hidden;
        }

        th, td {
            padding: 14px 16px;
            border-bottom: 1px solid var(--border);
            text-align: left;
        }

        th {
            background: #e0e7ff;
            color: #1e3a8a;
            font-weight: 600;
            font-size: 14px;
        }

        td {
            font-size: 14px;
            color: #334155;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .highlight {
            font-weight: 600;
            color: #0f172a;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: var(--secondary);
        }

        
.logo-wrapper {
    text-align: center;
}

.logo-wrapper img {
    max-height: 100px;
    width: auto;
}

        
    </style>
</head>

<body>

<div class="report-container">

    <div class="logo-wrapper">
        <img src="{{ public_path('images/logo.png') }}" alt="Gojoye Logo">
    </div>


    
    <h2>Gojoye Summary Report</h2>
    <div class="subtitle">Business Performance Overview</div>

    <!-- Summary Section -->
    <div class="section-title">Summary</div>
    <table>
        <tr>
            <th>Total Users</th>
            <td class="highlight">{{ $totalUsers }}</td>
        </tr>
        <tr>
            <th>Total Sales</th>
            <td class="highlight">{{ number_format($totalSales) }} Birr</td>
        </tr>
        <tr>
            <th>Total Orders</th>
            <td class="highlight">{{ $totalOrders }}</td>
        </tr>
    </table>

    <!-- Monthly Sales Section -->
    <div class="section-title">Monthly Sales</div>
    <table>
        <tr>
            @foreach ($months as $m)
                <th>{{ $m }}</th>
            @endforeach
        </tr>
        <tr>
            @foreach ($monthlySales as $s)
                <td class="highlight">{{ number_format($s) }} Birr</td>
            @endforeach
        </tr>
    </table>

    <div class="footer">
        © {{ date('Y') }} Gojoye • Generated Report
    </div>

</div>

</body>
</html>
