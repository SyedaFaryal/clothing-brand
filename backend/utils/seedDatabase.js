import Product from "../models/Product.js";
import User from "../models/User.js";
import seedProducts from "../data/seedData.js";

// Seeds products only if the collection is empty,
// and creates the bootstrap admin account only if it doesn't exist.
export const ensureSeeded = async ({ force = false } = {}) => {

  const productCount = await Product.countDocuments();

  if (force || productCount === 0) {

    if (force) {
      await Product.deleteMany();
    }

    await Product.insertMany(seedProducts);

    console.log(
      `Seeded ${seedProducts.length} products (10 each: Clothing, Shoes, Makeup).`
    );

  } else {

    console.log(
      `Product catalog already has ${productCount} items, skipping seed.`
    );
  }

  // ADMIN DETAILS — must come BEFORE using them
  const adminEmail = (
    process.env.ADMIN_EMAIL || "admin@noirco.com"
  ).toLowerCase();

  const adminPassword =
    process.env.ADMIN_PASSWORD || "Admin@12345";

  const existingAdmin = await User.findOne({
    email: adminEmail
  });

  if (!existingAdmin) {

    await User.create({
      name: "Store Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log("─".repeat(50));
    console.log(" ADMIN LOGIN CREATED");
    console.log(` Email:    ${adminEmail}`);
    console.log(` Password: ${adminPassword}`);
    console.log(" Use these at the frontend-admin login screen.");
    console.log("─".repeat(50));

  } else {

    console.log("Admin account already exists.");

  }
};