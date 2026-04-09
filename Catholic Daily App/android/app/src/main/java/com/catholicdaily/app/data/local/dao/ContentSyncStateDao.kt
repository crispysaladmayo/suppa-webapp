package com.catholicdaily.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.catholicdaily.app.data.local.entity.ContentSyncStateEntity

@Dao
interface ContentSyncStateDao {
    @Query("SELECT * FROM content_sync_state WHERE key = :key LIMIT 1")
    suspend fun get(key: String): ContentSyncStateEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: ContentSyncStateEntity)
}
