import { db, selectChromLengths, ChromLengthParameters } from '../../src/postgres';

describe("chrom length queries", () => {

    test("should select chr1 length", async () => {
	const parameters: ChromLengthParameters = {
	    chromosome: "chr1",
	    assembly: "hg38"
	};
	const results = await selectChromLengths("hg38", parameters, db);
	expect(results.length).toBe(1);
	expect(results).toContainEqual({
	    chromosome: "chr1",
	    length: 248_956_422
	});
    });

    test("should select one chromosome with min length 248956422", async () => {
	const parameters: ChromLengthParameters = {
	    minLength: 248956422,
	    assembly: "hg38"
	};
	const results = await selectChromLengths("hg38", parameters, db);
	expect(results.length).toBe(1);
	expect(results).toContainEqual({
	    chromosome: "chr1",
	    length: 248_956_422
	});
    });

    test("should select all but chr1", async () => {
	const parameters: ChromLengthParameters = {
	    maxLength: 248956421,
	    assembly: "hg38"
	};
	const results = await selectChromLengths("hg38", parameters, db);
	expect(results.length).toBe(594);
	expect(results).not.toContainEqual({
	    chromosome: "chr1",
	    length: 248_956_422
	});
    });

});
