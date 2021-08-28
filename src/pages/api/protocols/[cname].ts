import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../utils/axios";

export default async function Protocol(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cname } = req.query;
    const protocolsData = await axios.get("/protocols/" + cname);
    res.status(200).json(protocolsData.data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}
