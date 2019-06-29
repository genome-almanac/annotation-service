CREATE TABLE IF NOT EXISTS cytobands_$ASSEMBLY (
    chromosome TEXT,
    startcoordinate INT,
    endcoordinate INT,
    bandname TEXT,
    stain TEXT,
    CONSTRAINT cytobands_constraint PRIMARY KEY(chromosome, bandname)
);
