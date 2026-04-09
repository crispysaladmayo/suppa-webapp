package com.catholicdaily.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface HomilyDao {
    @Query("SELECT * FROM homily_document WHERE is_latest = 1 LIMIT 1")
    fun observeLatestHomily(): Flow<HomilyDocumentEntity?>

    @Query("UPDATE homily_document SET is_latest = 0")
    suspend fun clearLatestFlags()

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHomily(entity: HomilyDocumentEntity): Long
}
