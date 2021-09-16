import Head from "next/head";
import { IVote, IVoter, IVoterProtocol } from "../../utils/interfaces";
import { GetServerSideProps } from "next";
import { getDataVoter } from "../api/voters/[address]";
import { getDataVotesByVoter } from "../api/voters/[address]/votes";
import numberFormatter from "../../utils/numberFormatter";
import axios from "axios";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiSelector, HiCheck, HiHome } from "react-icons/hi";
import classNames from "../../utils/classNames";

interface IProps {
  voterData: IVoter;
  voterVotesData: IVote[];
  nextCursor: string;
  voterProtocols: string[];
}

const pages = [{ name: "Voter", href: "", current: true }];

export default function Voter({
  voterData,
  voterVotesData,
  nextCursor,
  voterProtocols,
}: IProps) {
  const [selected, setSelected] = useState(voterProtocols[0]);
  const [voterVotesNextCursor, setVoterVotesNextCursor] = useState(nextCursor);
  const [allVoterVotesData, setAllVoterVotesData] = useState(voterVotesData);
  const router = useRouter();
  const { address } = router.query;
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
    <div className="flex flex-col py-6">
      <Head>
        <title>Voter | {voterData.address}</title>
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
        <div className="bg-white shadow overflow-x-auto sm:rounded-lg mt-8 mb-24">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 ">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Voter Information
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={`https://etherscan.io/address/${voterData.address}`}>
                    {voterData.address}
                  </a>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <h2 className="text-2xl font-bold mb-2">Votes</h2>
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium text-gray-700">
                  Filter by protocol
                </Listbox.Label>
                <div className="mt-1 relative">
                  <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="block truncate">{selected}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <HiSelector
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {voterProtocols.map((protocol, protocolIdx) => (
                        <Listbox.Option
                          key={protocolIdx}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "text-white bg-blue-600"
                                : "text-gray-900",
                              "cursor-default select-none relative py-2 pl-8 pr-4"
                            )
                          }
                          value={protocol}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {protocol}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-blue-600",
                                    "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                  )}
                                >
                                  <HiCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
          <div className="-my-2 overflow-x-auto lg:overflow-x-visible sm:-mx-6 lg:-mx-8 mt-2">
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
                        proposal start date - end date
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
                    {allVoterVotesData
                      .filter((vote) => {
                        if (selected === "All") {
                          return true;
                        } else {
                          return vote.protocol.toLowerCase() ===
                            selected.toLowerCase()
                            ? true
                            : false;
                        }
                      })
                      .map((vote) => (
                        <tr key={vote.refId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a href={`/governance/${vote.protocol}`}>
                              {vote.protocol}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <a
                              href={`/governance/${vote.protocol}/proposal/${vote.proposalRefId}`}
                            >
                              {vote.proposalInfo.title}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span
                              className={`uppercase rounded-sm font-black text-sm px-2 py-1 mr-2 ${
                                vote.proposalInfo.currentState === "executed" ||
                                vote.proposalInfo.currentState === "active"
                                  ? "bg-green-300 text-green-700"
                                  : vote.proposalInfo.currentState ===
                                      "canceled" ||
                                    vote.proposalInfo.currentState === "closed"
                                  ? "bg-red-300 text-red-700"
                                  : ""
                              }`}
                            >
                              {vote.proposalInfo.currentState}
                            </span>
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
                            })}{" "}
                            -{" "}
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
            </div>
            {voterVotesNextCursor ? (
              <button
                className="rounded-lg bg-gray-900 text-white font-bold text-xl px-4 py-2 flex ml-auto mt-4"
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
          voterProtocols: [
            "All",
            ...voterResponse.data.protocols.map(
              (protocol: IVoterProtocol) =>
                protocol.protocol.charAt(0).toUpperCase() +
                protocol.protocol.slice(1)
            ),
          ],
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
