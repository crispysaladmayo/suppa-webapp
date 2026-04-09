package com.catholicdaily.app.data.remote

import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity
import com.squareup.moshi.Json
import java.time.Instant

private val AllowedRightsModes = setOf("FULL", "EXCERPT", "LINK_ONLY")

data class HomilyLatestJsonDto(
    @Json(name = "homily_date") val homilyDate: String,
    @Json(name = "title") val title: String?,
    @Json(name = "body") val body: String?,
    @Json(name = "language") val language: String,
    @Json(name = "rights_mode") val rightsMode: String,
    @Json(name = "source_url") val sourceUrl: String,
    @Json(name = "source_name") val sourceName: String?,
    @Json(name = "external_id") val externalId: String?,
)

fun HomilyLatestJsonDto.toEntity(fetchedAt: Instant = Instant.now()): HomilyDocumentEntity {
    val mode = rightsMode.uppercase()
    val safeMode = if (mode in AllowedRightsModes) mode else "LINK_ONLY"
    return HomilyDocumentEntity(
        id = 0L,
        externalId = externalId,
        homilyDate = homilyDate,
        title = title,
        language = language,
        body = body,
        rightsMode = safeMode,
        sourceUrl = sourceUrl,
        sourceName = sourceName,
        fetchedAt = fetchedAt.toString(),
        contentSha256 = null,
        isLatest = false,
    )
}
