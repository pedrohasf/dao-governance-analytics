import Head from "next/head";
import { IVote, IVoter } from "../../utils/interfaces";
import { GetServerSideProps } from "next";
import { getDataVoter } from "../api/voters/[address]";
import { getDataVotesByVoter } from "../api/voters/[address]/votes";
import numberFormatter from "../../utils/numberFormatter";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

interface IProps {
  voterData: IVoter;
  voterVotesData: IVote[];
  nextCursor: string;
}

export default function Voter({
  voterData,
  voterVotesData,
  nextCursor,
}: IProps) {
  const router = useRouter();
  const { address } = router.query;
  const [voterVotesNextCursor, setVoterVotesNextCursor] = useState(nextCursor);
  const [allVoterVotesData, setAllVoterVotesData] = useState(voterVotesData);
  const loadMoreVotes = async () => {
    const voterVotesResponse = await axios.get(
      "/api/voters/" + address + "/votes" + `?cursor=${voterVotesNextCursor}`
    );
    setAllVoterVotesData([
      ...allVoterVotesData,
      ...voterVotesResponse.data.data,
    ]);
    setVoterVotesNextCursor(voterVotesResponse.data.nextCursor);
  };
  return (
    <div className="flex flex-col">
      <Head>
        <title>Voter | {voterData.address}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-9/12 mx-auto font-pop">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8 mb-24">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Voter Information
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {voterData.address}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  First vote cast date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(voterData.firstVoteCast * 1000).toLocaleString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Last vote cast date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(voterData.lastVoteCast * 1000).toLocaleString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Protocols</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex">
                    {voterData.protocols.map((protocol) => (
                      <div className="flex flex-col" key={protocol.protocol}>
                        <span>{protocol.protocol}</span>
                        <span>
                          First vote cast:{" "}
                          {new Date(
                            protocol.firstVoteCast * 1000
                          ).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>
                          Last vote cast:{" "}
                          {new Date(
                            protocol.lastVoteCast * 1000
                          ).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>
                          Last cast power:{" "}
                          {numberFormatter(protocol.lastCastPower)}
                        </span>
                        <span>
                          Total power cast:{" "}
                          {numberFormatter(protocol.totalPowerCast)}
                        </span>
                        <span>Total votes cast: {protocol.totalVotesCast}</span>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Total votes cast
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {voterData.totalVotesCast}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Votes:</h2>
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
                        Protocol
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Proposal title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        choice
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        power cast
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        proposal start date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        proposal end date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vote date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allVoterVotesData.map((vote) => (
                      <tr key={vote.timestamp}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href={`/governance/${vote.protocol}`}>
                            {vote.protocol}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <a
                            href={`/governance/${vote.protocol}/proposal/${vote.proposalRefId}`}
                          >
                            {vote.proposalInfo.title}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {vote.proposalInfo.currentState}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {vote.proposalInfo.choices[vote.choice]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {numberFormatter(vote.power)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {new Date(
                            vote.proposalInfo.startTimestamp * 1000
                          ).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {new Date(
                            vote.proposalInfo.endTimestamp * 1000
                          ).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {new Date(vote.timestamp * 1000).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {voterVotesNextCursor ? (
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const address = params?.address;
  try {
    if (address) {
      const voterResponse = await getDataVoter(
        Array.isArray(address) ? address[0] : address
      );
      const voterVotesResponse = await getDataVotesByVoter(
        Array.isArray(address) ? address[0] : address
      );
      return {
        props: {
          voterData: voterResponse.data,
          voterVotesData: voterVotesResponse.data,
          nextCursor: voterVotesResponse.nextCursor || null,
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
