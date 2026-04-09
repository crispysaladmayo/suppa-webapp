package com.catholicdaily.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.catholicdaily.app.data.local.dao.ContentSyncStateDao
import com.catholicdaily.app.data.local.dao.EditorialDao
import com.catholicdaily.app.data.local.dao.HomilyDao
import com.catholicdaily.app.data.local.dao.ReadingsDao
import com.catholicdaily.app.data.local.entity.ContentSyncStateEntity
import com.catholicdaily.app.data.local.entity.EditorialPieceEntity
import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity
import com.catholicdaily.app.data.local.entity.ReadingBlockEntity
import com.catholicdaily.app.data.local.entity.ReadingsBundleEntity
import com.catholicdaily.app.data.local.entity.ReadingsDayEntity

@Database(
    entities = [
        ReadingsBundleEntity::class,
        ReadingsDayEntity::class,
        ReadingBlockEntity::class,
        HomilyDocumentEntity::class,
        EditorialPieceEntity::class,
        ContentSyncStateEntity::class,
    ],
    version = 1,
    exportSchema = false,
)
abstract class CatholicDatabase : RoomDatabase() {
    abstract fun readingsDao(): ReadingsDao
    abstract fun homilyDao(): HomilyDao
    abstract fun editorialDao(): EditorialDao
    abstract fun contentSyncStateDao(): ContentSyncStateDao

    companion object {
        fun create(context: Context): CatholicDatabase =
            Room.databaseBuilder(context, CatholicDatabase::class.java, "catholic.db")
                // Readings importer uses ATTACH/DETACH; WAL can fail on some OEM builds during this flow.
                .setJournalMode(RoomDatabase.JournalMode.TRUNCATE)
                .fallbackToDestructiveMigration()
                .build()
    }
}
