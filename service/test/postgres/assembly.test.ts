import { db, selectAssemblies, AssemblyParameters } from '../../src/postgres';

describe("cytoband queries", () => {

    test("should select assemblies matching panTro*", async () => {
	const parameters: AssemblyParameters = {
	    name: "panTro"
	};
	const results = await selectAssemblies(parameters, db);
	expect(results).toEqual([
            {
		species: 'Chimpanzee',
		name: 'panTro1',
		description: 'Nov. 2003 (CGSC 1.1/panTro1)'
            },
            {
		species: 'Chimpanzee',
		name: 'panTro2',
		description: 'Mar. 2006 (CGSC 2.1/panTro2)'
            },
            {
		species: 'Chimpanzee',
		name: 'panTro3',
		description: 'Oct. 2010 (CGSC 2.1.3/panTro3)'
            },
            {
		species: 'Chimpanzee',
		name: 'panTro4',
		description: 'Feb. 2011 (SAC 2.1.4/panTro4'
            },
            {
		species: 'Chimpanzee',
		name: 'panTro5',
		description: 'May. 2016 (Pan_tro 3.0/panTro5)'
            },
            {
		species: 'Chimpanzee',
		name: 'panTro6',
		description: 'Jan. 2018 (Clint_PTRv2/panTro6)'
            }
	]);
    });

    test("should select alpaca assemblies", async () => {
	const parameters: AssemblyParameters = {
	    species: "alpaca"
	};
	const results = await selectAssemblies(parameters, db);
	expect(results).toEqual([
            {
		description: "Jul. 2008 (Broad/vicPac1)",
		name: "vicPac1",
		species: "Alpaca"
	    },
            {
		description: "Mar. 2013 (Vicugna_pacos-2.0.1/vicPac2)",
		name: "vicPac2",
		species: "Alpaca"
	    }
	]);
    });

    test("should select one alpaca assembly", async () => {
	const parameters: AssemblyParameters = {
	    description: "Mar. 2013 (Vicugna_pacos-2.0.1/vicPac2)"
	};
	const results = await selectAssemblies(parameters, db);
	expect(results).toEqual([
	    {
		description: "Mar. 2013 (Vicugna_pacos-2.0.1/vicPac2)",
		name: "vicPac2",
		species: "Alpaca"
	    }
	]);
    });

    test("should select elephant and elephant shark assemblies", async () => {
	const parameters: AssemblyParameters = {
	    searchTerm: "elephant"
	};
	const results = await selectAssemblies(parameters, db);
	expect(results).toEqual([
	    {
		description: "Dec. 2013 (Callorhinchus_milii-6.1.3/calMil1)",
		name: "calMil1",
		species: "Elephant shark",
	    },
	    {
		description: "Jul. 2009 (Broad/loxAfr3)",
		name: "loxAfr3",
		species: "Elephant",
	    }
	]);
    });
    
});
