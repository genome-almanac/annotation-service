CREATE TABLE IF NOT EXISTS refseq_gene_$ASSEMBLY (
    bin INT,
    name TEXT,
    chrom TEXT,
    strand CHAR,
    txstart INT,
    txend INT,
    cdsstart INT,
    cdsend INT,
    exoncount INT,
    exonstarts INT[],
    exonends INT[],
    score INT,
    name2 TEXT,
    cdsstartstat TEXT,
    cdsendstat TEXT,
    exonframes INT[],
    CONSTRAINT refseq_gene_$ASSEMBLY_pkey PRIMARY KEY(bin, chrom, name, name2,  txstart)
);
