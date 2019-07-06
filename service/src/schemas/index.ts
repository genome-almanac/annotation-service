import { gql, makeExecutableSchema } from 'apollo-server-express';
import { cytobandResolvers } from '../resolvers/cytoband';
import { assemblyResolvers } from '../resolvers/assembly';
import { chromLengthResolvers } from '../resolvers/chromlength';
import { geneResolvers } from '../resolvers/gene';

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
        assemblies(name: String, species: String, description: String, searchTerm: String): [Assembly],
        chromlengths(assembly: String!, chromosome: String, minLength: Int, maxLength: Int): [ChromLength],
        refseqgenes(assembly: String!, chromosome: String, coordinates: GenomicRangeInput, searchTerm: String): [Gene],
        refseqxenogenes(assembly: String!, chromosome: String, coordinates: GenomicRangeInput, searchTerm: String): [Gene]
    }

    type Assembly {
        name: String!,
        species: String!,
        description: String!
    }

    type ChromLength {
        chromosome: String!,
        length: Int!
    }

    type Transcript {
        id: String!,
        name: String!,
        coordinates: GenomicRange!,
        project: String!,
        score: Int!,
        strand: String!,
        exons: [Exon]
    }

    type Exon {
        id: String!,
        name: String!,
        coordinates: GenomicRange!,
        project: String!,
        score: Int!,
        strand: String!,
        exon_number: Int!,
        UTRs: [UTR]
    }

    type Gene {
        id: String!,
        transcripts: [Transcript]!,
        strand: String!
    }

    type UTR {
        coordinates: GenomicRange!,
        strand: String!
    }

`;

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers: [cytobandResolvers, assemblyResolvers, chromLengthResolvers, geneResolvers]
});
