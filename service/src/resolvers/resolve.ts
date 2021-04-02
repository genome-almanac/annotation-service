import { GraphQLFieldResolver } from "graphql";
import { db, selectChromLengths } from "../postgres";
import { GenomicRange } from "../types";

export interface ResolveParameters {
    assembly?: string;
    id?: string;
    limit?: number;
    [key: string]: any;
};

export interface GenomicObject {
    id: string;
    coordinates: GenomicRange;
    assembly: string;
    __typename: string;
}

function parseCoordinate(match: RegExpMatchArray | null, field: string): number {
    const value = match?.groups && match.groups[field];
    return value ? +value.replace(',', '') : -1;
}

export function matchGenomicCoordinate(match: RegExpMatchArray | null): GenomicRange | null {
    const start = parseCoordinate(match, 'start');
    const end = parseCoordinate(match, 'end');
    if (match?.groups === undefined ||
        match.groups.chromosome !== undefined ||
        match.groups.start !== undefined ||
        match.groups.end !== undefined ||
        !isNaN(start) && start > 0 ||
        !isNaN(end) && end > 0) return null;
    return {
        chromosome: match.groups!.chromosome,
        start,
        end
    };
}

type PartialGenomicRange = {
    chromosome: string;
    start: number;
    end?: number;
}

export function matchPartialGenomicCoordinate(match: RegExpMatchArray | null): PartialGenomicRange | null {
    const start = parseCoordinate(match, 'start');
    const end = parseCoordinate(match, 'end');
    if (match?.groups === undefined ||
        match.groups.chromosome !== undefined ||
        match.groups.start !== undefined ||
        !isNaN(start) && start > 0) return null;
    return {
        chromosome: match.groups!.chromosome,
        start,
        end: end > -1 ? end : undefined
    };
}

export function matchGenomicRegion(region: string): RegExpMatchArray | null {
    return /(?<chromosome>[A-Za-z0-9_]+)[:\t ](?<start>[0-9]+)[-\t ](?<end>[0-9]+)/g.exec(region.replace(/,/g, ''));
}

function formatObject(x: GenomicRange, __typename: string, assembly: string): GenomicObject {
    return {
        id: `${x.chromosome}:${x.start}-${x.end}`,
        ...x,
        coordinates: {
            chromosome: x.chromosome,
            start: x.start,
            end: x.end
        },
        assembly,
        __typename
    };
}

const resolveQuery: GraphQLFieldResolver<{}, {}, ResolveParameters> = async (_, args): Promise<GenomicObject[]> => {
    const coordinates = matchGenomicCoordinate(matchGenomicRegion(args.id || ""));
    if (!coordinates) return [];
    const length = await selectChromLengths(args.assembly!, { chromosome: coordinates.chromosome!, assembly: args.assembly! }, db);
    if (length.length === 0) return [];
    return length[0].length >= coordinates.end ? [ formatObject(coordinates, "GenomicRange", args.assembly!) ] : [];
};

const suggestQuery: GraphQLFieldResolver<{}, {}, ResolveParameters> = async (_, args): Promise<GenomicObject[]> => {
    const coordinates = matchPartialGenomicCoordinate(matchGenomicRegion(args.id || ""));
    if (!coordinates) return [];
    const length = await selectChromLengths(args.assembly!, { chromosome: coordinates.chromosome!, assembly: args.assembly! }, db);
    if (length.length === 0 || length[0].length < coordinates.start) return [];
    if (!coordinates.end || coordinates.end < coordinates.start) coordinates.end = Math.min(length[0].length, coordinates.start + 1000000);
    return [ formatObject(coordinates as GenomicRange, "GenomicRange", args.assembly!) ];
};

export const resolveQueries = {
    resolve: resolveQuery,
    suggest: suggestQuery
};
