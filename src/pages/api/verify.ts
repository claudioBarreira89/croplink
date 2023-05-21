import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { SiweMessage } from "siwe";
import { ironOptions } from "../../../config/";
import client from "../../../services/sanity";
import { truncateAddress } from "@/utils";

interface NewUser {
  _type: "users";
  _id: string;
  name: string;
  walletAddress: string;
  role?: string;
}

const createUser = async (address: string, res: NextApiResponse) => {
  const userExists = await client.fetch<NewUser[]>(
    `*[_type == "users" && _id == $_id]`,
    {
      _id: address,
    }
  );

  if (userExists.length > 0) {
    return res.status(200).json({
      title: "VERIFIED",
      message: `Wallet address ${truncateAddress(address)} is logged in`,
      userId: address,
    });
  }

  const count = await client.fetch(`count(*[_type == "users"])`);

  const userDoc: NewUser = {
    _type: "users",
    _id: address,
    name: `user #${count + 1}`,
    walletAddress: address,
  };

  const result = await client.createIfNotExists<NewUser>(userDoc);
  return res.status(201).json({
    ok: true,
    title: "CREATED",
    message: `Your account with wallet address ${truncateAddress(
      address
    )} has been created`,
    userId: result._id,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.validate(signature);

        if (fields.nonce !== req.session.nonce)
          return res.status(422).json({ message: "Invalid nonce." });

        req.session.siwe = fields;
        await req.session.save();

        await createUser(fields.address, res);

        res.json({ ok: true });
      } catch (_error) {
        console.log(_error);
        res.json({ ok: false });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
