import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "../../../config/";
import client from "../../../services/sanity";
import { truncateAddress } from "@/utils";

const updateUser = async (body: any, res: NextApiResponse) => {
  const { id, role } = body;

  const result = client.patch(id).set({ role });

  return res.status(201).json({
    ok: true,
    title: "UPDATED",
    message: `Account ${truncateAddress(id)} updated`,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  switch (method) {
    case "PATCH":
      try {
        await updateUser(body, res);
      } catch (_error) {
        console.log(_error);
        res.json({ ok: false });
      }
      break;
    default:
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withIronSessionApiRoute(handler, ironOptions);
