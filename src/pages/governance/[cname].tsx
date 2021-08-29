import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProposal, IProtocol } from "../../utils/interfaces";
import { useRouter } from "next/router";
import formatter from "../../utils/formatter";

export default function Protocol() {
  const router = useRouter();
  const { cname } = router.query;
  const [loading, setLoading] = useState(true);
  const [protocolData, setProtocolData] = useState<IProtocol>({} as IProtocol);
  const [protocolProposalsData, setProtocolProposalsData] = useState<
    IProposal[]
  >([]);
  useEffect(() => {
    const fetchProtocol = async () => {
      if (cname) {
        const protocolResponse = await axios.get("/api/protocols/" + cname);
        setProtocolData(protocolResponse.data.data);
      }
    };
    const fetchProposals = async () => {
      if (cname) {
        const protocolProposalsResponse = await axios.get(
          "/api/protocols/" + cname + "/proposals"
        );
        setProtocolProposalsData(protocolProposalsResponse.data.data);
      }
    };

    fetchProtocol();
    fetchProposals();
    setLoading(false);
  }, [cname]);
  console.log(protocolData, protocolProposalsData);
  return (
    <div className="bg-gray-900 text-white py-8">
      <Head>
        <title>Governance {loading ? null : `| ${protocolData.name}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? null : (
        <div>
          <div className="flex items-center w-2/12">
            <img
              className="w-12"
              src={
                protocolData.icons
                  ? protocolData.icons[protocolData.icons.length - 1]?.url
                  : ""
              }
              alt={protocolData.name + " Icon"}
            />
            <h2 className="text-xl font-bold ml-8">{protocolData.name}</h2>
          </div>
          <div className="flex w-5/12 justify-between items-center mx-auto px-10 py-4 bg-gray-100 shadow-inner my-5 text-gray-600">
            <div className="flex flex-col justify-center items-center">
              <span className="text-gray-600 font-light">Proposals</span>
              <span className="text-gray-900 font-semibold">
                {protocolData.totalProposals}
              </span>
            </div>
            <div className="flex flex-col justify-center items-center">
              <span className="text-gray-600 font-light">Ballots</span>
              <span className="text-gray-900 font-semibold">
                {protocolData.totalVotes}
              </span>
            </div>
            <div className="flex flex-col justify-center items-center">
              <span className="text-gray-600 font-light">Voters</span>
              <span className="text-gray-900 font-semibold">
                {protocolData.uniqueVoters}
              </span>
            </div>
            {protocolData.tokens ? (
              <a
                href={`https://etherscan.io/token/${protocolData.tokens[0].contractAddress}`}
                className="w-2/12"
              >
                <div className="flex flex-col items-end">
                  <div className="flex">
                    <span className="text-blue-400 ml-4">
                      ${protocolData.tokens[0].symbol.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-lg font-medium text-gray-600">
                      {formatter.format(
                        protocolData.tokens[0].marketPrices[0].price
                      )}
                    </span>
                  </div>
                </div>
              </a>
            ) : null}
          </div>
          <div>
            <h2>Proposals</h2>
            <div>
              {protocolProposalsData.map((proposal) => (
                <a
                  className="flex"
                  key={proposal.refId}
                  href={`/governance/${proposal.protocol}/proposal/${proposal.refId}`}
                >
                  <img
                    className="w-12"
                    src={
                      protocolData.icons
                        ? protocolData.icons[protocolData.icons.length - 1]?.url
                        : ""
                    }
                    alt={protocolData.name + " Icon"}
                  />
                  <div className="flex flex-col">
                    <h3>{proposal.title}</h3>
                    <div className="flex">
                      <span>{proposal.currentState}</span>
                      <span>{proposal.id}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
