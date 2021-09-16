const getTotalVotes = (
  proposalResults: { total: number; choice: number }[]
) => {
  const totalVotes = proposalResults.reduce((acc, currentResult) => {
    return acc + currentResult.total;
  }, 0);
  return totalVotes;
};

export default getTotalVotes;
