const dotenv = require("dotenv");
const express = require("express");
const next = require("next");

const ddbRoutes = require("./routes/routes");

const dev = process.env.NODE_ENV !== "production";

const server = next({ dev });
const handle = server.getRequestHandler();

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/api/ddb", ddbRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.all("*", async (req: any, res: any) => {
  handle(req, res);
});

module.exports = app;
