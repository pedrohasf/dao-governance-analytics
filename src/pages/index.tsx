import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProtocol } from "../utils/interfaces";
import formatter from "../utils/currencyFormatter";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [allProtocolsData, setAllProtocolsData] = useState<IProtocol[]>([]);
  useEffect(() => {
    const fetchAllProtocols = async () => {
      const allProtocolsResponse = await axios.get("api/protocols");
      setAllProtocolsData(allProtocolsResponse.data.data);
    };

    fetchAllProtocols();
    setLoading(false);
  }, []);
  return (
    <div className="bg-gray-900 text-white py-8">
      <Head>
        <title>DAO Governance Analytics</title>
      </Head>
      <div className="font-pop w-9/12 mx-auto">
        <h1 className="text-3xl font-black text-center mb-16">
          Explore governances
        </h1>
        {loading ? null : (
          <div>
            {allProtocolsData.map((protocol) => (
              <a
                href={`/governance/${protocol.cname}`}
                className="flex items-center justify-between mx-auto px-10 py-4 bg-gray-100 shadow-inner my-5 text-gray-600"
                key={protocol.cname}
              >
                <div className="flex items-center w-2/12">
                  <img
                    className="w-12"
                    src={
                      protocol.icons
                        ? protocol.icons[protocol.icons.length - 1]?.url
                        : ""
                    }
                    alt={protocol.name + " Icon"}
                  />
                  <h2 className="text-xl font-bold ml-8">{protocol.name}</h2>
                </div>
                <div className="flex w-5/12 justify-between">
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-gray-600 font-light">Proposals</span>
                    <span className="text-gray-900 font-semibold">
                      {protocol.totalProposals}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-gray-600 font-light">Ballots</span>
                    <span className="text-gray-900 font-semibold">
                      {protocol.totalVotes}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-gray-600 font-light">Voters</span>
                    <span className="text-gray-900 font-semibold">
                      {protocol.uniqueVoters}
                    </span>
                  </div>
                </div>
                <div className="w-2/12">
                  {protocol.tokens ? (
                    <div className="flex flex-col items-end">
                      <div className="flex">
                        <span className="text-blue-400 ml-4">
                          ${protocol.tokens[0].symbol.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-lg font-medium text-gray-600">
                          {formatter.format(
                            protocol.tokens[0].marketPrices[0].price
                          )}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
