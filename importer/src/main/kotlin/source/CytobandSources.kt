package source

import import.*
import model.*
import mu.KotlinLogging
import util.*
import java.io.File
import java.util.zip.GZIPInputStream
import java.io.InputStream
import java.io.FileInputStream

private val log = KotlinLogging.logger {}

class UCSCCytobandHttpSource(private val assembly_: String,
                             private val ucscBaseUrl: String = UCSC_BASE_URL) : CytobandSource {

    override fun assembly(): String {
        return assembly_
    }

    override fun import(sink: CytobandSink) {
        val cytoband = GZIPInputStream(requestUCSCCytoband(ucscBaseUrl, assembly_))
	writeCytobandsToDb(cytoband, sink)
    }
    
}

class CytobandFileSource(private val assembly_: String,
                         private val inputFile: File) : CytobandSource {

    override fun assembly(): String {
        return assembly_
    }

    override fun import(sink: CytobandSink) {
        val cytoband = GZIPInputStream(FileInputStream(inputFile))
	writeCytobandsToDb(cytoband, sink)
    }
    
}

private fun writeCytobandsToDb(cytoband: InputStream, sink: CytobandSink) {
    sink.write(cytoband)
}
