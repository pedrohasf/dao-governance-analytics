import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProposal, IProtocol } from "../../utils/interfaces";
import { useRouter } from "next/router";
import formatter from "../../utils/currencyFormatter";
import numberFormatter from "../../utils/numberFormatter";

export default function Protocol() {
  const router = useRouter();
  const { cname } = router.query;
  const [loading, setLoading] = useState(true);
  const [protocolData, setProtocolData] = useState<IProtocol>({} as IProtocol);
  const [protocolProposalsData, setProtocolProposalsData] = useState<
    IProposal[]
  >([]);
  const [protocolProposalsNextCursor, setProtocolProposalsNextCursor] =
    useState();
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
        setProtocolProposalsNextCursor(
          protocolProposalsResponse.data.nextCursor
        );
      }
    };

    fetchProtocol();
    fetchProposals();
    setLoading(false);
  }, [cname]);

  const loadMoreProposals = async () => {
    const protocolProposalsResponse = await axios.get(
      "/api/protocols/" +
        cname +
        "/proposals" +
        `?cursor=${protocolProposalsNextCursor}`
    );
    setProtocolProposalsData([
      ...protocolProposalsData,
      ...protocolProposalsResponse.data.data,
    ]);
    setProtocolProposalsNextCursor(protocolProposalsResponse.data.nextCursor);
  };

  const getTotalVotes = (
    proposalResults: { total: number; choice: number }[]
  ) => {
    const totalVotes = proposalResults.reduce((acc, currentResult) => {
      return acc + currentResult.total;
    }, 0);
    return totalVotes;
  };
  return (
    <div className="bg-gray-900 text-white py-8">
      <Head>
        <title>Governance {loading ? null : `| ${protocolData.name}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-9/12 mx-auto font-pop">
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
              <h1 className="text-3xl font-bold ml-8">{protocolData.name}</h1>
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
              <h2 className="text-2xl text-yellow-400 font-semibold mb-10">
                Proposals
              </h2>
              <div>
                <div className="flex items-center justify-between mx-auto border-b-2 border-gray-700 px-10 py-3 bg-gray-100 shadow-inner text-gray-900 font-black text-lg">
                  <span>Proposal</span>
                  <span>Total votes</span>
                </div>
                {protocolProposalsData.map((proposal) => (
                  <a
                    className="flex items-center justify-between mx-auto px-10 py-4 bg-gray-100 shadow-inner mb-5 text-gray-600"
                    key={proposal.refId}
                    href={`/governance/${proposal.protocol}/proposal/${proposal.refId}`}
                  >
                    <div className="flex items-center">
                      <img
                        className="w-10 mr-8"
                        src={
                          protocolData.icons
                            ? protocolData.icons[protocolData.icons.length - 1]
                                ?.url
                            : ""
                        }
                        alt={protocolData.name + " Icon"}
                      />
                      <div className="flex flex-col">
                        <h3 className="text-xl font-medium">
                          {proposal.title}
                        </h3>
                        <div className="flex items-center">
                          <span
                            className={`uppercase font-black text-sm px-2 py-1 mr-2 ${
                              proposal.currentState === "executed" ||
                              proposal.currentState === "active"
                                ? "bg-green-300 text-green-700"
                                : proposal.currentState === "canceled" ||
                                  proposal.currentState === "closed"
                                ? "bg-red-300 text-red-700"
                                : ""
                            }`}
                          >
                            {proposal.currentState}
                          </span>
                          <span className="text-gray-400 font-semibold pl-2 border-l border-gray-900">
                            {parseInt(proposal.id)
                              ? `ID: ${parseInt(proposal.id) + 1}`
                              : null}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-lg">
                        {numberFormatter(getTotalVotes(proposal.results))}
                      </span>
                      <span>{proposal.totalVotes} addresses</span>
                    </div>
                  </a>
                ))}
                {protocolProposalsNextCursor ? (
                  <button
                    className="bg-yellow-500 text-gray-900 font-bold text-xl px-4 py-2 flex ml-auto"
                    onClick={loadMoreProposals}
                  >
                    Load More
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
