package com.catholicdaily.app.data.importer

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.util.Log
import com.catholicdaily.app.data.local.CatholicDatabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

/**
 * Copies [ASSET_NAME] from app assets (project root of assets/) into a temp file, then ATTACH-imports
 * readings tables into the Room database. The asset must be a SQLite file produced by
 * `pipeline/scripts/build_readings_bundle.py` with the same schema as [sql/readings_tables.sql].
 */
class ReadingsBundleImporter(
    private val database: CatholicDatabase,
) {
    suspend fun importFromAssetsIfPresent(context: Context): Unit =
        withContext(Dispatchers.IO) {
            val root = context.assets.list("") ?: return@withContext
            if (ASSET_NAME !in root) {
                Log.w(TAG, "Readings seed asset not found: $ASSET_NAME")
                return@withContext
            }

            val tmp = File(context.cacheDir, "readings_bundle_import.db")
            context.assets.open(ASSET_NAME).use { input ->
                tmp.outputStream().use { output -> input.copyTo(output) }
            }

            val srcDb = SQLiteDatabase.openDatabase(tmp.absolutePath, null, SQLiteDatabase.OPEN_READONLY)
            val db = database.openHelper.writableDatabase
            db.beginTransaction()
            try {
                db.execSQL("DELETE FROM reading_block")
                db.execSQL("DELETE FROM readings_day")
                db.execSQL("DELETE FROM readings_bundle")

                srcDb.rawQuery(
                    "SELECT id, bundle_version, conference_code, effective_from, source_attribution, content_license_tag, sha256, installed_at FROM readings_bundle",
                    null,
                ).use { c ->
                    while (c.moveToNext()) {
                        db.execSQL(
                            "INSERT INTO readings_bundle (id, bundle_version, conference_code, effective_from, source_attribution, content_license_tag, sha256, installed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                            arrayOf(
                                c.getLong(0),
                                c.getString(1),
                                c.getString(2),
                                c.getString(3),
                                c.getString(4),
                                c.getString(5),
                                c.getString(6),
                                c.getString(7),
                            ),
                        )
                    }
                }

                srcDb.rawQuery(
                    "SELECT id, bundle_id, liturgical_date, cycle_metadata FROM readings_day",
                    null,
                ).use { c ->
                    while (c.moveToNext()) {
                        db.execSQL(
                            "INSERT INTO readings_day (id, bundle_id, liturgical_date, cycle_metadata) VALUES (?, ?, ?, ?)",
                            arrayOf(
                                c.getLong(0),
                                c.getLong(1),
                                c.getString(2),
                                c.getString(3),
                            ),
                        )
                    }
                }

                srcDb.rawQuery(
                    "SELECT id, readings_day_id, sort_order, kind, reference, title, body, source_line FROM reading_block",
                    null,
                ).use { c ->
                    while (c.moveToNext()) {
                        db.execSQL(
                            "INSERT INTO reading_block (id, readings_day_id, sort_order, kind, reference, title, body, source_line) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                            arrayOf(
                                c.getLong(0),
                                c.getLong(1),
                                c.getInt(2),
                                c.getString(3),
                                c.getString(4),
                                c.getString(5),
                                c.getString(6),
                                c.getString(7),
                            ),
                        )
                    }
                }

                db.setTransactionSuccessful()
                val bundleCount = db.query("SELECT COUNT(*) FROM readings_bundle").use { c ->
                    if (c.moveToFirst()) c.getInt(0) else 0
                }
                val dayCount = db.query("SELECT COUNT(*) FROM readings_day").use { c ->
                    if (c.moveToFirst()) c.getInt(0) else 0
                }
                val blockCount = db.query("SELECT COUNT(*) FROM reading_block").use { c ->
                    if (c.moveToFirst()) c.getInt(0) else 0
                }
                Log.i(
                    TAG,
                    "Readings seed import success: bundle=$bundleCount day=$dayCount block=$blockCount",
                )
            } catch (t: Throwable) {
                Log.w(TAG, "Readings seed import failed", t)
                throw t
            } finally {
                db.endTransaction()
                srcDb.close()
                tmp.delete()
            }
        }

    companion object {
        private const val TAG = "ReadingsBundleImporter"
        const val ASSET_NAME = "readings_bundle.db"
    }
}
