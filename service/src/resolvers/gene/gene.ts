import DataLoader from 'dataloader';

import { GenomicRange } from '../../types';
import { db, selectRefSeqGenes } from '../../postgres';
import { RefSeqGeneParameters, RefSeqGeneResult } from '../../postgres/types';
import { UTRResult, ExonResult, TranscriptResult, GeneResult } from './types';

function getUTRs(exonstart: number, exonend: number, cdsstart: number, cdsend: number, chromosome: string, strand: string): UTRResult[] {
    if (cdsstart < exonstart && cdsend > exonend) return [];
    if (cdsstart > exonend || cdsend < exonstart) return [{
	coordinates: {
	    chromosome,
	    start: exonstart,
	    end: exonend
	},
	strand
    }];
    let results: UTRResult[] = [];
    if (cdsstart > exonstart) results.push({
	coordinates: {
	    chromosome,
	    start: exonstart,
	    end: cdsstart
	},
	strand
    });
    if (cdsend < exonend) results.push({
	coordinates: {
	    chromosome,
	    start: cdsend,
	    end: exonend
	},
	strand
    });
    return results;
}

function processTranscript(transcript: RefSeqGeneResult): TranscriptResult {
    let exons: ExonResult[] = transcript.exonstarts.map( (start: number, i: number): ExonResult => ({
	id: transcript.name + '_' + i,
	name: transcript.name + '_' + i,
	coordinates: {
	    chromosome: transcript.chrom,
	    start,
	    end: transcript.exonends[i]
	},
	project: "RefSeq",
	score: transcript.score,
	strand: transcript.strand,
	exon_number: i + 1,
	UTRs: getUTRs(start, transcript.exonends[i], transcript.cdsstart, transcript.cdsend, transcript.chrom, transcript.strand)
    }));
    return {
	id: transcript.name,
	name: transcript.name2,
	coordinates: {
	    chromosome: transcript.chrom,
	    start: transcript.txstart,
	    end: transcript.txend
	},
	project: "RefSeq",
	score: transcript.score,
	strand: transcript.strand,
	exons
    };
}

async function refSeqGeneQuery(obj: any, parameters: RefSeqGeneParameters | any): Promise<GeneResult[]> {
    const results: RefSeqGeneResult[] = await selectRefSeqGenes(parameters.assembly, parameters, db);
    return refSeqGeneQueryGeneric(results);
}

async function refSeqXenoGeneQuery(obj: any, parameters: RefSeqGeneParameters | any): Promise<GeneResult[]> {
    const results: RefSeqGeneResult[] = await selectRefSeqGenes(parameters.assembly, parameters, db, true);
    return refSeqGeneQueryGeneric(results);
}

function refSeqGeneQueryGeneric(results: RefSeqGeneResult[]): GeneResult[] {
    const genes: { [id: string]: GeneResult } = {};
    results.forEach( (result: RefSeqGeneResult): void => {
	if (genes[result.name] === undefined)
	    genes[result.name] = { id: result.name2, transcripts: [], strand: result.strand };
	genes[result.name].transcripts.push(processTranscript(result));
    });
    return Object.keys(genes).map( (key: string): GeneResult => genes[key] );
}

export const geneResolvers = {
    Query: {
	refseqgenes: refSeqGeneQuery,
	refseqxenogenes: refSeqXenoGeneQuery
    }
};
