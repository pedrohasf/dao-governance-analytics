import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProposal, IProtocol } from "../../utils/interfaces";
import { useRouter } from "next/router";

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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? null : (
        <div>
          <h2>{protocolData.name}</h2>
          <div>
            <h3>Proposals</h3>
            <div>
              {protocolProposalsData.map((proposal) => (
                <a
                  href={`/governance/${proposal.protocol}/proposal/${proposal.refId}`}
                >
                  {proposal.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
