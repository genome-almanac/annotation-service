package util

import org.jsoup.*
import org.jsoup.nodes.*
import java.io.File

fun shortName(name: String): String {
    var tsplit = "/"
    if (!name.contains("/")) {
        if (!name.contains("(")) return name
	tsplit = "("
    }
    val nsplit = name.split(tsplit).last()
    if (!nsplit.contains(")")) return nsplit
    return nsplit.split(")")[0].replace(" ", "_")
}

fun parseUcscFile(input: File): Map<String, List<Map<String, String>>> {
    return parseUcsc(Jsoup.parse(input, "UTF-8", ""))
}

fun parseUcscList(url: String): Map<String, List<Map<String, String>>> {
    val doc = Jsoup.connect(url).timeout(30000).get()
    return parseUcsc(doc)
}

fun parseUcsc(doc: Document): Map<String, List<Map<String, String>>> {

    var currentspecies: String = ""
    var currentassembly = ""
    var retval: MutableMap<String, MutableList<Map<String, String>>> = mutableMapOf();

    doc.select(".gbsPage:first-of-type *").forEach {
        val tagName = it.tagName()
        if (tagName === "h2") {
	    currentspecies = it.text().replace(" genome", "")
	    retval.set(currentspecies, mutableListOf())
	}
	if (tagName === "h3") currentassembly = it.text()
	if (tagName === "a" && it.text().equals("Annotation database")) {
            retval[currentspecies]!!.add(mapOf(
	        "description" to currentassembly,
		"name" to shortName(currentassembly),
		"url" to it.attr("href")
            ))
        }
    }

    return retval

}
