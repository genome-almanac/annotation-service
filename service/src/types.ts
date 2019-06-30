export interface GenomicRange {
    chromosome?: string;
    start: number;
    end: number;
};

export interface CytobandInputParameters {
    chromosome?: string;
    bandname?: string;
    start?: number;
    end?: number;
    stain?: string;
    assembly: string;
    offset?: number;
    limit?: number;
};

export interface Cytoband {
    chromosome: string;
    start: number;
    end: number;
    bandname: string;
    stain: string;
};
