import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProtocol, IStats } from "../utils/interfaces";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [allProtocolsData, setAllProtocolsData] = useState<IProtocol[]>([]);
  const [statsData, setStatsData] = useState<IStats>({} as IStats);
  useEffect(() => {
    const fetchAllProtocols = async () => {
      const allProtocolsResponse = await axios.get("api/protocols");
      setAllProtocolsData(allProtocolsResponse.data.data);
    };

    const fetchStats = async () => {
      const statsResponse = await axios.get("api/stats");
      setStatsData(statsResponse.data.data);
    };

    fetchAllProtocols();
    fetchStats();
    setLoading(false);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? null : (
        <div>
          <div>
            {allProtocolsData.map((protocol) => (
              <div>
                <a href={`/governance/${protocol.cname}`}>{protocol.name}</a>
              </div>
            ))}
          </div>
          <div>
            <h3>Total Protocols: {statsData.totalProtocols}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
