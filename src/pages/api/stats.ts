import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../utils/axios";

export default async function Stats(req: NextApiRequest, res: NextApiResponse) {
  try {
    const statsData = await axios.get("/stats");
    res.status(200).json(statsData.data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}
