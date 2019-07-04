package source

import import.*
import model.*
import mu.KotlinLogging
import util.*
import java.io.File
import java.util.zip.GZIPInputStream
import java.io.InputStream
import java.io.FileInputStream

class AssemblyMapSource(private val data: Map<String, List<Map<String, String>>>) : AssemblySource {

    override fun import(sink: AssemblySink) {
        data.forEach { species, assemblies ->
	    assemblies.forEach {
	        sink.write(species, it["name"]!!, it["description"]!!)
            }
	}
    }
    
}
