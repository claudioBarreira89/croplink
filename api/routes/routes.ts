const expressRoutes = require("express");
const {
  validateRequestBodyUser,
  validateProperty,
} = require("../middleware/validation");

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
  getBuyers,
  getFarmers,
} = require("../controllers/dynamo");

const ironOptions = {
  cookieName: "siwe",
  password: process.env.IRON_SESSION_PW as string,
  cookieOptions: {
    secure: false,
  },
};
const { withIronSessionApiRoute } = require("iron-session/next");

const router = expressRoutes.Router();

router.get(
  "/me",
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

router.post("/users/", validateProperty("id"), async (req: any, res: any) => {
  try {
    const data = await createUser(req.body.id);
    res.json({ success: true });
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
      const data = await updateUser(user);
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
      await setIsRegistered(id, value);
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
      await setIsVerified(id, value);
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
      await setGovernmentId(id, value);
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
      await setClaimTimestamp(id, value);
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
      await setTreasuryBalance(id, value);
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
      await setIsFarmer(id, value);
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
      await setIsBuyer(id, value);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ "Error occurred": error });
    }
  }
);

router.get("/users", async (_: any, res: any) => {
  try {
    const data = await getUsers();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/farmers", async (_: any, res: any) => {
  try {
    const data = await getFarmers();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/buyers", async (_: any, res: any) => {
  try {
    const data = await getBuyers();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.delete("/users/:id", async (req: any, res: any) => {
  try {
    const data = await deleteUser(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id", async (req: any, res: any) => {
  try {
    const data = await getUserById(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/isRegistered", async (req: any, res: any) => {
  try {
    const data = await getIsRegistered(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/isVerified", async (req: any, res: any) => {
  try {
    const data = await getIsVerified(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/governmentId", async (req: any, res: any) => {
  try {
    const data = await getGovernmentId(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/treasuryBalance", async (req: any, res: any) => {
  try {
    const data = await getTreasuryBalance(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/claimTimestamp", async (req: any, res: any) => {
  try {
    const data = await getClaimTimestamp(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/isFarmer", async (req: any, res: any) => {
  try {
    const data = await isFarmer(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

router.get("/users/:id/isBuyer", async (req: any, res: any) => {
  try {
    const data = await isBuyer(req.params.id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Error occurred": error });
  }
});

module.exports = router;
