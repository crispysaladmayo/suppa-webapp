package com.catholicdaily.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "homily_document",
    indices = [
        Index(value = ["external_id"], unique = true),
        Index(value = ["is_latest", "homily_date"]),
    ],
)
data class HomilyDocumentEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "external_id") val externalId: String?,
    @ColumnInfo(name = "homily_date") val homilyDate: String,
    @ColumnInfo(name = "title") val title: String?,
    @ColumnInfo(name = "language") val language: String,
    @ColumnInfo(name = "body") val body: String?,
    @ColumnInfo(name = "rights_mode") val rightsMode: String,
    @ColumnInfo(name = "source_url") val sourceUrl: String,
    @ColumnInfo(name = "source_name") val sourceName: String?,
    @ColumnInfo(name = "fetched_at") val fetchedAt: String,
    @ColumnInfo(name = "content_sha256") val contentSha256: String?,
    @ColumnInfo(name = "is_latest") val isLatest: Boolean,
)
