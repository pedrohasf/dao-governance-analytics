import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../utils/axios";

export default async function Protocol(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cname } = req.query;
    const data = getDataProtocol(Array.isArray(cname) ? cname[0] : cname);
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}

export const getDataProtocol = async (cname: string) => {
  const protocolsData = await axios.get("/protocols/" + cname);
  return protocolsData.data;
};
