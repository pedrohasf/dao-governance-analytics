import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../../utils/axios";

export default async function ProtocolProposals(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cname, cursor } = req.query;
    const data = await getDataProtocolProposals(
      Array.isArray(cname) ? cname[0] : cname,
      Array.isArray(cursor) ? cursor[0] : cursor
    );
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}

export const getDataProtocolProposals = async (
  cname: string,
  cursor?: string
) => {
  const proposalsData = await axios.get(
    "/protocols/" +
      cname +
      "/proposals" +
      `${cursor ? `?cursor=${cursor}` : ""}`
  );
  return proposalsData.data;
};
