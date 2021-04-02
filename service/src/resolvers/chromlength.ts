import { db, selectChromLengths } from '../postgres';
import { ChromLengthParameters, ChromLengthResult } from '../postgres/types';

async function chromLengthQuery(_: any, parameters: ChromLengthParameters | any): Promise<ChromLengthResult[]> {
    return selectChromLengths(parameters.assembly, parameters, db);
}

export const chromLengthQueries = {
	chromlengths: chromLengthQuery
};
