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
      <div className="flex items-center text-lg pb-6 px-12">
        <a className="hover:underline text-gray-600" href="/">
          Home
        </a>
        <FiChevronRight />
        <a
          className="hover:underline text-gray-600"
          href={`/governance/${cname}`}
        >
          Governance
        </a>
        <FiChevronRight />
        <a
          className="hover:underline font-semibold"
          href={`/governance/${cname}/proposal/${refId}`}
        >
          Proposal
        </a>
      </div>
      <div className="w-9/12 mx-auto font-pop">
        <div className="my-5 flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold">{proposalData.title}</h2>
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
              <h3 className="text-xl font-bold">Details:</h3>
              <ReactMarkdown>{proposalData.content}</ReactMarkdown>
            </div>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Choices</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-col">
                    {proposalData.choices.map((choice) => (
                      <span key={choice}>{choice}</span>
                    ))}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Result</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {proposalData.choices[proposalData.results[0].choice]}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Total votes
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {numberFormatter(proposalData.results[0].total)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-8">
          <h2 className="text-3xl font-bold mb-4">Voters:</h2>
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
