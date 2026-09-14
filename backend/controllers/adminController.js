import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysAgo = (n) => {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - n);
  return d;
};

// ---- Top-line dashboard numbers ----
export const getDashboardStats = async (req, res) => {
  const [productCount, orderCount, userCount, revenueAgg, todayAgg, weekAgg, monthAgg, lowStock] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: daysAgo(0) } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: daysAgo(7) } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: daysAgo(30) } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Product.find({ stock: { $lte: 5 } }).select("name stock category").limit(10),
    ]);

  res.json({
    success: true,
    data: {
      productCount,
      orderCount,
      userCount,
      totalRevenue: revenueAgg[0]?.total || 0,
      today: { revenue: todayAgg[0]?.total || 0, orders: todayAgg[0]?.count || 0 },
      week: { revenue: weekAgg[0]?.total || 0, orders: weekAgg[0]?.count || 0 },
      month: { revenue: monthAgg[0]?.total || 0, orders: monthAgg[0]?.count || 0 },
      lowStock,
    },
  });
};

// ---- Sales broken down by item, over daily / weekly / monthly buckets ----
// GET /api/admin/sales?period=daily|weekly|monthly
export const getSalesReport = async (req, res) => {
  const period = ["daily", "weekly", "monthly"].includes(req.query.period)
    ? req.query.period
    : "daily";

  const rangeStart = period === "daily" ? daysAgo(13) : period === "weekly" ? daysAgo(84) : daysAgo(365);

  const dateExpr =
    period === "daily"
      ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
      : period === "weekly"
      ? {
          $concat: [
            { $toString: { $isoWeekYear: "$createdAt" } },
            "-W",
            { $toString: { $isoWeek: "$createdAt" } },
          ],
        }
      : { $dateToString: { format: "%Y-%m", date: "$createdAt" } };

  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: rangeStart } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: { period: dateExpr, item: "$items.name" },
        quantity: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { "_id.period": 1 } },
  ]);

  // Also roll up total revenue per bucket (all items combined) for a simple chart.
  const totals = await Order.aggregate([
    { $match: { createdAt: { $gte: rangeStart } } },
    {
      $group: {
        _id: dateExpr,
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    period,
    data: {
      byItem: rows.map((r) => ({
        period: r._id.period,
        item: r._id.item,
        quantity: r.quantity,
        revenue: r.revenue,
      })),
      totals: totals.map((t) => ({ period: t._id, revenue: t.revenue, orders: t.orders })),
    },
  });
};

export const listUsers = async (req, res) => {
  const users = await User.find({ role: "customer" }).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
};
