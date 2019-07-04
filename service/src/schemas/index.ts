import { gql, makeExecutableSchema } from 'apollo-server-express';
import { cytobandResolvers } from '../resolvers/cytoband';
import { assemblyResolvers } from '../resolvers/assembly';

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
                 stain: [String], bandname: [String], limit: Int, offset: Int): [Cytoband],
        assemblies(name: String, species: String, description: String, searchTerm: String): [Assembly]
    }

    type Assembly {
        name: String!,
        species: String!,
        description: String!
    }
`;

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers: [cytobandResolvers, assemblyResolvers]
});
