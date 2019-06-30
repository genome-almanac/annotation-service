import { CytobandParameters } from './types';

const CYTOBAND_PARAMETERS: { [key: string]: (tableName: string) => string } = {
    coordinates: (tableName: string): string => (
	"(("
	    + tableName + ".startcoordinate < ${" + tableName + ".coordinates.start} AND "
	    + tableName + ".endcoordinate > ${" + tableName + ".coordinates.start}) OR ("
	    + tableName + ".startcoordinate < ${" + tableName + ".coordinates.end} AND "
	    + tableName + ".endcoordinate > ${" + tableName + ".coordinates.end}) OR ("
	    + tableName + ".startcoordinate < ${" + tableName + ".coordinates.start} AND "
	    + tableName + ".endcoordinate > ${" + tableName + ".coordinates.end}))"
    ),
    chromosome: (tableName: string): string => tableName + ".chromosome = ${" + tableName + ".chromosome}",
    bandname: (tableName: string): string => tableName + ".bandname = ANY(${" + tableName + ".bandname})",
    stain: (tableName: string): string => tableName + ".stain = ANY(${" + tableName + ".stain})"
};

export function parenthesisWrap(text: string): string {
    return '(' + text + ')';
}

export function whereClause(conditions: string[]): string {
    return conditions.length ? conditions.map(parenthesisWrap).join(" AND ") : "TRUE";
}

export function cytobandConditions(parameters: CytobandParameters,
				   tableName: string): string[] {
    parameters.chromosome = parameters.chromosome || (parameters.coordinates && parameters.coordinates!.chromosome);
    parameters.coordinates = parameters.coordinates && parameters.coordinates!.end ? parameters.coordinates : undefined;
    return Object.keys(parameters)
	.filter(key => CYTOBAND_PARAMETERS[key] !== undefined && parameters[key] !== undefined)
	.map(key => CYTOBAND_PARAMETERS[key](tableName));
}
