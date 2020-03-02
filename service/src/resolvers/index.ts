import { GraphQLResolverMap } from "apollo-graphql";
import { cytobandResolvers, cytobandQueries } from "./cytoband";
import { assemblyQueries } from "./assembly";
import { chromLengthQueries } from "./chromlength";
import { geneQueries } from "./gene";

export const resolvers: GraphQLResolverMap = {
    Query: {
        ...cytobandQueries,
        ...assemblyQueries,
        ...chromLengthQueries,
        ...geneQueries
    },
    ...cytobandResolvers
};
