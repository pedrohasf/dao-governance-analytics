import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../utils/axios";

export default async function Voter(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { address } = req.query;
    const data = getDataVoter(Array.isArray(address) ? address[0] : address);
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}

export const getDataVoter = async (address: string) => {
  const voterData = await axios.get("/voters/" + address);
  return voterData.data;
};
