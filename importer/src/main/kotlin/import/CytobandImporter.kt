package import

import Importer
import util.*
import mu.KotlinLogging
import java.io.Closeable
import javax.sql.DataSource
import java.io.InputStream

private val log = KotlinLogging.logger {}

class CytobandImporter(private val sources: List<CytobandSource>) : Importer {

    override fun import(dataSource: DataSource) {

	for (source in sources) {
	    val assembly = source.assembly()
	    val replacements = mapOf("\$ASSEMBLY" to assembly)
            executeSqlResource(dataSource, "schemas/cytoband.sql", replacements)
            CytobandSink(dataSource, assembly).use { sink ->
	        log.info { "Running cytoband schema for $assembly..." }
                source.import(sink)
            }
	}
	
    }
}

interface CytobandSource {
    fun assembly(): String
    fun import(sink: CytobandSink)
}

private fun cytobandsTableDef(assembly: String): String =
    "cytobands_$assembly(chromosome, startcoordinate, endcoordinate, bandname, stain)"

class CytobandSink(dataSource: DataSource, assembly: String): Closeable {

    private val cytobandOut = CopyStreamWriter(dataSource, cytobandsTableDef(assembly))
    private val tabledef = cytobandsTableDef(assembly)

    fun write(cytoband: InputStream) {
	cytobandOut.write(cytoband)
    }

    override fun close() {
        cytobandOut.close()
    }
    
}
