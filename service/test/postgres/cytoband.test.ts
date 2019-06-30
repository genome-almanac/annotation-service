import { db, selectCytobands, CytobandParameters } from '../../src/postgres';

describe("cytoband queries", () => {

    test("should select one cytoband from chr1", async () => {
	const parameters: CytobandParameters = {
	    chromosome: "chr1",
	    coordinates: {
		start: 60000,
		end: 70000
	    }
	};
	const results = await selectCytobands("hg38", parameters, db);
	expect(results.length).toBe(1);
	expect(results).toContainEqual({
	    bandname: "p36.33",
	    chromosome: "chr1",
	    stain: "gneg",
	    start: 0,
	    stop: 2300000
	});
    });

    test("should select two cytobands from chr1", async () => {
	const parameters: CytobandParameters = {
	    chromosome: "chr1",
	    coordinates: {
		start: 60000,
		end: 5_000_000
	    }
	};
	const results = await selectCytobands("hg38", parameters, db);
	expect(results.length).toBe(2);
	expect(results).toContainEqual({
            chromosome: "chr1",
            start: 2300000,
            stop: 5300000,
            bandname: "p36.32",
            stain: "gpos25"
        });
	expect(results).toContainEqual({
	    chromosome: "chr1",
            start: 0,
            stop: 2300000,
            bandname: "p36.33",
            stain: "gneg"
	});
    });

    test("should select one cytoband from chr1", async () => {
	const parameters: CytobandParameters = {
	    chromosome: "chr1",
	    limit: 1,
	    offset: 1
	};
	const results = await selectCytobands("hg38", parameters, db);
	expect(results.length).toBe(1);
	expect(results).toContainEqual({
	    chromosome: "chr1",
	    start: 120400000,
	    stop: 121700000,
	    bandname: "p11.2",
	    stain: "gneg"
	});
    });

    test("should select one cytoband by name", async () => {
	const parameters: CytobandParameters = {
	    bandname: [ "p36.32" ]
	};
	const results = await selectCytobands("hg38", parameters, db);
	expect(results.length).toBe(1);
	expect(results).toContainEqual({
            chromosome: "chr1",
            start: 2300000,
            stop: 5300000,
            bandname: "p36.32",
            stain: "gpos25"
        });
    });

    test("should select cytobands by stain", async () => {
	const parameters: CytobandParameters = {
	    stain: [ "gpos25" ]
	};
	const results = await selectCytobands("hg38", parameters, db);
	expect(results.length).toBe(87);
    });

    test("should select cytobands from chr3", async () => {
	const parameters: CytobandParameters = {
	    chromosome: "chr3"
	};
	const results = await selectCytobands("hg38", parameters, db);
	expect(results.length).toBe(62);
    });

    test("should select 10 cytobands from chr3", async () => {
	const parameters: CytobandParameters = {
	    chromosome: "chr3",
	    limit: 10
	};
	const results = await selectCytobands("hg38", parameters, db);
	expect(results.length).toBe(10);
    });

});
