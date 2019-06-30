import { IDatabase } from 'pg-promise';
import { CytobandParameters, CytobandResult } from '../types';
import { whereClause, cytobandConditions } from '../utilities';

const SELECT = `
SELECT chromosome, startcoordinate AS start, endcoordinate AS stop, bandname, stain
`;

export async function selectCytobands(assembly: string, parameters: CytobandParameters,
				      db: IDatabase<any>): Promise<CytobandResult[]> {
    const tableName = "cytobands_" + assembly;
    const whereclause: string = ' ' + whereClause(cytobandConditions(parameters, tableName));
    const orderBy = " ORDER BY chromosome, bandname";
    const limit: string = parameters.limit ? ` LIMIT ${parameters.limit}` : "";
    const offset: string = parameters.offset ? ` OFFSET ${parameters.offset}` : "";
    return db.any(SELECT + ` FROM ${tableName} WHERE ` + whereclause + orderBy + limit + offset,
		  { [tableName]: parameters });
};
