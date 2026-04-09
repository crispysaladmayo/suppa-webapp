package com.catholicdaily.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "editorial_piece",
    indices = [
        Index(value = ["external_id"], unique = true),
        Index(value = ["liturgical_date", "language"], unique = true),
    ],
)
data class EditorialPieceEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "external_id") val externalId: String?,
    @ColumnInfo(name = "liturgical_date") val liturgicalDate: String,
    @ColumnInfo(name = "title") val title: String?,
    @ColumnInfo(name = "body") val body: String,
    @ColumnInfo(name = "byline") val byline: String,
    @ColumnInfo(name = "language") val language: String = "id",
    @ColumnInfo(name = "ai_assisted") val aiAssisted: Boolean = false,
    @ColumnInfo(name = "human_reviewed") val humanReviewed: Boolean = false,
    @ColumnInfo(name = "published_at") val publishedAt: String,
    @ColumnInfo(name = "source_attribution") val sourceAttribution: String?,
    @ColumnInfo(name = "content_sha256") val contentSha256: String?,
)
