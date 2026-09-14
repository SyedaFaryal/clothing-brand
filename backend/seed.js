// Manual reseed script — wipes and reloads the full 30-item catalog.
// Useful if you've messed up your product data in the admin panel and want
// a clean slate. Run with: npm run seed
import "dotenv/config";
import connectDB from "./config/db.js";
import { ensureSeeded } from "./utils/seedDatabase.js";

const run = async () => {
  await connectDB();
  await ensureSeeded({ force: true });
  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
