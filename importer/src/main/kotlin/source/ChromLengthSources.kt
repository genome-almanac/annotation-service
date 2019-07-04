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

class UCSCChromLengthHttpSource(private val assembly_: String,
                                private val ignoreMissing: Boolean = false,
                                private val ucscBaseUrl: String = UCSC_BASE_URL) : ChromLengthSource {

    override fun assembly(): String {
        return assembly_
    }

    override fun import(sink: ChromLengthSink) {
        if (!ignoreMissing) {
            val chromLength = GZIPInputStream(requestUCSCChromLengths(ucscBaseUrl, assembly_))
	    writeChromLenghtsToDb(chromLength, sink)
        } else {
            try {
                val chromLength = GZIPInputStream(requestUCSCChromLengths(ucscBaseUrl, assembly_))
	        writeChromLenghtsToDb(chromLength, sink)
	    } catch (e: Exception) {}
	}
    }
    
}

class ChromLengthFileSource(private val assembly_: String,
                            private val inputFile: File) : ChromLengthSource {

    override fun assembly(): String {
        return assembly_
    }

    override fun import(sink: ChromLengthSink) {
        val chromLength = GZIPInputStream(FileInputStream(inputFile))
	writeChromLenghtsToDb(chromLength, sink)
    }
    
}

private fun writeChromLenghtsToDb(chromLength: InputStream, sink: ChromLengthSink) {
    sink.write(chromLength)
}
