import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "../../../config";
import client from "../../../services/sanity";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      if (req.session.siwe?.address) {
        const user = await client.getDocument(req.session.siwe?.address || "");
        return res.send({
          address: req.session.siwe?.address,
          role: user?.role,
        });
      }
      res.send({});
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
