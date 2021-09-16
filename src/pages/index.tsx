import Head from "next/head";
import { Listbox, Transition } from "@headlessui/react";
import { IProtocol } from "../utils/interfaces";
import formatter from "../utils/currencyFormatter";
import { GetServerSideProps } from "next";
import { getDataProtocols } from "./api/protocols";
import { HiSelector, HiCheck } from "react-icons/hi";
import { Fragment, useState } from "react";
import classNames from "../utils/classNames";

interface IProps {
  allProtocolsData: IProtocol[];
}

const options = ["Name", "Proposals", "Voters", "Ballots", "Token Price"];

export default function Home({ allProtocolsData }: IProps) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <div className="py-8">
      <Head>
        <title>DAO Governance Analytics</title>
      </Head>
      <div className="w-9/12 mx-auto">
        <h1 className="text-3xl font-black text-center mb-5">
          Explore governances
        </h1>
        <div>
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium text-gray-700">
                  Order by
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
                      {options.map((option) => (
                        <Listbox.Option
                          key={option}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "text-white bg-blue-600"
                                : "text-gray-900",
                              "cursor-default select-none relative py-2 pl-8 pr-4"
                            )
                          }
                          value={option}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {option}
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
                          Protocol
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Proposals
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Voters
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ballots
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Token
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allProtocolsData
                        .sort((protocolA, protocolB) => {
                          if (selected === "Name") {
                            if (protocolA.name < protocolB.name) {
                              return -1;
                            }
                            if (protocolA.name > protocolB.name) {
                              return 1;
                            }
                          }
                          if (selected === "Proposals") {
                            return (
                              protocolB.totalProposals -
                              protocolA.totalProposals
                            );
                          }
                          if (selected === "Voters") {
                            return (
                              protocolB.uniqueVoters - protocolA.uniqueVoters
                            );
                          }
                          if (selected === "Ballots") {
                            return protocolB.totalVotes - protocolA.totalVotes;
                          }
                          if (
                            selected === "Token Price" &&
                            protocolA.tokens &&
                            protocolB.tokens
                          ) {
                            return (
                              protocolB.tokens[0].marketPrices[0].price -
                              protocolA.tokens[0].marketPrices[0].price
                            );
                          }
                          return 1;
                        })
                        .map((protocol) => (
                          <tr key={protocol.cname}>
                            <td>
                              <a
                                className="flex px-6 py-4 whitespace-nowrap"
                                href={`/governance/${protocol.cname}`}
                              >
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={
                                        protocol.icons
                                          ? protocol.icons[
                                              protocol.icons.length - 1
                                            ]?.url
                                          : ""
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900">
                                      {protocol.name}
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </td>
                            <td>
                              <a
                                className="flex px-6 py-4 whitespace-nowrap"
                                href={`/governance/${protocol.cname}`}
                              >
                                <div className="text-sm text-gray-600">
                                  {protocol.totalProposals}
                                </div>
                              </a>
                            </td>
                            <td>
                              <a
                                className="flex px-6 py-4 whitespace-nowrap"
                                href={`/governance/${protocol.cname}`}
                              >
                                <div className="text-sm text-gray-600">
                                  {protocol.uniqueVoters}
                                </div>
                              </a>
                            </td>
                            <td>
                              <a
                                className="flex px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                href={`/governance/${protocol.cname}`}
                              >
                                {protocol.totalVotes}
                              </a>
                            </td>
                            <td>
                              <a
                                className="flex px-6 py-4 whitespace-nowrap"
                                href={`/governance/${protocol.cname}`}
                              >
                                {protocol.tokens ? (
                                  <div className="flex flex-col">
                                    <div className="flex">
                                      <span className="text-blue-400">
                                        $
                                        {protocol.tokens[0].symbol.toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-gray-600">
                                        {formatter.format(
                                          protocol.tokens[0].marketPrices[0]
                                            .price
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ) : null}
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
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const protocolsResponse = await getDataProtocols();
    return {
      props: {
        allProtocolsData: protocolsResponse.data,
      },
    };
  } catch (err) {
    return {
      props: {
        errored: true,
      },
    };
  }
};
