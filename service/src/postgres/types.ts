import { GenomicRange } from '../types';

export interface CytobandParameters {
    stain?: string[];
    bandname?: string[];
    coordinates?: GenomicRange;
    chromosome?: string;
    limit?: number;
    offset?: number;
    [key: string]: any;
};

export interface CytobandResult {
    bandname: string;
    chromosome: string;
    start: number;
    stop: number;
    stain: string;
};

export interface AssemblyParameters {
    name?: string;
    species?: string;
    description?: string;
    searchTerm?: string;
    [key: string]: any;
};

export interface AssemblyResult {
    name: string;
    species: string;
    description: string;
};

export interface ChromLengthParameters {
    chromosome?: string;
    minLength?: number;
    maxLength?: number;
    assembly: string;
    [key: string]: any;
};

export interface ChromLengthResult {
    chromosome: string;
    length: number;
};
