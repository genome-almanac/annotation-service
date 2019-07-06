import request, { Response } from 'supertest';
import app from '../../src/app';

const query = `
  query RefSeqGenes($assembly: String!, $chromosome: String, $coordinates: GenomicRangeInput, $searchTerm: String) {
    refseqgenes(assembly: $assembly, chromosome: $chromosome, coordinates: $coordinates, searchTerm: $searchTerm) {
      id,
      transcripts {
        name,
        exons {
          exon_number,
          UTRs {
            coordinates {
              chromosome,
              start, 
              end
            }
          }
        }
      }
    }
  }
`;

describe("RefSeq gene query", () => {

    test("should return 7 genes for scaffold 1652", async () => {
	const variables = {
	    assembly: "aplCal1",
	    chromosome: "scaffold_1652"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.refseqgenes.length).toBe(6);
    });

    test("should return 1 transcript from scaffold 1652", async () => {
	const variables = {
	    assembly: "aplCal1",
	    coordinates: {
		chromosome: "scaffold_1652",
		start: 34632,
		end: 34633
	    }
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.refseqgenes.length).toBe(1);
	expect(response.body.data.refseqgenes[0].transcripts.length).toBe(1);
    });

    test("should return 1 gene matching ZNF331", async () => {
	const variables = {
	    assembly: "aplCal1",
	    searchTerm: "ZNF331"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.refseqgenes).toEqual([
            {
		"id": "ZNF331",
		"transcripts":  [
		    {
			"exons":  [
			    {
				"UTRs":  [],
				"exon_number": 1,
			    },
			    {
				"UTRs":  [],
				"exon_number": 2,
			    },
			    {
				"UTRs":  [],
				"exon_number": 3,
			    },
			    {
				"UTRs":  [],
				"exon_number": 4,
			    },
			    {
				"UTRs":  [],
				"exon_number": 5,
			    },
			],
			"name": "ZNF331",
		    },
		    {
			"exons":  [
			    {
				"UTRs":  [],
				"exon_number": 1,
			    },
			    {
				"UTRs":  [],
				"exon_number": 2,
			    },
			],
			"name": "ZNF331",
		    },
		],
	    },
	]);
    });

});
