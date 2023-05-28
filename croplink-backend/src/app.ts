import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const {
  getUsers,
  addOrUpdateUser,
  getUserById,
  deleteUser,
  setIsRegistered,
  setIsVerified,
  setGovernmentId,
  setTreasuryBalance,
  setClaimTimestamp,
  getIsRegistered,
  getIsVerified,
  getGovernmentId,
  getTreasuryBalance,
  getClaimTimestamp,
  isFarmer,
  isBuyer,
  setIsFarmer,
  setIsBuyer,
} = require("./controllers/dynamo");

const port = process.env.PORT;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${process.env.port}`);
});

app.get("/", (req, res) => {
  res.send(`API running on port ${process.env.port}`);
});

app.post("/api/ddb/users", async (req, res) => {
  try {
    const data = await addOrUpdateUser(req.body);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.put("/api/ddb/users/:id", async (req, res) => {
  try {
    const user = req.body;
    const id = req.params.id;
    user.id = id;
    const data = await addOrUpdateUser(user);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.put("/api/ddb/users/:id/setIsRegistered", async (req, res) => {
  try {
    const id = req.params.id;
    const value = req.body.registered;
    const data = await setIsRegistered(id, value);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.put("/api/ddb/users/:id/setTreasuryBalance", async (req, res) => {
  try {
    const id = req.params.id;
    const value = req.body.treasuryBalance;
    const data = await setTreasuryBalance(id, value);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.put("/api/ddb/users/:id/setGovernmentId", async (req, res) => {
  try {
    const id = req.params.id;
    const value = req.body.governemntId;
    const data = await setGovernmentId(id, value);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.put("/api/ddb/users/:id/setIsVerified", async (req, res) => {
  try {
    const id = req.params.id;
    const value = req.body.verified;
    const data = await setIsVerified(id, value);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.put("/api/ddb/users/:id/setClaimTimestamp", async (req, res) => {
  try {
    const id = req.params.id;
    const value = req.body.claimTimestamp;
    const data = await setClaimTimestamp(id, value);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users", async (_, res) => {
  try {
    const data = await getUsers();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.delete("/api/ddb/users/:id", async (req, res) => {
  try {
    const data = await deleteUser(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id", async (req, res) => {
  try {
    const data = await getUserById(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/isRegistered", async (req, res) => {
  try {
    const data = await getIsRegistered(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/isVerified", async (req, res) => {
  try {
    const data = await getIsVerified(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/governmentId", async (req, res) => {
  try {
    const data = await getGovernmentId(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/treasuryBalance", async (req, res) => {
  try {
    const data = await getTreasuryBalance(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/claimTimestamp", async (req, res) => {
  try {
    const data = await getClaimTimestamp(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/isFarmer", async (req, res) => {
  try {
    const data = await isFarmer(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/isBuyer", async (req, res) => {
  try {
    const data = await isBuyer(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});
