import { useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function Sales() {
  const [period, setPeriod] = useState("daily");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getSales(period)
      .then(setData)
      .finally(() => setLoading(false));
  }, [period]);

  const maxRevenue = data?.totals.length
    ? Math.max(...data.totals.map((t) => t.revenue))
    : 0;

  return (
    <div>
      <h1 className="page-title">Sales Reports</h1>
      <p className="page-subtitle">Revenue and per-item sales, broken down by period.</p>

      <div className="category-filters" style={{ marginBottom: 24 }}>
        {[
          ["daily", "Daily (14 days)"],
          ["weekly", "Weekly (12 weeks)"],
          ["monthly", "Monthly (12 months)"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`chip ${period === key ? "chip-active" : ""}`}
            onClick={() => setPeriod(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading || !data ? (
        <p className="eyebrow">Loading sales…</p>
      ) : (
        <>
          <div className="panel" style={{ marginBottom: 24 }}>
            <span className="eyebrow">Revenue Over Time</span>
            {data.totals.length === 0 ? (
              <p style={{ marginTop: 12 }}>No orders in this range yet.</p>
            ) : (
              <div className="bar-chart">
                {data.totals.map((t) => (
                  <div className="bar-col" key={t.period}>
                    <div
                      className="bar"
                      style={{
                        height: `${maxRevenue ? (t.revenue / maxRevenue) * 100 : 0}%`,
                      }}
                      title={`$${t.revenue.toFixed(2)}`}
                    />
                    <span className="bar-label">{t.period}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <span className="eyebrow">Sales By Item</span>
            {data.byItem.length === 0 ? (
              <p style={{ marginTop: 12 }}>No item sales in this range yet.</p>
            ) : (
              <table className="admin-table" style={{ marginTop: 12 }}>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Item</th>
                    <th>Units Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byItem.map((row, i) => (
                    <tr key={i}>
                      <td className="eyebrow">{row.period}</td>
                      <td>{row.item}</td>
                      <td>{row.quantity}</td>
                      <td>${row.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
