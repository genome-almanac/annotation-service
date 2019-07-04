package import

import Importer
import util.*
import mu.KotlinLogging
import java.io.Closeable
import javax.sql.DataSource
import java.io.InputStream

private val log = KotlinLogging.logger {}

class AssemblyImporter(private val sources: List<AssemblySource>) : Importer {

    override fun import(dataSource: DataSource) {

        executeSqlResource(dataSource, "schemas/assemblies.sql")
	for (source in sources) {
            AssemblySink(dataSource).use { sink ->
                source.import(sink)
            }
	}
	
    }
}

interface AssemblySource {
    fun import(sink: AssemblySink)
}

val assembliesTableDef = "assemblies(species, name, description)"

class AssemblySink(dataSource: DataSource): Closeable {

    private val assemblyOut = CopyValueWriter(dataSource, assembliesTableDef)

    fun write(species: String, name: String, description: String) {
	assemblyOut.write(species, name, description)
    }

    override fun close() {
        assemblyOut.close()
    }
    
}
