import { db, selectAssemblies } from '../postgres';
import { AssemblyParameters, AssemblyResult } from '../postgres/types';

async function assemblyQuery(obj: any, parameters: AssemblyParameters | any): Promise<AssemblyResult[]> {
    return selectAssemblies(parameters, db);
}

export const assemblyQueries = {
	assemblies: assemblyQuery
};
