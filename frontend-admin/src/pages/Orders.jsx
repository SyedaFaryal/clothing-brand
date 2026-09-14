import { Fragment, useEffect, useState } from "react";
import { api } from "../api/api.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.getOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Orders</h1>
      <p className="page-subtitle">Every checkout is stored as its own order record.</p>

      {loading ? (
        <p className="eyebrow">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="panel">
          <p style={{ padding: 20 }}>No orders placed yet.</p>
        </div>
      ) : (
        <div className="panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o._id}>
                  <tr>
                    <td className="eyebrow">#{o._id.slice(-6).toUpperCase()}</td>
                    <td>
                      {o.customerName}
                      <br />
                      <span className="eyebrow">{o.customerEmail}</span>
                    </td>
                    <td>{o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                    <td>${o.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-pill status-${o.status}`}>{o.status}</span>
                    </td>
                    <td className="eyebrow">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                      >
                        {expanded === o._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expanded === o._id && (
                    <tr>
                      <td colSpan={7} className="order-detail-row">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="order-detail-item">
                            <img src={item.image} alt="" />
                            <div>
                              <div>{item.name}</div>
                              <span className="eyebrow">
                                {item.color} · Size {item.size} · Qty {item.quantity}
                              </span>
                            </div>
                            <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
