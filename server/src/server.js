import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Smart Expense Tracking API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
