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

class UCSCRefSeqGeneHttpSource(private val assembly_: String,
                           private val ignoreMissing: Boolean = false,
                           private val ucscBaseUrl: String = UCSC_BASE_URL) : RefSeqGeneSource {

    override fun assembly(): String {
        return assembly_
    }

    override fun import(sink: RefSeqGeneSink) {
        if (!ignoreMissing) {
            val refSeqGene = GZIPInputStream(requestUCSCRefSeqGenes(ucscBaseUrl, assembly_))
	    writeRefSeqGenesToDb(refSeqGene, sink)
        } else {
            try {
                val refSeqGene = GZIPInputStream(requestUCSCRefSeqGenes(ucscBaseUrl, assembly_))
	        writeRefSeqGenesToDb(refSeqGene, sink)
	    } catch (e: Exception) {}
	}
    }
    
}

class UCSCXenoRefSeqGeneHttpSource(private val assembly_: String,
                                   private val ignoreMissing: Boolean = false,
                                   private val ucscBaseUrl: String = UCSC_BASE_URL) : RefSeqGeneSource {

    override fun assembly(): String {
        return assembly_
    }

    override fun import(sink: RefSeqGeneSink) {
        if (!ignoreMissing) {
            val refSeqGene = GZIPInputStream(requestUCSCXenoRefSeqGenes(ucscBaseUrl, assembly_))
	    writeRefSeqGenesToDb(refSeqGene, sink)
        } else {
            try {
                val refSeqGene = GZIPInputStream(requestUCSCXenoRefSeqGenes(ucscBaseUrl, assembly_))
	        writeRefSeqGenesToDb(refSeqGene, sink)
	    } catch (e: Exception) {}
	}
    }
    
}

class RefSeqGeneFileSource(private val assembly_: String,
                           private val inputFile: File) : RefSeqGeneSource {

    override fun assembly(): String {
        return assembly_
    }

    override fun import(sink: RefSeqGeneSink) {
        val refSeqGene = GZIPInputStream(FileInputStream(inputFile))
	writeRefSeqGenesToDb(refSeqGene, sink)
    }
    
}

private fun writeRefSeqGenesToDb(refSeqGene: InputStream, sink: RefSeqGeneSink) {
    sink.write(refSeqGene)
}
