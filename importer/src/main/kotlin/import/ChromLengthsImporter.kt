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

class ChromLengthImporter(private val sources: List<ChromLengthSource>) : Importer {

    override fun import(dataSource: DataSource) {

	for (source in sources) {
	    val assembly = source.assembly()
	    log.info { "Running chromosome length schema for $assembly..." }
	    val replacements = mapOf("\$ASSEMBLY" to assembly)
            executeSqlResource(dataSource, "schemas/chromlength.sql", replacements)
            ChromLengthSink(dataSource, assembly).use { sink ->
                source.import(sink)
            }
	}
	
    }
}

interface ChromLengthSource {
    fun assembly(): String
    fun import(sink: ChromLengthSink)
}

private fun chromLengthTableDef(assembly: String): String =
    "chrom_length_$assembly(chromosome, length)"

class ChromLengthSink(dataSource: DataSource, assembly: String): Closeable {

    private val chromLengthOut = CopyValueWriter(dataSource, chromLengthTableDef(assembly))
    private val tabledef = chromLengthTableDef(assembly)

    fun write(chromLength: InputStream) {
        val reader = BufferedReader(InputStreamReader(chromLength));
	while (reader.ready()) {
	    val line = reader.readLine().split('\t')
	    chromLengthOut.write(line[0], line[1])
	}
    }

    override fun close() {
        chromLengthOut.close()
    }
    
}
