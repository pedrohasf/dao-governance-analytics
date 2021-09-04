import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../utils/axios";

export default async function Protocols(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await getDataProtocols();
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}

export const getDataProtocols = async () => {
  const allProtocolsData = await axios.get("/protocols");
  return allProtocolsData.data;
};
