import express from "express";
import cors from "cors";
import { routes } from "./interface/routes";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Available endpoints:");
  console.log("  POST /api/translate - Translate document and return download URL");
  console.log("  GET /api/downloads/:filename - Download translated files");
});
