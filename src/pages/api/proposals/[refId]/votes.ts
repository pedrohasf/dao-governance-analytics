import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../../utils/axios";

export default async function ProposalVotes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { refId } = req.query;
    const proposalVotesData = await axios.get("/proposals/" + refId + "/votes");
    res.status(200).json(proposalVotesData.data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}
