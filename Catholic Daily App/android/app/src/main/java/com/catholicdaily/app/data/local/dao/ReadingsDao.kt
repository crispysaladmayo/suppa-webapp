package com.catholicdaily.app.data.local.dao

import androidx.room.Dao
import androidx.room.Query
import com.catholicdaily.app.data.local.entity.ReadingBlockEntity
import com.catholicdaily.app.data.local.entity.ReadingsBundleEntity
import com.catholicdaily.app.data.local.entity.ReadingsDayEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ReadingsDao {
    @Query("SELECT * FROM readings_bundle ORDER BY id DESC LIMIT 1")
    fun observeLatestBundle(): Flow<ReadingsBundleEntity?>

    @Query("SELECT * FROM readings_day WHERE liturgical_date = :liturgicalDate AND bundle_id = :bundleId LIMIT 1")
    suspend fun getDayForBundle(liturgicalDate: String, bundleId: Long): ReadingsDayEntity?

    @Query(
        "SELECT * FROM readings_day WHERE bundle_id = :bundleId AND liturgical_date <= :liturgicalDate " +
            "ORDER BY liturgical_date DESC LIMIT 1",
    )
    suspend fun getNearestDayOnOrBefore(liturgicalDate: String, bundleId: Long): ReadingsDayEntity?

    @Query("SELECT * FROM readings_day WHERE bundle_id = :bundleId ORDER BY liturgical_date DESC LIMIT 1")
    suspend fun getLatestDayForBundle(bundleId: Long): ReadingsDayEntity?

    @Query("SELECT * FROM reading_block WHERE readings_day_id = :dayId ORDER BY sort_order ASC")
    suspend fun blocksForDay(dayId: Long): List<ReadingBlockEntity>
}
