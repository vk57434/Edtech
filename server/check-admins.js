const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const admins = await User.find({ role: "admin" })
    .select("name email password role")
    .lean();

  console.log(JSON.stringify(admins, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
