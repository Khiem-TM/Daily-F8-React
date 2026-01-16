import React from 'react'

export default function Sale() {
  return (
    <div className="user-page fade-in">
      <div className="page-header" style={{ textAlign: 'left' }}>
        <h1>💰 Sales Management</h1>
        <p>Track and manage your sales performance</p>
      </div>

      <div className="sales-summary">
        <div className="sales-card">
          <h3>Today's Sales</h3>
          <div className="sales-value">$850.00</div>
          <div className="badge badge-success">+15.3%</div>
        </div>
        <div className="sales-card">
          <h3>This Week</h3>
          <div className="sales-value">$4,200.00</div>
          <div className="badge badge-success">+8.7%</div>
        </div>
        <div className="sales-card">
          <h3>This Month</h3>
          <div className="sales-value">$18,500.00</div>
          <div className="badge badge-primary">+12.1%</div>
        </div>
      </div>

      <div className="sales-table-container">
        <h2>Recent Sales</h2>
        <table className="sales-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#ORD-001</td>
              <td>John Doe</td>
              <td>Product A</td>
              <td>$120.00</td>
              <td><span className="badge badge-success">Completed</span></td>
              <td>2026-01-12</td>
            </tr>
            <tr>
              <td>#ORD-002</td>
              <td>Jane Smith</td>
              <td>Product B</td>
              <td>$85.00</td>
              <td><span className="badge badge-primary">Processing</span></td>
              <td>2026-01-12</td>
            </tr>
            <tr>
              <td>#ORD-003</td>
              <td>Bob Wilson</td>
              <td>Product C</td>
              <td>$230.00</td>
              <td><span className="badge badge-success">Completed</span></td>
              <td>2026-01-11</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
