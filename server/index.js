import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello from backend" });
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server has started on port ${port}`));
