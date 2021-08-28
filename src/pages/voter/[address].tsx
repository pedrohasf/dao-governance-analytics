import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import { IProposal, IVote, IVoter } from "../../utils/interfaces";
import { useRouter } from "next/router";

export default function Voter() {
  const router = useRouter();
  const { address } = router.query;
  const [loading, setLoading] = useState(true);
  const [voterVotesData, setVoterVotesData] = useState<IVote[]>([]);
  const [voterData, setVoterData] = useState<IVoter>({} as IVoter);
  useEffect(() => {
    const fetchVoterVotes = async () => {
      if (address) {
        const voterVotesResponse = await axios.get(
          "/api/voters/" + address + "/votes"
        );
        setVoterVotesData(voterVotesResponse.data.data);
      }
    };
    const fetchVoter = async () => {
      if (address) {
        const voterResponse = await axios.get("/api/voters/" + address);
        setVoterData(voterResponse.data.data);
      }
    };

    fetchVoterVotes();
    fetchVoter();
    setLoading(false);
  }, [address]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? null : (
        <div>
          {voterVotesData.map((vote) => (
            <a href={`/voter/${vote.address}`}>{vote.address}</a>
          ))}
          {voterData.totalVotesCast}
        </div>
      )}
    </div>
  );
}
