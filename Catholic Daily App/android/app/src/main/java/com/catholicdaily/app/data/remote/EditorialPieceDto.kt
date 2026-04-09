package com.catholicdaily.app.data.remote

import com.catholicdaily.app.data.local.entity.EditorialPieceEntity
import com.squareup.moshi.Json

data class EditorialPieceDto(
    @Json(name = "liturgical_date") val liturgicalDate: String,
    @Json(name = "title") val title: String?,
    @Json(name = "body") val body: String,
    @Json(name = "byline") val byline: String,
    @Json(name = "language") val language: String = "id",
    @Json(name = "ai_assisted") val aiAssisted: Boolean = false,
    @Json(name = "human_reviewed") val humanReviewed: Boolean = false,
    @Json(name = "published_at") val publishedAt: String,
    @Json(name = "source_attribution") val sourceAttribution: String?,
    @Json(name = "external_id") val externalId: String?,
)

fun EditorialPieceDto.toEntity(): EditorialPieceEntity =
    EditorialPieceEntity(
        id = 0L,
        externalId = externalId,
        liturgicalDate = liturgicalDate,
        title = title,
        body = body,
        byline = byline,
        language = language,
        aiAssisted = aiAssisted,
        humanReviewed = humanReviewed,
        publishedAt = publishedAt,
        sourceAttribution = sourceAttribution,
        contentSha256 = null,
    )
