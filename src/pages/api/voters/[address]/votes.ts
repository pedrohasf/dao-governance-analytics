import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../../utils/axios";

export default async function VotesByVoter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { address, cursor } = req.query;
    const data = await getDataVotesByVoter(
      Array.isArray(address) ? address[0] : address,
      Array.isArray(cursor) ? cursor[0] : cursor
    );
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}

export const getDataVotesByVoter = async (address: string, cursor?: string) => {
  const votesData = await axios.get(
    "/voters/" + address + "/votes" + `${cursor ? `?cursor=${cursor}` : ""}`
  );
  return votesData.data;
};
