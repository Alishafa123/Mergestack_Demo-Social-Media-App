import dotenv from "dotenv";

import "@models/index.js";
import app from "@/app.js";
import sequelize from "@config/database.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
    
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log("💡 Run migrations with: npx sequelize-cli db:migrate");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  
};

start();
