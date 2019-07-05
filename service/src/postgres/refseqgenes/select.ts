import { IDatabase } from 'pg-promise';
import { RefSeqGeneParameters, RefSeqGeneResult } from '../types';
import { whereClause, refSeqGeneConditions } from '../utilities';

const SELECT = `
SELECT bin, name, chrom, strand, txstart, txend, cdsstart cdsend, exoncount,
       exonstarts, exonends, score, name2, cdsstartstat, cdsendstat, exonframes
`;

export async function selectRefSeqGenes(assembly: string, parameters: RefSeqGeneParameters,
					db: IDatabase<any>, isxeno: boolean = false): Promise<RefSeqGeneResult[]> {
    const tableName = "refseq_gene_" + assembly.toLowerCase() + (isxeno ? "_xeno" : "");
    const whereclause: string = ' ' + whereClause(refSeqGeneConditions(parameters, "refseq_gene_table"));
    const orderBy = " ORDER BY chrom, txstart";
    const limit: string = parameters.limit ? ` LIMIT ${parameters.limit}` : "";
    const offset: string = parameters.offset ? ` OFFSET ${parameters.offset}` : "";
    return db.any(SELECT + " FROM ${tableName~} AS refseq_gene_table WHERE " + whereclause + orderBy + limit + offset,
		  { refseq_gene_table: parameters, tableName });
};
