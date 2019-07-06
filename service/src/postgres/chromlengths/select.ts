import { IDatabase } from 'pg-promise';
import { ChromLengthParameters, ChromLengthResult } from '../types';
import { whereClause, chromLengthConditions } from '../utilities';

const SELECT = `
SELECT chromosome, length
`;

export async function selectChromLengths(assembly: string, parameters: ChromLengthParameters,
					 db: IDatabase<any>): Promise<ChromLengthResult[]> {
    const tableName = "chrom_length_" + assembly.toLowerCase();
    const whereclause: string = ' ' + whereClause(chromLengthConditions(parameters, "chrom_length_table"));
    const orderBy = " ORDER BY chromosome, length";
    const limit: string = parameters.limit ? ` LIMIT ${parameters.limit}` : "";
    const offset: string = parameters.offset ? ` OFFSET ${parameters.offset}` : "";
    return db.any(SELECT + " FROM ${tableName~} AS chrom_length_table WHERE " + whereclause + orderBy + limit + offset,
		  { chrom_length_table: parameters, tableName });
};
