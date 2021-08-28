import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../utils/axios";

export default async function Protocols(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allProtocolsData = await axios.get("/protocols");
    res.status(200).json(allProtocolsData.data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}
