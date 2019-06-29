import import.*
import io.kotlintest.*
import io.kotlintest.specs.StringSpec
import source.*
import java.sql.*

class PerformanceTest : StringSpec() {

    override fun afterTest(description: Description, result: TestResult) {
        executeAdminUpdates("DROP SCHEMA IF EXISTS $TEST_SCHEMA CASCADE")
    }

    init {
    
        // Add / Remove leading '!' to disable / enable. This test should not be pushed enabled.
	
        "!Run cytoband import for hg38" {
	    val importers = listOf(CytobandImporter(listOf(UCSCCytobandHttpSource("hg38"))))
            runImporters(DB_URL, DB_USERNAME, dbSchema = TEST_SCHEMA, replaceSchema = true, importers = importers)
        }

    }
}
