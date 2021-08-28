import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../utils/axios";

export default async function Proposal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { refId } = req.query;
    const proposalData = await axios.get("/proposals/" + refId);
    res.status(200).json(proposalData.data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}
