import { gql, makeExecutableSchema } from 'apollo-server-express';
import { cytobandResolvers } from '../resolvers/cytoband';

const typeDefs = gql`
    type Cytoband {
        coordinates: GenomicRange!,
        bandname: String!,
        stain: String!
    }

    type GenomicRange {
        chromosome: String!,
        start: Int!,
        end: Int!
    }

    input GenomicRangeInput {
        chromosome: String!,
        start: Int!,
        end: Int!
    }

    type Query {
        cytoband(assembly: String!, chromosome: String, coordinates: GenomicRangeInput,
                 stain: [String], bandname: [String], limit: Int, offset: Int): [Cytoband]
    }
`;

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers: [cytobandResolvers]
});
