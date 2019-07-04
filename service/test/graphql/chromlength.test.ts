import request, { Response } from 'supertest';
import app from '../../src/app';

const query = `
  query ChromLengths($chromosome: String, $maxLength: Int, $minLength: Int, $assembly: String!) {
    chromlengths(chromosome: $chromosome, maxLength: $maxLength, minLength: $minLength, assembly: $assembly) {
        chromosome,
        length
    }
  }
`;

describe("chromosome lengths query", () => {

    test("should return chr1 from hg38", async () => {
	const variables = {
	    assembly: "hg38",
	    chromosome: "chr1"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.chromlengths.length).toBe(1);
	expect(response.body.data.chromlengths).toContainEqual({
	    chromosome: "chr1",
	    length: 248_956_422
	});
    });

    test("should return chr1 from hg38", async () => {
	const variables = {
	    assembly: "hg38",
	    minLength: 248956422
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.chromlengths.length).toBe(1);
	expect(response.body.data.chromlengths).toContainEqual({
	    chromosome: "chr1",
	    length: 248_956_422
	});
    });

    test("should return chr1 from hg38", async () => {
	const variables = {
	    assembly: "hg38",
	    maxLength: 248956421
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.chromlengths.length).toBe(594);
	expect(response.body.data.chromlengths).not.toContainEqual({
	    chromosome: "chr1",
	    length: 248_956_422
	});
    });

});
