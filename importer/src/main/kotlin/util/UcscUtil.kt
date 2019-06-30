package util

import com.squareup.moshi.Moshi
import com.squareup.moshi.adapters.Rfc3339DateJsonAdapter
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import model.*
import okhttp3.*
import java.io.File
import java.util.*
import java.util.concurrent.TimeUnit
import java.io.InputStream

const val UCSC_BASE_URL = "http://hgdownload.cse.ucsc.edu/goldenPath/"

private val http by lazy {
    OkHttpClient.Builder()
            .connectTimeout(20, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .build()
}

fun databaseUrl(ucscBaseUrl: String, assembly: String): String {
    return "$ucscBaseUrl/$assembly/database/"
}

fun requestUCSCCytoband(ucscBaseUrl: String, assembly: String): InputStream {
    val assemblyUrl = databaseUrl(ucscBaseUrl, assembly)
    val experimentUrl = HttpUrl.parse("$assemblyUrl/cytoBand.txt.gz")!!.newBuilder().build()
    val request = Request.Builder().url(experimentUrl).get().build()
    return http.newCall(request).execute().body()!!.byteStream()
}