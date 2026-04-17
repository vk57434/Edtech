const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const DEFAULT_ADMINS = [
  {
    name: "Admin VK",
    email: "vk57434@gmail.com",
    password: "admin123@",
  },
  {
    name: "Admin Pallawi",
    email: "pallawipratyay6@gmail.com",
    password: "pallawi123@",
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const admin of DEFAULT_ADMINS) {
    const existing = await User.findOne({ email: admin.email, role: "admin" });

    if (existing) {
      existing.name = admin.name;
      existing.password = admin.password;
      existing.role = "admin";
      await existing.save();
      console.log(`synced: ${admin.email}`);
    } else {
      await User.create({
        ...admin,
        role: "admin",
      });
      console.log(`created: ${admin.email}`);
    }
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
