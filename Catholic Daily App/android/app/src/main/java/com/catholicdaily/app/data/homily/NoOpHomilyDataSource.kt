package com.catholicdaily.app.data.homily

import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity

object NoOpHomilyDataSource : HomilyDataSource {
    override suspend fun fetchLatest(): HomilyDocumentEntity? = null
}
