import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../../utils/axios";

export default async function VotesByVoter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { address } = req.query;
    const votesData = await axios.get("/voters/" + address + "/votes");
    res.status(200).json(votesData.data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}
