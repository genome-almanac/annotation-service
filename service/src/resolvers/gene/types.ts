import { GenomicRange } from '../../types';

export interface GeneResult {
    id: string;
    transcripts: TranscriptResult[];
};

export interface TranscriptResult {
    id: string;
    name: string;
    coordinates: GenomicRange;
    project: string;
    score: number;
    strand: string;
    exons: ExonResult[];
};

export interface ExonResult {
    id: string;
    name: string;
    coordinates: GenomicRange;
    project: string;
    score: number;
    strand: string;
    exon_number: number;
    UTRs: UTRResult[];
};

export interface UTRResult {
    coordinates: GenomicRange;
    strand: string;
};
