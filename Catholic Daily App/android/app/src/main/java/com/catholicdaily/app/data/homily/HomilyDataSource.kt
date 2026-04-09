package com.catholicdaily.app.data.homily

import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity

/** Fetches the latest homily document from an **allowed** channel (JSON, RSS later, etc.). */
fun interface HomilyDataSource {
    suspend fun fetchLatest(): HomilyDocumentEntity?
}
