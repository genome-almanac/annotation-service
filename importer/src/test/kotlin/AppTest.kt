import import.*
import io.kotlintest.*
import io.kotlintest.specs.StringSpec
import okhttp3.mockwebserver.*
import okio.*
import source.*
import java.io.File
import java.io.FileInputStream
import java.sql.*

const val BASE_DB_URL = "jdbc:postgresql://localhost:5555/postgres"
const val TEST_SCHEMA = "annotationtest"
const val DB_URL = "$BASE_DB_URL?currentSchema=$TEST_SCHEMA"
const val DB_USERNAME = "postgres"

class AppTest : StringSpec() {

    override fun afterTest(description: Description, result: TestResult) {
        executeAdminUpdates("DROP SCHEMA $TEST_SCHEMA CASCADE")
    }

    init {

        "a cytoband file should import" {

            val testAnnotationFile = File(AppTest::class.java.getResource("cytoBand.hg38.txt.gz").file)
            val fileSource = CytobandFileSource("hg38", testAnnotationFile)
            val cytobandImporter = CytobandImporter(listOf(fileSource))
            runImporters(DB_URL, DB_USERNAME, dbSchema = TEST_SCHEMA, replaceSchema = true, importers = listOf(cytobandImporter))

            checkQuery("SELECT COUNT(*) FROM cytobands_hg38") { result ->
                result.next()
                result.getInt(1) shouldBe 1433
            }
            checkQuery("SELECT * FROM cytobands_hg38 WHERE chromosome = 'chr1' AND bandname = 'p36.33' LIMIT 1") { result ->
                result.next()
                result.getString("chromosome") shouldBe "chr1"
                result.getInt("startcoordinate") shouldBe 0
                result.getInt("endcoordinate") shouldBe 2300000
		result.getString("stain") shouldBe "gneg"
		result.getString("bandname") shouldBe "p36.33"
            }

        }

        "a cytoband file should import over HTTP" {

            val server = MockWebServer()
            server.start()
            val baseUrl = server.url("").toString()
            server.queueBytesFromResource("cytoBand.hg19.txt.gz")
            val cytobandSource = UCSCCytobandHttpSource("hg19", "$baseUrl")
            val cytobandImporter = CytobandImporter(listOf(cytobandSource))
            runImporters(DB_URL, DB_USERNAME, dbSchema = TEST_SCHEMA, replaceSchema = true, importers = listOf(cytobandImporter))

	    checkQuery("SELECT COUNT(*) FROM cytobands_hg19") { result ->
                result.next()
                result.getInt(1) shouldBe 862
            }
            checkQuery("SELECT * FROM cytobands_hg19 WHERE chromosome = 'chr1' AND bandname = 'p36.33' LIMIT 1") { result ->
                result.next()
                result.getString("chromosome") shouldBe "chr1"
                result.getInt("startcoordinate") shouldBe 0
                result.getInt("endcoordinate") shouldBe 2300000
		result.getString("stain") shouldBe "gneg"
		result.getString("bandname") shouldBe "p36.33"
            }

        }

    }

}

fun checkQuery(sql: String, check: (result: ResultSet) -> Unit) {
    DriverManager.getConnection(DB_URL, DB_USERNAME, null).use { conn ->
        conn.createStatement().use { stmt ->
            check(stmt.executeQuery(sql))
        }
    }
}

fun executeAdminUpdates(vararg sqlUpdates: String) {
    DriverManager.getConnection(BASE_DB_URL, DB_USERNAME, null).use { conn ->
        conn.createStatement().use { stmt ->
            for (sql in sqlUpdates) stmt.executeUpdate(sql)
        }
    }
}

fun MockWebServer.queueTextFromResource(resource: String, bodyTransform: ((String) -> String)? = null) {
    var body = AppTest::class.java.getResource(resource).readText()
    if (bodyTransform != null) body = bodyTransform(body)
    this.enqueue(MockResponse().setBody(body))
}

fun MockWebServer.queueBytesFromResource(resource: String) {
    val body = Buffer()
    body.writeAll(Okio.source(File(AppTest::class.java.getResource(resource).file)))
    this.enqueue(MockResponse().setBody(body))
}
