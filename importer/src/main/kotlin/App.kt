import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.*
import com.github.ajalt.clikt.parameters.types.file
import com.github.ajalt.clikt.parameters.types.int
import import.*
import source.*
import com.zaxxer.hikari.*
import javax.sql.DataSource
import java.sql.DriverManager
import mu.KotlinLogging
import util.withEnvvarSplit
import java.io.File

private val log = KotlinLogging.logger {}

fun main(args: Array<String>) = Cli().main(args)

class Cli : CliktCommand() {

    private val dbUrl by option("--db-url", envvar = "DB_URL").required()
    private val dbUsername by option("--db-username", envvar = "DB_USERNAME")
    private val dbPassword by option("--db-password", envvar = "DB_PASSWORD")
    private val dbSchema by option("--db-schema", envvar = "DB_SCHEMA")
    private val paralellism by option("--parallelism",
            envvar = "PARALLELISM",
            help = "Parallelism for requests to UCSC. Default 16.")
            .int()
            .default(16)
    private val assemblies by option("--assemblies",
            envvar = "ASSEMBLIES",
            help = "Assemblies for which to import annotations.")
            .withEnvvarSplit(Regex.fromLiteral("|"))
            .multiple()
    private val replaceSchema by option("--replace-schema", envvar = "REPLACE_SCHEMA",
            help = "Set to drop the given schema first before creating it again.")
            .flag(default = false)

    override fun run() {

        val importers = mutableListOf<Importer>()

        val cytobandSources = mutableListOf<CytobandSource>()
	for (assembly in assemblies) {
	    cytobandSources += UCSCCytobandHttpSource(assembly)
	}
	importers += CytobandImporter(cytobandSources)
	
        runImporters(dbUrl, dbUsername, dbPassword, dbSchema, replaceSchema, importers)
	
    }

}

interface Importer {
    fun import(dataSource: DataSource)
}

fun runImporters(dbUrl: String,
                 dbUsername: String? = null,
                 dbPassword: String? = null,
                 dbSchema: String? = null,
                 replaceSchema: Boolean = false,
                 importers: List<Importer>) {

    // Create the schema if it does not exist.
    DriverManager.getConnection(dbUrl, dbUsername, dbPassword).use { conn ->
        conn.createStatement().use { stmt ->
            if (replaceSchema) {
                stmt.executeUpdate("DROP SCHEMA IF EXISTS $dbSchema CASCADE")
            }
            stmt.executeUpdate("CREATE SCHEMA IF NOT EXISTS $dbSchema")
        }
    }

    val config = HikariConfig()
    config.jdbcUrl = dbUrl
    config.username = dbUsername
    config.password = dbPassword
    config.schema = dbSchema
    config.minimumIdle = 1
    config.maximumPoolSize = 100

    HikariDataSource(config).use { dataSource ->
        for (importer in importers) {
            importer.import(dataSource)
        }
    }

}
