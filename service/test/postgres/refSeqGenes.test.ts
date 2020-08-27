import { db, selectRefSeqGenes, RefSeqGeneParameters } from '../../src/postgres';

describe("ref seq gene queries", () => {

    test("should select 7 genes from scaffold_1652", async () => {
	const parameters: RefSeqGeneParameters = {
	    chromosome: "scaffold_1652",
	    assembly: "aplCal1"
	};
	const results = await selectRefSeqGenes("aplCal1", parameters, db);
	expect(results.length).toBe(7);
    });

    test("should select 1 gene from scaffold_1652", async () => {
	const parameters: RefSeqGeneParameters = {
	    coordinates: {
		chromosome: "scaffold_1652",
		start: 34632,
		end: 34633
	    },
	    assembly: "aplCal1"
	};
	const results = await selectRefSeqGenes("aplCal1", parameters, db);
	expect(results.length).toBe(1);
	expect(results).toContainEqual({
	    bin: 585,
	    cdsstart: 34632,
	    cdsend: 36540,
	    cdsendstat: "incmpl",
	    cdsstartstat: "incmpl",
	    chrom: "scaffold_1652",
	    exoncount: 5,
	    exonends: [34863, 35195, 35467, 36154, 36540],
	    exonframes: [0, 0, 2, 1, 1],
	    exonstarts: [34632, 35076, 35447, 35992, 36322],
	    name: "NM_001317114",
	    name2: "ZNF331",
	    score: 0,
	    strand: "+",
	    txend: 36540,
	    txstart: 34632
	});
    });

    test("should select two genes named ZNF331", async () => {
	const parameters: RefSeqGeneParameters = {
	    assembly: "aplCal1",
	    searchTerm: "ZNF331"
	};
	const results = await selectRefSeqGenes("aplCal1", parameters, db);
	expect(results.length).toBe(2);
	expect(results).toContainEqual({
	    bin: 585,
	    cdsend: 36540,
	    cdsstart: 34632,
	    cdsendstat: "incmpl",
	    cdsstartstat: "incmpl",
	    chrom: "scaffold_1652",
	    exoncount: 5,
	    exonends: [34863, 35195, 35467, 36154, 36540],
	    exonframes: [0, 0, 2, 1, 1],
	    exonstarts: [34632, 35076, 35447, 35992, 36322],
	    name: "NM_001317114",
	    name2: "ZNF331",
	    score: 0,
	    strand: "+",
	    txend: 36540,
	    txstart: 34632
	});
    });

});
