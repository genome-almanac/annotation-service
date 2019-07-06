import { CytobandParameters, AssemblyParameters,
	 ChromLengthParameters, RefSeqGeneParameters } from './types';

function coordinateParameters(startname: string = "startcoordinate",
			      endname: string = "endcoordinate"): (tableName: string) => string {
    return function(tableName: string): string {
	return (
	    "(("
		+ tableName + "." + startname + " <= ${" + tableName + ".coordinates.start} AND "
		+ tableName + "." + endname + " >= ${" + tableName + ".coordinates.start}) OR ("
		+ tableName + "." + startname + " <= ${" + tableName + ".coordinates.end} AND "
		+ tableName + "." + endname + " >= ${" + tableName + ".coordinates.end}) OR ("
		+ tableName + "." + startname + " >= ${" + tableName + ".coordinates.start} AND "
		+ tableName + "." + endname + " <= ${" + tableName + ".coordinates.end}))"
	);
    }
}

const CYTOBAND_PARAMETERS: { [key: string]: (tableName: string) => string } = {
    coordinates: coordinateParameters(),
    chromosome: (tableName: string): string => tableName + ".chromosome = ${" + tableName + ".chromosome}",
    bandname: (tableName: string): string => tableName + ".bandname = ANY(${" + tableName + ".bandname})",
    stain: (tableName: string): string => tableName + ".stain = ANY(${" + tableName + ".stain})"
};

const CHROM_LENGTH_PARAMETERS: { [key: string]: (tableName: string) => string } = {
    chromosome: (tableName: string): string => tableName + ".chromosome = ${" + tableName + ".chromosome}",
    minLength: (tableName: string): string => tableName + ".length >= ${" + tableName + ".minLength}",
    maxLength: (tableName: string): string => tableName + ".length <= ${" + tableName + ".maxLength}"
};

const ASSEMBLY_PARAMETERS: { [key: string]: (tableName: string) => string } = {
    name: (tableName: string): string => tableName + ".name ILIKE '${" + tableName + ".name#}%'",
    description: (tableName: string): string => tableName + ".description ILIKE '${" + tableName + ".description#}%'",
    species: (tableName: string): string => tableName + ".species ILIKE '%${" + tableName + ".species#}%'",
    searchTerm: (tableName: string): string => (
	tableName + ".name ILIKE '${" + tableName + ".searchTerm#}%' OR "
	    + tableName + ".description ILIKE '${" + tableName + ".searchTerm#}%' OR "
	    + tableName + ".species ILIKE '%${" + tableName + ".searchTerm#}%'"
    )
};

const REFSEQ_GENE_PARAMETERS: { [key: string]: (tableName: string) => string } = {
    searchTerm: (tableName: string): string => (
	tableName + ".name ILIKE '${" + tableName + ".searchTerm#}%' OR "
	    + tableName + ".name2 ILIKE '${" + tableName + ".searchTerm#}%'"
    ),
    strand: (tableName: string): string => tableName + ".strand = ${" + tableName + ".strand}",
    coordinates: coordinateParameters("txstart", "txend"),
    chromosome: (tableName: string): string => tableName + ".chrom = ${" + tableName + ".chromosome}"
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

export function assemblyConditions(parameters: AssemblyParameters,
				   tableName: string): string[] {
    return Object.keys(parameters)
	.filter(key => ASSEMBLY_PARAMETERS[key] !== undefined && parameters[key] !== undefined)
	.map(key => ASSEMBLY_PARAMETERS[key](tableName));
}

export function chromLengthConditions(parameters: ChromLengthParameters,
				   tableName: string): string[] {
    return Object.keys(parameters)
	.filter(key => CHROM_LENGTH_PARAMETERS[key] !== undefined && parameters[key] !== undefined)
	.map(key => CHROM_LENGTH_PARAMETERS[key](tableName));
}

export function refSeqGeneConditions(parameters: RefSeqGeneParameters,
				     tableName: string): string[] {
    parameters.chromosome = parameters.chromosome || (parameters.coordinates && parameters.coordinates!.chromosome);
    parameters.coordinates = parameters.coordinates && parameters.coordinates!.end ? parameters.coordinates : undefined;
    return Object.keys(parameters)
	.filter(key => REFSEQ_GENE_PARAMETERS[key] !== undefined && parameters[key] !== undefined)
	.map(key => REFSEQ_GENE_PARAMETERS[key](tableName));
}
