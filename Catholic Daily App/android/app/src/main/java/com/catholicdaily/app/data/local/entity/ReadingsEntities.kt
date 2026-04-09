package com.catholicdaily.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "readings_bundle",
    indices = [Index(value = ["bundle_version"], unique = true)],
)
data class ReadingsBundleEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "bundle_version") val bundleVersion: String,
    @ColumnInfo(name = "conference_code") val conferenceCode: String = "KWI",
    @ColumnInfo(name = "effective_from") val effectiveFrom: String,
    @ColumnInfo(name = "source_attribution") val sourceAttribution: String,
    @ColumnInfo(name = "content_license_tag") val contentLicenseTag: String?,
    @ColumnInfo(name = "sha256") val sha256: String,
    @ColumnInfo(name = "installed_at") val installedAt: String,
)

@Entity(
    tableName = "readings_day",
    foreignKeys = [
        ForeignKey(
            entity = ReadingsBundleEntity::class,
            parentColumns = ["id"],
            childColumns = ["bundle_id"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [
        Index("bundle_id"),
        Index("liturgical_date"),
        Index(value = ["bundle_id", "liturgical_date"], unique = true),
    ],
)
data class ReadingsDayEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "bundle_id") val bundleId: Long,
    @ColumnInfo(name = "liturgical_date") val liturgicalDate: String,
    @ColumnInfo(name = "cycle_metadata") val cycleMetadata: String?,
)

@Entity(
    tableName = "reading_block",
    foreignKeys = [
        ForeignKey(
            entity = ReadingsDayEntity::class,
            parentColumns = ["id"],
            childColumns = ["readings_day_id"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [
        Index("readings_day_id"),
        Index(value = ["readings_day_id", "kind", "sort_order"], unique = true),
    ],
)
data class ReadingBlockEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "readings_day_id") val readingsDayId: Long,
    @ColumnInfo(name = "sort_order") val sortOrder: Int,
    @ColumnInfo(name = "kind") val kind: String,
    @ColumnInfo(name = "reference") val reference: String?,
    @ColumnInfo(name = "title") val title: String?,
    @ColumnInfo(name = "body") val body: String,
    @ColumnInfo(name = "source_line") val sourceLine: String?,
)
