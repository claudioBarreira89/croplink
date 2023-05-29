// @ts-ignore
const dotenv = require("dotenv");
const express = require("express");
const { withIronSessionApiRoute } = require("iron-session/next");
const next = require("next");
const { SiweMessage } = require("siwe");

const {
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
} = require("./controllers/dynamo");
const {
  validateRequestBodyUser,
  validateProperty,
} = require("./middleware/validation");

const dev = process.env.NODE_ENV !== "production";

const server = next({ dev });
const handle = server.getRequestHandler();

dotenv.config();

const port = process.env.PORT;

const ironOptions = {
  cookieName: "siwe",
  password: process.env.IRON_SESSION_PW as string,
  cookieOptions: {
    secure: false,
  },
};

const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get(
  "/api/ddb/me",
  withIronSessionApiRoute(async (req: any, res: any) => {
    try {
      if (req.session.siwe?.address) {
        const { address } = req.session.siwe;
        const user = await getUserById(address);
        const { Item } = user || {};

        return res.json({
          address: req.session.siwe?.address,
          role:
            (Item.farmer && "farmer") || (Item.buyer && "buyer") || undefined,
          ...Item,
        });
      }
      res.json({});
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }, ironOptions)
);

app.post(
  "/api/ddb/verify",
  withIronSessionApiRoute(async (req: any, res: any) => {
    try {
      const { message, signature } = req.body;
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.verify({ signature });

      if (fields.data.nonce !== req.session.nonce)
        return res.status(422).json({ message: "Invalid nonce." });

      req.session.siwe = fields.data;
      await req.session.save();

      const { address } = fields.data;

      const user = await getUserById(address);

      if (user.Item) {
        return res.status(200).json({
          title: "VERIFIED",
          message: `User logged in`,
          userId: address,
          user,
        });
      }

      await createUser(fields.data.address, res);

      return res.status(201).json({
        ok: true,
        title: "CREATED",
        message: "User created",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }, ironOptions)
);

app.post(
  "/api/ddb/users/",
  validateProperty("id"),
  async (req: any, res: any) => {
    try {
      const data = await createUser(req.body.id);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

app.put(
  "/api/ddb/users/:id",
  validateRequestBodyUser,
  async (req: any, res: any) => {
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
  }
);

app.put(
  "/api/ddb/users/:id/setIsRegistered",
  validateProperty("registered"),
  async (req: any, res: any) => {
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
  async (req: any, res: any) => {
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
  async (req: any, res: any) => {
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
  async (req: any, res: any) => {
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
  async (req: any, res: any) => {
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
  async (req: any, res: any) => {
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
  async (req: any, res: any) => {
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

app.get("/api/ddb/users", async (_: any, res: any) => {
  try {
    const data = await getUsers();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.delete("/api/ddb/users/:id", async (req: any, res: any) => {
  try {
    const data = await deleteUser(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id", async (req: any, res: any) => {
  try {
    const data = await getUserById(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/isRegistered", async (req: any, res: any) => {
  try {
    const data = await getIsRegistered(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/isVerified", async (req: any, res: any) => {
  try {
    const data = await getIsVerified(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/governmentId", async (req: any, res: any) => {
  try {
    const data = await getGovernmentId(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/treasuryBalance", async (req: any, res: any) => {
  try {
    const data = await getTreasuryBalance(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/claimTimestamp", async (req: any, res: any) => {
  try {
    const data = await getClaimTimestamp(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/isFarmer", async (req: any, res: any) => {
  try {
    const data = await isFarmer(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.get("/api/ddb/users/:id/isBuyer", async (req: any, res: any) => {
  try {
    const data = await isBuyer(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

app.all("*", async (req: any, res: any) => {
  handle(req, res);
});

module.exports = app;
