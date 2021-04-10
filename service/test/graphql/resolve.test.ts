import request, { Response } from 'supertest';
import app from '../../src/app';

const query = `
  query Resolve($id: String!, $assembly: String!) {
    resolve(id: $id, assembly: $assembly) {
	  id
	}
	suggest(id: $id, assembly: $assembly) {
	  id
	}
  }
`;

describe("resolve query", () => {

    test("should return chr1 from hg38", async () => {
		const variables = {
			id: "chr1:1000000-1500000",
			assembly: "hg38"
		};
		const response: Response = await request(app).post("/graphql").send({ query, variables });
		expect(response.status).toBe(200);
		expect(response.body.data.resolve.length).toBe(1);
		expect(response.body.data.resolve).toContainEqual({
			id: "chr1:1000000-1500000"
		});
		expect(response.body.data.suggest).toContainEqual({
			id: "chr1:1000000-1500000"
		});
    });

	test("should return chr1 from hg38", async () => {
		const variables = {
			id: "chr1:1000000-",
			assembly: "hg38"
		};
		const response: Response = await request(app).post("/graphql").send({ query, variables });
		expect(response.status).toBe(200);
		expect(response.body.data.suggest).toContainEqual({
			id: "chr1:1000000-2000000"
		});
    });

	test("should not resolve a coordinate out of range on chr1 from hg38", async () => {
		const variables = {
			id: "chr1:1000000000-2000000000",
			assembly: "hg38"
		};
		const response: Response = await request(app).post("/graphql").send({ query, variables });
		expect(response.status).toBe(200);
		expect(response.body.data.resolve.length).toBe(0);
		expect(response.body.data.suggest.length).toBe(0);
    });

});
