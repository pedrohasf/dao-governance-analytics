import Head from "next/head";
import { Listbox, Transition } from "@headlessui/react";
import { IProtocol } from "../utils/interfaces";
import formatter from "../utils/currencyFormatter";
import { GetServerSideProps } from "next";
import { getDataProtocols } from "./api/protocols";
import { HiSelector, HiCheck } from "react-icons/hi";
import { Fragment, useState } from "react";

interface IProps {
  allProtocolsData: IProtocol[];
}

const options = ["Name", "Proposals", "Voters", "Ballots", "Token Price"];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home({ allProtocolsData }: IProps) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <div className="py-8">
      <Head>
        <title>DAO Governance Analytics</title>
      </Head>
      <div className="font-pop w-9/12 mx-auto">
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
                  <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
                                ? "text-white bg-indigo-600"
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
                                    active ? "text-white" : "text-indigo-600",
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
                return protocolB.totalProposals - protocolA.totalProposals;
              }
              if (selected === "Voters") {
                return protocolB.uniqueVoters - protocolA.uniqueVoters;
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
                    <span className="text-gray-600 font-light">Voters</span>
                    <span className="text-gray-900 font-semibold">
                      {protocol.uniqueVoters}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-gray-600 font-light">Ballots</span>
                    <span className="text-gray-900 font-semibold">
                      {protocol.totalVotes}
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
