import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await sequelize.authenticate();


    await sequelize.sync({ alter: true, logging: console.log });
    
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  
};

start();
