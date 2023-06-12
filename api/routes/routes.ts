const expressRoutes = require("express");
const { withIronSessionApiRoute } = require("iron-session/next");
const { SiweMessage } = require("siwe");

const ddb = require("../controllers/dynamo");
const {
  validateRequestBodyUser,
  validateProperty,
} = require("../middleware/validation");

const ironOptions = {
  cookieName: "siwe",
  password: process.env.IRON_SESSION_PW as string,
  cookieOptions: {
    secure: false,
  },
};

const router = expressRoutes.Router();

router.get(
  "/me",
  withIronSessionApiRoute(async (req: any, res: any) => {
    try {
      if (req.session.siwe?.address) {
        const { address } = req.session.siwe;
        const user = await ddb.getUserById(address);
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

router.post(
  "/verify",
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

      const user = await ddb.getUserById(address);

      if (user.Item) {
        return res.status(200).json({
          title: "VERIFIED",
          message: `User logged in`,
          userId: address,
          user,
        });
      }

      await ddb.createUser(fields.data.address, res);

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

router.post("/users/", validateProperty("id"), async (req: any, res: any) => {
  try {
    const data = await ddb.createUser(req.body.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/demandData/", async (req: any, res: any) => {
  const body = { id: 0, data: { year: "2023" } };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(
      "https://xitzbn1spc.execute-api.us-east-1.amazonaws.com/default/croplink-ea-2",
      options
    );
    const data = await response.json();
    res.status(data.statusCode ? data.statusCode : 200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.put(
  "/users/:id",
  validateRequestBodyUser,
  async (req: any, res: any) => {
    try {
      const user = req.body;
      const id = req.params.id;
      user.id = id;
      const data = await ddb.updateUser(user);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

router.put(
  "/users/:id/setIsRegistered",
  validateProperty("registered"),
  async (req: any, res: any) => {
    try {
      const id = req.params.id;
      const value = req.body.registered;
      await ddb.setIsRegistered(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

router.put(
  "/users/:id/setIsVerified",
  validateProperty("verified"),
  async (req: any, res: any) => {
    try {
      const id = req.params.id;
      const value = req.body.verified;
      await ddb.setIsVerified(id, value);
      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "An error occurred" });
    }
  }
);

router.put(
  "/users/:id/setGovernmentId",
  validateProperty("governmentId"),
  async (req: any, res: any) => {
    try {
      const id = req.params.id;
      const value = req.body.governmentId;
      await ddb.setGovernmentId(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

router.put(
  "/users/:id/setClaimTimestamp",
  validateProperty("claimTimestamp"),
  async (req: any, res: any) => {
    try {
      const id = req.params.id;
      const value = req.body.claimTimestamp;
      await ddb.setClaimTimestamp(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

router.put(
  "/users/:id/setTreasuryBalance",
  validateProperty("treasuryBalance"),
  async (req: any, res: any) => {
    try {
      const id = req.params.id;
      const value = req.body.treasuryBalance;
      await ddb.setTreasuryBalance(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

router.put(
  "/users/:id/setIsFarmer",
  validateProperty("farmer"),
  async (req: any, res: any) => {
    try {
      const id = req.params.id;
      const value = req.body.farmer;
      await ddb.setIsFarmer(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

router.put(
  "/users/:id/setIsBuyer",
  validateProperty("buyer"),
  async (req: any, res: any) => {
    try {
      const id = req.params.id;
      const value = req.body.buyer;
      await ddb.setIsBuyer(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

router.get("/users", async (_: any, res: any) => {
  try {
    const data = await ddb.getUsers();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/farmers", async (_: any, res: any) => {
  try {
    const data = await ddb.getFarmers();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/buyers", async (_: any, res: any) => {
  try {
    const data = await ddb.getBuyers();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.delete("/users/:id", async (req: any, res: any) => {
  try {
    const data = await ddb.deleteUser(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id", async (req: any, res: any) => {
  try {
    const data = await ddb.getUserById(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/isRegistered", async (req: any, res: any) => {
  try {
    const data = await ddb.getIsRegistered(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/isVerified", async (req: any, res: any) => {
  try {
    const data = await ddb.getIsVerified(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/governmentId", async (req: any, res: any) => {
  try {
    const data = await ddb.getGovernmentId(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/treasuryBalance", async (req: any, res: any) => {
  try {
    const data = await ddb.getTreasuryBalance(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/claimTimestamp", async (req: any, res: any) => {
  try {
    const data = await ddb.getClaimTimestamp(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/isFarmer", async (req: any, res: any) => {
  try {
    const data = await ddb.isFarmer(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/isBuyer", async (req: any, res: any) => {
  try {
    const data = await ddb.isBuyer(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

module.exports = router;
