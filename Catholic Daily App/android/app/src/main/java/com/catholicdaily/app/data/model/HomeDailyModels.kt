package com.catholicdaily.app.data.model

import com.catholicdaily.app.data.local.entity.EditorialPieceEntity
import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity
import com.catholicdaily.app.data.local.entity.ReadingBlockEntity

data class ReadingsDayContent(
    val liturgicalDate: String,
    val bundleVersion: String,
    val sourceAttribution: String,
    val cycleMetadata: String? = null,
    val blocks: List<ReadingBlockEntity>,
)

data class HomeDailyContent(
    val liturgicalDate: String,
    val readings: ReadingsDayContent? = null,
    val homily: HomilyDocumentEntity? = null,
    val editorial: EditorialPieceEntity? = null,
)
