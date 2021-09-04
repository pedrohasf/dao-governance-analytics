import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../../utils/axios";

export default async function ProposalVotes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { refId, cursor } = req.query;
    const data = await getDataProposalVotes(
      Array.isArray(refId) ? refId[0] : refId,
      Array.isArray(cursor) ? cursor[0] : cursor
    );
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}

export const getDataProposalVotes = async (refId: string, cursor?: string) => {
  const proposalVotesData = await axios.get(
    "/proposals/" + refId + "/votes" + `${cursor ? `?cursor=${cursor}` : ""}`
  );
  return proposalVotesData.data;
};
