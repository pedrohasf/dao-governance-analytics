export interface IICon {
  adapter: string;
  size: string;
  url: string;
}

export interface IStats {
  totalProposals: number;
  totalProtocols: number;
  totalUniqueVoters: number;
  totalVotesCast: number;
}

export interface IPrice {
  currency: string;
  price: number;
}

export interface IToken {
  adapter: string;
  symbol: string;
  network: string;
  contractAddress: string;
  marketPrices: IPrice[];
}

export interface IProtocol {
  cname: string;
  name: string;
  totalProposals: number;
  totalVotes: number;
  uniqueVoters: number;
  icons: IICon[];
  tokens: IToken[];
}

export interface IProposal {
  startTimestamp: number;
  endTimestamp: number;
  title: string;
  content: string;
  protocol: string;
  adapter: string;
  startTime: {
    blockNumber: number;
  };
  endTime: {
    blockNumber: number;
  };
  id: string;
  currentState: string;
  results: {
    total: number;
    choice: number;
  }[];
  choices: any[];
  events: {
    timestamp: number;
    event: string;
    time: {
      blockNumber: number;
    };
  }[];
  refId: string;
  proposer: string;
  totalVotes: number;
  blockNumber: number;
}

export interface IVote {
  protocol: string;
  adapter: string;
  address: string;
  refId: string;
  proposalRefId: string;
  power: number;
  choice: number;
  proposalId: string;
  timestamp: number;
  time: {
    blockNumber: number;
    timestamp: number;
  };
  proposalInfo: {
    title: string;
    startTime: {
      timestamp: number;
    };
    endTime: {
      timestamp: number;
    };
    startTimestamp: number;
    endTimestamp: number;
    choices: any[];
    events: any[];
    currentState: string;
  };
}

export interface IVoter {
  address: string;
  firstVoteCast: number;
  lastVoteCast: number;
  totalVotesCast: number;
  protocols: {
    protocol: string;
    totalVotesCast: number;
    lastVoteCast: number;
    firstVoteCast: number;
    totalPowerCast: number;
    lastCastPower: number;
  }[];
}
