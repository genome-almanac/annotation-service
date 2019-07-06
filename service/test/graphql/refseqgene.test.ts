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
				"UTRs":  [
				    {
					"coordinates":  {
					    "chromosome": "scaffold_1652",
					    "end": 34863,
					    "start": 34632,
					},
				    },
				],
				"exon_number": 1,
			    },
			    {
				"UTRs":  [
				    {
					"coordinates":  {
					    "chromosome": "scaffold_1652",
					    "end": 35195,
					    "start": 35076,
					},
				    },
				],
				"exon_number": 2,
			    },
			    {
				"UTRs":  [
				    {
					"coordinates":  {
					    "chromosome": "scaffold_1652",
					    "end": 35467,
					    "start": 35447,
					},
				    },
				],
				"exon_number": 3,
			    },
			    {
				"UTRs":  [
				    {
					"coordinates":  {
					    "chromosome": "scaffold_1652",
					    "end": 36154,
					    "start": 35992,
					},
				    },
				],
				"exon_number": 4,
			    },
			    {
				"UTRs":  [
				    {
					"coordinates":  {
					    "chromosome": "scaffold_1652",
					    "end": 36540,
					    "start": 36322,
					},
				    },
				],
				"exon_number": 5,
			    },
			],
			"name": "ZNF331",
		    },
		    {
			"exons":  [
			    {
				"UTRs":  [
				    {
					"coordinates":  {
					    "chromosome": "scaffold_2002",
					    "end": 86899,
					    "start": 86869,
					},
				    },
				],
				"exon_number": 1,
			    },
			    {
				"UTRs":  [
				    {
					"coordinates":  {
					    "chromosome": "scaffold_2002",
					    "end": 86995,
					    "start": 86944,
					},
				    },
				],
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
