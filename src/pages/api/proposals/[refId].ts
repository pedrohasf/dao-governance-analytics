import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../utils/axios";

export default async function Proposal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { refId } = req.query;
    const data = await getDataProposal(Array.isArray(refId) ? refId[0] : refId);
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}

export const getDataProposal = async (refId: string) => {
  const proposalData = await axios.get("/proposals/" + refId);
  return proposalData.data;
};
