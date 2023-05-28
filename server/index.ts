import dotenv from "dotenv";
import express from "express";

import {
  getUsers,
  updateUser,
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
  createUser,
  setIsFarmer,
  setIsBuyer,
} from "./controllers/dynamo";
import {
  validateRequestBodyUser,
  validateProperty,
} from "./middleware/validation";

const app = express();

dotenv.config({ path: `${__dirname}/.env.local` });

const port = process.env.EXPRESS_PORT;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send(`API running on port ${port}`);
});

app.post("/api/ddb/users/", validateProperty("id"), async (req, res) => {
  try {
    const data = await createUser(req.body.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.put("/api/ddb/users/:id", validateRequestBodyUser, async (req, res) => {
  try {
    const user = req.body;
    const id = req.params.id;
    user.id = id;
    const data = await updateUser(user);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.put(
  "/api/ddb/users/:id/setIsRegistered",
  validateProperty("registered"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const value = req.body.registered;
      await setIsRegistered(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

app.put(
  "/api/ddb/users/:id/setIsVerified",
  validateProperty("verified"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const value = req.body.verified;
      await setIsVerified(id, value);
      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "An error occurred" });
    }
  }
);

app.put(
  "/api/ddb/users/:id/setGovernmentId",
  validateProperty("governmentId"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const value = req.body.governmentId;
      await setGovernmentId(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

app.put(
  "/api/ddb/users/:id/setClaimTimestamp",
  validateProperty("claimTimestamp"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const value = req.body.claimTimestamp;
      await setClaimTimestamp(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

app.put(
  "/api/ddb/users/:id/setTreasuryBalance",
  validateProperty("treasuryBalance"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const value = req.body.treasuryBalance;
      await setTreasuryBalance(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

app.put(
  "/api/ddb/users/:id/setIsFarmer",
  validateProperty("farmer"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const value = req.body.farmer;
      await setIsFarmer(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

app.put(
  "/api/ddb/users/:id/setIsBuyer",
  validateProperty("buyer"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const value = req.body.buyer;
      await setIsBuyer(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

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
console.log("server", process.env.EXPRESS_PORT);
