import { GenomicRange, CytobandInputParameters } from '../types';
import { db, selectCytobands } from '../postgres';
import { CytobandParameters, CytobandResult } from '../postgres/types';

function cytobandParameters(parameters: CytobandInputParameters | any): CytobandParameters {
	let chromosome = parameters.chromosome || (parameters.coordinates && parameters.coordinates!.chromosome);
	return {
		bandname: parameters.bandname,
		stain: parameters.stain,
		coordinates: ((parameters.coordinates && parameters.coordinates!.end) || chromosome ? {
			chromosome,
			start: parameters.coordinates && parameters.coordinates!.start,
			end: parameters.coordinates && parameters.coordinates!.end
		} : undefined),
		assembly: parameters.assembly,
		limit: parameters.limit,
		offset: parameters.offset
	};
}

async function cytobandQuery(obj: any, parameters: CytobandInputParameters | any): Promise<CytobandResult[]> {
	return selectCytobands(parameters.assembly, cytobandParameters(parameters), db);
}

function resolveCoordinates(obj: CytobandResult): GenomicRange {
	return {
		chromosome: obj.chromosome,
		start: obj.start,
		end: obj.stop
	};
}

export const cytobandQueries = {
	cytoband: cytobandQuery
};

export const cytobandResolvers = {
	Cytoband: {
		coordinates: resolveCoordinates
	}
};
