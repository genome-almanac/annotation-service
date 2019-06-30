import request, { Response } from 'supertest';
import app from '../../src/app';

const query = `
  query Cytobands($bandname: [String], $stain: [String], $chromosome: String, $coordinates: GenomicRangeInput,
                  $limit: Int, $offset: Int, $assembly: String!) {
    cytoband(bandname: $bandname, stain: $stain, chromosome: $chromosome, coordinates: $coordinates,
             limit: $limit, offset: $offset, assembly: $assembly) {
      coordinates {
        chromosome,
        start,
        end
      },
      stain,
      bandname
    }
  }
`;

describe("cytoband query", () => {

    test("should return one cytoband by coordinates", async () => {
	const variables = {
	    coordinates: {
		chromosome: "chr1",
		start: 0,
		end: 20000
	    },
	    assembly: "hg38"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.cytoband.length).toBe(1);
	expect(response.body.data.cytoband).toContainEqual({
	    bandname: "p36.33",
	    coordinates: {
		chromosome: "chr1",
		end: 2300000,
		start: 0
	    },
	    stain: "gneg"
	});
    });

    test("should return two cytobands by coordinates", async () => {
	const variables = {
	    coordinates: {
		chromosome: "chr1",
		start: 60000,
		end: 5_000_000
	    },
	    assembly: "hg38"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.cytoband.length).toBe(2);
	expect(response.body.data.cytoband).toContainEqual({
	    coordinates: {
		chromosome: "chr1",
		start: 2300000,
		end: 5300000
	    },
            bandname: "p36.32",
            stain: "gpos25"
	});
	expect(response.body.data.cytoband).toContainEqual({
	    coordinates: {
		chromosome: "chr1",
		start: 0,
		end: 2300000
	    },
            bandname: "p36.33",
            stain: "gneg"
	});
    });

    test("should return one cytoband by name", async () => {
	const variables = {
	    bandname: [ "p36.32" ],
	    assembly: "hg38"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.cytoband.length).toBe(1);
	expect(response.body.data.cytoband).toContainEqual({
	    bandname: "p36.32",
	    coordinates: {
		chromosome: "chr1",
		start: 2300000,
		end: 5300000
	    },
	    stain: "gpos25"
	});
    });

    test("should return 62 cytobands from chr3", async () => {
	const variables = {
	    chromosome: "chr3",
	    assembly: "hg38"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.cytoband.length).toBe(62);
    });
    
    test("should return 10 cytobands from chr3", async () => {
	const variables = {
	    chromosome: "chr3",
	    assembly: "hg38",
	    limit: 10
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.cytoband.length).toBe(10);
    });

    test("should select cytobands by stain", async () => {
	const variables = {
	    stain: [ "gpos25" ],
	    assembly: "hg38"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.cytoband.length).toBe(87);
    });

    test("should select one cytoband on chr1", async () => {
	const variables = {
	    chromosome: "chr1",
	    offset: 1,
	    assembly: "hg38",
	    limit: 1
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.cytoband.length).toBe(1);
	expect(response.body.data.cytoband).toContainEqual({
	    coordinates: {
		chromosome: "chr1",
		start: 120400000,
		end: 121700000
	    },
	    bandname: "p11.2",
	    stain: "gneg"
	});
    });

});
