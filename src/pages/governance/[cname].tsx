import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import { IProposal, IProtocol } from "../../utils/interfaces";
import { useRouter } from "next/router";
import formatter from "../../utils/currencyFormatter";
import numberFormatter from "../../utils/numberFormatter";
import { GetServerSideProps } from "next";
import { getDataProtocol } from "../api/protocols/[cname]";
import { getDataProtocolProposals } from "../api/protocols/[cname]/proposals";

interface IProps {
  protocolData: IProtocol;
  protocolProposalsData: IProposal[];
  nextCursor: string;
}

export default function Protocol({
  protocolData,
  protocolProposalsData,
  nextCursor,
}: IProps) {
  const router = useRouter();
  const { cname } = router.query;
  const [protocolProposalsNextCursor, setProtocolProposalsNextCursor] =
    useState(nextCursor);
  const [allProtocolProposalsData, setAllProtocolProposalsData] = useState(
    protocolProposalsData
  );
  const loadMoreProposals = async () => {
    const protocolProposalsResponse = await axios.get(
      "/api/protocols/" +
        cname +
        "/proposals" +
        `?cursor=${protocolProposalsNextCursor}`
    );
    setAllProtocolProposalsData([
      ...allProtocolProposalsData,
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
    <div className="py-12">
      <Head>
        <title>Governance | {protocolData.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-9/12 mx-auto font-pop">
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
          <div className="flex w-5/12 justify-between items-center mr-auto px-10 py-4 bg-gray-100 shadow-inner mt-5 mb-8 text-gray-600">
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
          <div className="">
            <h2 className="text-2xl text-gray-700 font-semibold mb-3 px-2">
              Proposals
            </h2>
            <div>
              <div className="flex items-center justify-between mx-auto border-b-2 border-gray-700 px-10 py-3 bg-gray-100 shadow-inner text-gray-900 font-semibold text-lg">
                <span>Proposal</span>
                <span>Total votes</span>
              </div>
              {allProtocolProposalsData.map((proposal) => (
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
                      <h3 className="text-xl font-medium">{proposal.title}</h3>
                      <div className="flex items-center">
                        <span
                          className={`uppercase rounded-sm font-black text-sm px-2 py-1 mr-2 ${
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
                  className="rounded-lg bg-gray-900 text-white font-bold text-xl px-4 py-2 flex ml-auto"
                  onClick={loadMoreProposals}
                >
                  Load More
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const cname = params?.cname;
  try {
    if (cname) {
      const protocolResponse = await getDataProtocol(
        Array.isArray(cname) ? cname[0] : cname
      );
      const protocolProposalsResponse = await getDataProtocolProposals(
        Array.isArray(cname) ? cname[0] : cname
      );
      return {
        props: {
          protocolData: protocolResponse.data,
          protocolProposalsData: protocolProposalsResponse.data,
          nextCursor: protocolProposalsResponse.nextCursor || null,
        },
      };
    }
  } catch (err) {
    return {
      props: {
        errored: true,
      },
    };
  }
  return { props: { data: null } };
};
