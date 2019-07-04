import { IDatabase } from 'pg-promise';
import { AssemblyParameters, AssemblyResult } from '../types';
import { whereClause, assemblyConditions } from '../utilities';

const SELECT = `
SELECT species, name, description
`;

export async function selectAssemblies(parameters: AssemblyParameters,
				       db: IDatabase<any>): Promise<AssemblyResult[]> {
    const whereclause: string = ' ' + whereClause(assemblyConditions(parameters, "assemblies"));
    const orderBy = " ORDER BY name";
    const limit: string = parameters.limit ? ` LIMIT ${parameters.limit}` : "";
    const offset: string = parameters.offset ? ` OFFSET ${parameters.offset}` : "";
    return db.any(SELECT + " FROM assemblies WHERE " + whereclause + orderBy + limit + offset,
		  { assemblies: parameters });
};
