import { getService, service } from './services'
import { ChainInfo } from '@keplr-wallet/types'
import { CosmosClient } from './cosmos-client'
import { Proposal, Vote } from '../generated/cosmos/group/v1beta1/types'
import {
    QueryProposalResponse,
    QueryProposalsByGroupPolicyResponse,
    QueryVoteByProposalVoterResponse,
    QueryVotesByProposalResponse
} from '../generated/cosmos/group/v1beta1/query'
import { MsgExec, MsgSubmitProposal, MsgVote, protobufPackage } from '../generated/cosmos/group/v1beta1/tx'

@service
export class ProposalsService {
    static serviceName: string = ProposalsService.name

    static get instance(): ProposalsService {
        return getService<ProposalsService>(ProposalsService.serviceName)
    }

    cosmosClient: CosmosClient

    constructor(cosmosClient: CosmosClient) {
        this.cosmosClient = cosmosClient
    }

    applyChainInfo = async (chainInfo: ChainInfo): Promise<void> => {
        this.cosmosClient.registry.register(
            `/${protobufPackage}.MsgSubmitProposal`,
            MsgSubmitProposal
        )
        this.cosmosClient.registry.register(
            `/${protobufPackage}.MsgVote`,
            MsgVote,
        )
        this.cosmosClient.registry.register(
            `/${protobufPackage}.MsgExec`,
            MsgExec,
        )
    }

    proposalById = async (proposalId: number): Promise<Proposal> => {
        const res = await this.cosmosClient.lcdClientGet(
            `/cosmos/group/v1beta1/proposal/${proposalId}`
        ) as QueryProposalResponse
        return res.proposal
    }

    proposalsByGroupAccount = async (accountAddress: string): Promise<Proposal[]> => {
        const res = await this.cosmosClient.lcdClientGet(
            `/cosmos/group/v1beta1/proposals_by_group_policy/${accountAddress}`
        ) as QueryProposalsByGroupPolicyResponse

        // TODO check pagination field later
        console.log("proposals pagination", res.pagination)

        return res.proposals
    }

    voteByProposalVoter = async (proposalId: number, voterAddress: string): Promise<Vote> => {
        const res = await this.cosmosClient.lcdClientGet(
            `/cosmos/group/v1beta1/vote_by_proposal_voter/${proposalId}/${voterAddress}`
        ) as QueryVoteByProposalVoterResponse
        return res.vote
    }

    votesByProposal = async (proposalId: number): Promise<Vote[]> => {
        const res = await this.cosmosClient.lcdClientGet(
            `/cosmos/group/v1beta1/votes_by_proposal/${proposalId}`
        ) as QueryVotesByProposalResponse
        return res.votes
    }

    votesByVoter = async (voterAddress: string): Promise<Vote[]> => {
        const res = await this.cosmosClient.lcdClientGet(
            `/cosmos/group/v1beta1/votes_by_voter/${voterAddress}`
        ) as QueryVotesByProposalResponse
        return res.votes
    }
}
