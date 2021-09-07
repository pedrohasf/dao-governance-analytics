import Head from "next/head";
import React, { useState } from "react";
import { IProposal, IVote } from "../../../../utils/interfaces";
import ReactMarkdown from "react-markdown";
import { GetServerSideProps } from "next";
import { getDataProposalVotes } from "../../../api/proposals/[refId]/votes";
import { getDataProposal } from "../../../api/proposals/[refId]";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";
import numberFormatter from "../../../../utils/numberFormatter";
import axios from "axios";
import { useRouter } from "next/router";
import { HiHome } from "react-icons/hi";

interface IProps {
  proposalData: IProposal;
  proposalVotesData: IVote[];
  nextCursor: string;
}

export default function Proposal({
  proposalData,
  proposalVotesData,
  nextCursor,
}: IProps) {
  const router = useRouter();
  const { refId, cname } = router.query;
  const [proposalVotesNextCursor, setProposalVotesNextCursor] =
    useState(nextCursor);
  const [allProposalVotesData, setAllProposalVotesData] =
    useState(proposalVotesData);

  const pages = [
    { name: "Governance", href: `/governance/${cname}`, current: false },
    { name: "Proposal", href: "", current: true },
  ];

  const loadMoreVotes = async () => {
    const proposalVotesResponse = await axios.get(
      "/api/proposals/" +
        refId +
        "/votes" +
        `?cursor=${proposalVotesNextCursor}`
    );
    setAllProposalVotesData([
      ...allProposalVotesData,
      ...proposalVotesResponse.data.data,
    ]);
    setProposalVotesNextCursor(proposalVotesResponse.data.nextCursor);
  };
  return (
    <div className="py-6">
      <Head>
        <title>
          {proposalData.protocol} | {proposalData.title}
        </title>
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
        <div className="my-5 flex flex-col-reverse md:flex-row justify-between items-start">
          <div>
            <div className="flex items-center">
              <h2 className="text-2xl md:text-3xl font-bold">
                {proposalData.title}
              </h2>
              <span
                className={`uppercase font-black text-sm ml-8 px-4 py-1 mr-2 w-32 rounded-full flex items-center justify-center ${
                  proposalData.currentState === "executed" ||
                  proposalData.currentState === "active"
                    ? "bg-green-300 text-green-700"
                    : proposalData.currentState === "canceled" ||
                      proposalData.currentState === "closed"
                    ? "bg-red-300 text-red-700"
                    : ""
                }`}
              >
                {proposalData.currentState}
              </span>
            </div>
            <div className="prose my-4">
              <h3 className="text-lg font-semibold">Details:</h3>
              <ReactMarkdown>{proposalData.content}</ReactMarkdown>
            </div>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8 md:mb-0">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-semibold text-gray-900">
                Information
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Start date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(
                      proposalData.startTimestamp * 1000
                    ).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    End date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(proposalData.endTimestamp * 1000).toLocaleString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Proposer
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a href={`/voter/${proposalData.proposer}`}>
                      {proposalData.proposer}
                    </a>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Choices</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-col">
                    {proposalData.choices.map((choice) => (
                      <span key={choice}>{choice}</span>
                    ))}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Result</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {proposalData.choices[proposalData.results[0].choice]}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Total power cast
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {numberFormatter(proposalData.results[0].total)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Total voters
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {proposalData.totalVotes}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-8">
          <h2 className="text-3xl font-bold mb-4">Voters:</h2>
          <div className="-my-2 sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Choice
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Power cast
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProposalVotesData.map((vote, voteIdx) => (
                      <tr
                        key={vote.timestamp}
                        className={
                          voteIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <a href={`/voter/${vote.address}`}>{vote.address}</a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {proposalData.choices[vote.choice]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {numberFormatter(vote.power)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {proposalVotesNextCursor ? (
              <button
                className="rounded-lg bg-gray-900 text-white font-bold text-xl px-4 py-2 flex ml-auto"
                onClick={loadMoreVotes}
              >
                Load More
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const refId = params?.refId;
  try {
    if (refId) {
      const proposalResponse = await getDataProposal(
        Array.isArray(refId) ? refId[0] : refId
      );
      const proposalVotesResponse = await getDataProposalVotes(
        Array.isArray(refId) ? refId[0] : refId
      );
      return {
        props: {
          proposalData: proposalResponse.data,
          proposalVotesData: proposalVotesResponse.data,
          nextCursor: proposalVotesResponse.nextCursor || null,
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
