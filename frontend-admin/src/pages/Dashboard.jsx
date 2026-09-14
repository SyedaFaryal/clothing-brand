import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import StatCard from "../components/StatCard.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert-error">{error}</div>;
  if (!stats) return <p className="eyebrow">Loading dashboard…</p>;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Store performance at a glance.</p>

      <div className="stat-grid">
        <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
        <StatCard label="Total Orders" value={stats.orderCount} />
        <StatCard label="Total Products" value={stats.productCount} />
        <StatCard label="Registered Customers" value={stats.userCount} />
      </div>

      <div className="stat-grid" style={{ marginTop: 16 }}>
        <StatCard
          label="Today"
          value={`$${stats.today.revenue.toFixed(2)}`}
          sub={`${stats.today.orders} orders`}
        />
        <StatCard
          label="This Week"
          value={`$${stats.week.revenue.toFixed(2)}`}
          sub={`${stats.week.orders} orders`}
        />
        <StatCard
          label="This Month"
          value={`$${stats.month.revenue.toFixed(2)}`}
          sub={`${stats.month.orders} orders`}
        />
      </div>

      <div className="panel" style={{ marginTop: 32 }}>
        <span className="eyebrow">Low Stock (≤ 5 units)</span>
        {stats.lowStock.length === 0 ? (
          <p style={{ marginTop: 12 }}>Everything is well stocked.</p>
        ) : (
          <table className="admin-table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStock.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td className="stock-warning">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
