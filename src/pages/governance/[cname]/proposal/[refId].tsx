import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProposal, IVote } from "../../../../utils/interfaces";
import { useRouter } from "next/router";

export default function Proposal() {
  const router = useRouter();
  const { refId } = router.query;
  const [loading, setLoading] = useState(true);
  const [proposalData, setProposalData] = useState<IProposal>({} as IProposal);
  const [proposalVotesData, setProposalVotesData] = useState<IVote[]>([]);
  useEffect(() => {
    const fetchProposal = async () => {
      if (refId) {
        const proposalResponse = await axios.get("/api/proposals/" + refId);
        setProposalData(proposalResponse.data.data);
      }
    };
    const fetchProposalVotes = async () => {
      if (refId) {
        const proposalVotesResponse = await axios.get(
          "/api/proposals/" + refId + "/votes"
        );
        setProposalVotesData(proposalVotesResponse.data.data);
      }
    };

    fetchProposal();
    fetchProposalVotes();
    setLoading(false);
  }, [refId]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? null : (
        <div>
          <h2>{proposalData.title}</h2>
          {proposalVotesData.map((vote) => (
            <a href={`/voter/${vote.address}`}>{vote.address}</a>
          ))}
        </div>
      )}
    </div>
  );
}
