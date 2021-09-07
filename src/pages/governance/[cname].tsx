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
import { FiChevronRight } from "react-icons/fi";
import { HiArrowDown, HiArrowUp, HiHome } from "react-icons/hi";

interface IProps {
  protocolData: IProtocol;
  protocolProposalsData: IProposal[];
  nextCursor: string;
}

const pages = [{ name: "Governance", href: "", current: true }];

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

  const stats = [
    { name: "Proposals", stat: protocolData.totalProposals },
    { name: "Ballots", stat: protocolData.totalVotes },
    { name: "Voters", stat: protocolData.uniqueVoters },
    {
      name: protocolData.tokens
        ? `$${protocolData.tokens[0].symbol.toUpperCase()}`
        : null,
      stat: protocolData.tokens[0].marketPrices[0].price,
    },
  ];

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
    <div className="py-6">
      <Head>
        <title>Governance | {protocolData.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-10/12 mx-auto">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol
            role="list"
            className="bg-white rounded-md shadow px-6 flex space-x-4"
          >
            <li className="flex">
              <div className="flex items-center">
                <a href="/" className="text-gray-400 hover:text-gray-500">
                  <HiHome
                    className="flex-shrink-0 h-5 w-5"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Home</span>
                </a>
              </div>
            </li>
            {pages.map((page) => (
              <li key={page.name} className="flex">
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 w-6 h-full text-gray-200"
                    viewBox="0 0 24 44"
                    preserveAspectRatio="none"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                  </svg>
                  <a
                    href={page.href}
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    aria-current={page.current ? "page" : undefined}
                  >
                    {page.name}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="w-9/12 mx-auto">
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
          <div className="md:w-8/12 md:mx-auto mb-8">
            <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-4 md:divide-y-0 md:divide-x">
              {stats.map((item) =>
                item.name?.startsWith("$") ? (
                  <a
                    key={item.name}
                    href={`https://etherscan.io/token/${protocolData.tokens[0].contractAddress}`}
                  >
                    <div className="px-4 py-5 sm:p-6 shadow-inner bg-gray-50">
                      <dt className="text-base font-normal text-blue-400">
                        {item.name}
                      </dt>
                      <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-gray-900">
                          {formatter.format(item.stat)}
                        </div>
                      </dd>
                    </div>
                  </a>
                ) : (
                  <div
                    key={item.name}
                    className="px-4 py-5 sm:p-6 shadow-inner bg-gray-50"
                  >
                    <dt className="text-base font-normal text-gray-500">
                      {item.name}
                    </dt>
                    <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                      <div className="flex items-baseline text-2xl font-semibold text-gray-900">
                        {item.stat}
                      </div>
                    </dd>
                  </div>
                )
              )}
            </dl>
          </div>
          <h2 className="text-2xl text-gray-700 font-semibold mb-3 px-2">
            Proposals
          </h2>
          <div className="flex flex-col my-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Proposal
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total votes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allProtocolProposalsData.map((proposal) => (
                        <tr key={proposal.startTimestamp}>
                          <td>
                            <a
                              className="flex px-6 py-4 whitespace-nowrap"
                              href={`/governance/${proposal.protocol}/proposal/${proposal.refId}`}
                            >
                              <div className="flex items-center">
                                <img
                                  className="w-10 mr-8"
                                  src={
                                    protocolData.icons
                                      ? protocolData.icons[
                                          protocolData.icons.length - 1
                                        ]?.url
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
                                      className={`uppercase rounded-sm font-black text-sm px-2 py-1 mr-2 ${
                                        proposal.currentState === "executed" ||
                                        proposal.currentState === "active"
                                          ? "bg-green-300 text-green-700"
                                          : proposal.currentState ===
                                              "canceled" ||
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
                            </a>
                          </td>
                          <td>
                            <a
                              className="flex px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                              href={`/governance/${proposal.protocol}/proposal/${proposal.refId}`}
                            >
                              <div className="flex flex-col items-center">
                                <span className="font-semibold text-lg">
                                  {numberFormatter(
                                    getTotalVotes(proposal.results)
                                  )}
                                </span>
                                <span>{proposal.totalVotes} voters</span>
                              </div>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
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
