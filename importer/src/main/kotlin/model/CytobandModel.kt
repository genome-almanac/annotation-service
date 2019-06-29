package model

/*
 * Cytoband Model
 */
data class Cytoband(
        val chromosome: String,
	val start: Int,
	val end: Int,
	val name: String,
	val stain: String
)
