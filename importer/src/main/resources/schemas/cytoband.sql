CREATE TABLE IF NOT EXISTS cytobands_$ASSEMBLY (
    chromosome TEXT,
    startcoordinate INT,
    endcoordinate INT,
    bandname TEXT,
    stain TEXT,
    CONSTRAINT cytobands_$ASSEMBLY_pkey PRIMARY KEY(chromosome, bandname)
);
