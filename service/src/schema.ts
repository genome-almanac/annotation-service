import { gql } from 'apollo-server-express';
import { buildFederatedSchema } from "@apollo/federation";
import { resolvers } from "./resolvers";

const typeDefs = gql`
    
    type Cytoband {
        coordinates: GenomicRange!
        bandname: String!
        stain: String!
    }

    type GenomicRange {
        chromosome: String!
        start: Int!
        end: Int!
    }

    input GenomicRangeInput {
        chromosome: String!
        start: Int!
        end: Int!
    }

    type Query {
        cytoband(
            assembly: String!
            chromosome: String
            coordinates: GenomicRangeInput
            stain: [String]
            bandname: [String]
            limit: Int
            offset: Int
        ): [Cytoband],
        genomicAssemblies(name: String, species: String, description: String, searchTerm: String): [GenomicAssembly],
        chromlengths(assembly: String!, chromosome: String, minLength: Int, maxLength: Int, limit: Int, offset: Int): [ChromLength],
        refseqgenes(assembly: String!, chromosome: String, coordinates: GenomicRangeInput, searchTerm: String, limit: Int, offset: Int): [RefSeqGene],
        refseqxenogenes(assembly: String!, chromosome: String, coordinates: GenomicRangeInput, searchTerm: String, limit: Int, offset: Int): [RefSeqGene]
    }

    type GenomicAssembly {
        name: String!
        species: String!
        description: String!
    }

    type ChromLength {
        chromosome: String!
        length: Int!
    }

    type RefSeqTranscript {
        id: String!
        name: String!
        coordinates: GenomicRange!
        project: String!
        score: Int!
        strand: String!
        exons: [RefSeqExon]
    }

    type RefSeqExon {
        id: String!
        name: String!
        coordinates: GenomicRange!
        project: String!
        score: Int!
        strand: String!
        exon_number: Int!
        UTRs: [RefSeqUTR]
    }

    type RefSeqGene {
        id: String!
        transcripts: [RefSeqTranscript]!
        strand: String!
    }

    type RefSeqUTR {
        coordinates: GenomicRange!
        strand: String!
    }

`;

export const schema = buildFederatedSchema([{ typeDefs, resolvers }]);
