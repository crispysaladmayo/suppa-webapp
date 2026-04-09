package com.catholicdaily.app.data.repository

import com.catholicdaily.app.data.model.HomeDailyContent
import kotlinx.coroutines.flow.Flow

interface ContentRepository {
    fun observeHome(liturgicalDate: String): Flow<HomeDailyContent>

    suspend fun refreshHomilyIfNeeded()

    suspend fun refreshEditorial(liturgicalDate: String)
}
