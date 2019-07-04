import request, { Response } from 'supertest';
import app from '../../src/app';

const query = `
  query Assemblies($name: String, $description: String, $species: String, $searchTerm: String) {
    assemblies(name: $name, description: $description, species: $species, searchTerm: $searchTerm) {
        name,
        species,
        description
    }
  }
`;

describe("assemblies query", () => {

    test("should return one assembly for hg38", async () => {
	const variables = {
	    name: "hg38"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.assemblies.length).toBe(1);
	expect(response.body.data.assemblies).toContainEqual({
	    description: "Dec. 2013 (GRCh38/hg38)",
	    name: "hg38",
	    species: "Human"
	});
    });

    test("should return Drosophila melanogaster assemblies", async () => {
	const variables = {
	    species: "melanogaster"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.status).toBe(200);
	expect(response.body.data.assemblies).toEqual([
	    {
		name: 'dm1',
		species: 'D. melanogaster',
		description: 'Jan. 2003 (BDGP R3/dm1)'
            },
            {
		name: 'dm2',
		species: 'D. melanogaster',
		description: 'Apr. 2004 (BDGP R4/dm2)'
            },
            {
		name: 'dm3',
		species: 'D. melanogaster',
		description: 'Apr. 2006 (BDGP R5/dm3)'
            },
            {
		name: 'dm6',
		species: 'D. melanogaster',
		description: 'Aug. 2014 (BDGP Release 6 + ISO1 MT/dm6)'
            }
	]);
    });

    test("should return one Drosophila assembly", async () => {
	const variables = {
	    description: 'Aug. 2014 (BDGP Release 6 + ISO1 MT/dm6)'
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.body.data.assemblies).toEqual([
            {
		name: 'dm6',
		species: 'D. melanogaster',
		description: 'Aug. 2014 (BDGP Release 6 + ISO1 MT/dm6)'
            }
	]);
    });

    test("should return mouse and mouse lemur assemblies", async () => {
	const variables = {
	    searchTerm: "mouse"
	};
	const response: Response = await request(app).post("/graphql").send({ query, variables });
	expect(response.body.data.assemblies).toEqual([
	    {
		name: 'micMur1',
		species: 'Mouse lemur',
		description: 'Jul. 2007 (Broad/micMur1)'
            },
            {
		name: 'micMur2',
		species: 'Mouse lemur',
		description: 'May 2015 (Mouse lemur/micMur2)'
            },
            { name: 'mm1', species: 'Mouse', description: 'Nov. 2001 (mm1)' },
            {
		name: 'mm10',
		species: 'Mouse',
		description: 'Dec. 2011 (GRCm38/mm10)'
            },
            { name: 'mm2', species: 'Mouse', description: 'Feb. 2002 (mm2)' },
            { name: 'mm3', species: 'Mouse', description: 'Feb. 2003 (mm3)' },
            { name: 'mm4', species: 'Mouse', description: 'Oct. 2003 (mm4)' },
            { name: 'mm5', species: 'Mouse', description: 'May 2004 (mm5)' },
            { name: 'mm6', species: 'Mouse', description: 'Mar. 2005 (mm6)' },
            {
		name: 'mm7',
		species: 'Mouse',
		description: 'Aug. 2005 (NCBI35/mm7)'
            },
            {
		name: 'mm8',
		species: 'Mouse',
		description: 'Mar. 2006 (NCBI36/mm8)'
            },
            {
		name: 'mm9',
		species: 'Mouse',
		description: 'Jul. 2007 (NCBI37/mm9)'
            }
	]);
    });

});
