import type { NextApiRequest, NextApiResponse } from "next";
import axios from "../../../../utils/axios";

export default async function Protocol(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cname, cursor } = req.query;
    const proposalsData = await axios.get(
      "/protocols/" +
        cname +
        "/proposals" +
        `${cursor ? `?cursor=${cursor}` : ""}`
    );
    res.status(200).json(proposalsData.data);
  } catch (error) {
    res.json(error);
    res.status(400).end();
  }
}
