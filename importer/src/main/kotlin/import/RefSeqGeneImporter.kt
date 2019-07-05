package import

import Importer
import util.*
import mu.KotlinLogging
import java.io.Closeable
import javax.sql.DataSource
import java.io.InputStream
import java.io.InputStreamReader
import java.io.BufferedReader

private val log = KotlinLogging.logger {}

class RefSeqGeneImporter(private val sources: List<RefSeqGeneSource>, private val isXeno: Boolean = false) : Importer {

    override fun import(dataSource: DataSource) {

	for (source in sources) {
	    val assembly = source.assembly()
	    log.info { "Running RefSeq gene schema for $assembly..." }
	    val replacements = mapOf("\$ASSEMBLY" to assembly)
            executeSqlResource(dataSource, "schemas/refgene.sql", replacements)
            RefSeqGeneSink(dataSource, assembly, isXeno).use { sink ->
                source.import(sink)
            }
	}
	
    }
}

interface RefSeqGeneSource {
    fun assembly(): String
    fun import(sink: RefSeqGeneSink)
}

private fun refSeqGeneTableDef(assembly: String, isXeno: Boolean = false): String =
    "refseq_gene_$assembly" + (if(isXeno) "_xeno" else "") + "(bin, name, chrom, strand, txstart, txend, " +
    "cdsstart, cdsend, exoncount, exonstarts, exonends, score, " +
    "name2, cdsstartstat, cdsendstat, exonframes)";

private fun braceWrap(arrayString: String): String =
    "{" + arrayString.substring(0, arrayString.length - 1) + "}"

class RefSeqGeneSink(dataSource: DataSource, assembly: String, isXeno: Boolean = false): Closeable {

    private val refSeqGeneOut = CopyValueWriter(dataSource, refSeqGeneTableDef(assembly, isXeno))

    fun write(refSeqGenes: InputStream) {
        val reader = BufferedReader(InputStreamReader(refSeqGenes));
	while (reader.ready()) {
	    val line = reader.readLine().split('\t')
	    refSeqGeneOut.write(
	        line[0], line[1], line[2], line[3], line[4], line[5], line[6], line[7], line[8],
		braceWrap(line[9]), braceWrap(line[10]), line[11], line[12], line[13], line[14],
		braceWrap(line[15])
            )
	}
    }

    override fun close() {
        refSeqGeneOut.close()
    }
    
}
