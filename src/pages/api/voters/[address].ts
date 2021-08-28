import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../utils/axios";

export default async function Voter(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { address } = req.query;
    const voterData = await axios.get("/voters/" + address);
    res.status(200).json(voterData.data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}
