package com.catholicdaily.app.data.repository

import android.app.Application
import android.util.Log
import androidx.room.withTransaction
import com.catholicdaily.app.data.homily.HomilyDataSource
import com.catholicdaily.app.data.local.CatholicDatabase
import com.catholicdaily.app.data.model.HomeDailyContent
import com.catholicdaily.app.data.model.ReadingsDayContent
import com.catholicdaily.app.data.remote.EditorialPieceDto
import com.catholicdaily.app.data.remote.toEntity
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import okio.buffer
import okio.source

class DefaultContentRepository(
    private val database: CatholicDatabase,
    private val okHttpClient: OkHttpClient,
    private val application: Application,
    editorialBaseUrl: String,
    private val homilyDataSource: HomilyDataSource,
) : ContentRepository {

    private val editorialBaseUrl = editorialBaseUrl.trimEnd('/')
    private val moshi: Moshi =
        Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()
    private val editorialAdapter = moshi.adapter(EditorialPieceDto::class.java)

    private val readingsDao = database.readingsDao()
    private val homilyDao = database.homilyDao()
    private val editorialDao = database.editorialDao()

    override fun observeHome(liturgicalDate: String): Flow<HomeDailyContent> {
        val readingsFlow =
            readingsDao.observeLatestBundle().flatMapLatest { bundle ->
                flow {
                    if (bundle == null) {
                        emit(null)
                        return@flow
                    }
                    val day =
                        readingsDao.getDayForBundle(liturgicalDate, bundle.id)
                            ?: readingsDao.getNearestDayOnOrBefore(liturgicalDate, bundle.id)
                            ?: readingsDao.getLatestDayForBundle(bundle.id)
                    if (day == null) {
                        Log.w(TAG, "No readings_day rows available in imported bundle")
                        emit(null)
                        return@flow
                    }
                    if (day.liturgicalDate != liturgicalDate) {
                        Log.i(
                            TAG,
                            "Readings fallback used: requested=$liturgicalDate resolved=${day.liturgicalDate}",
                        )
                    }
                    val blocks = readingsDao.blocksForDay(day.id)
                    emit(
                        ReadingsDayContent(
                            liturgicalDate = day.liturgicalDate,
                            bundleVersion = bundle.bundleVersion,
                            sourceAttribution = bundle.sourceAttribution,
                            cycleMetadata = day.cycleMetadata,
                            blocks = blocks,
                        ),
                    )
                }
            }
        return combine(
            readingsFlow,
            homilyDao.observeLatestHomily(),
            editorialDao.observeEditorial(liturgicalDate),
        ) { readings, homily, editorial ->
            HomeDailyContent(
                liturgicalDate = liturgicalDate,
                readings = readings,
                homily = homily,
                editorial = editorial,
            )
        }
    }

    override suspend fun refreshHomilyIfNeeded() {
        withContext(Dispatchers.IO) {
            val entity = homilyDataSource.fetchLatest() ?: return@withContext
            database.withTransaction {
                homilyDao.clearLatestFlags()
                homilyDao.insertHomily(entity.copy(isLatest = true))
            }
            Log.i(TAG, "Homily refreshed from configured source")
        }
    }

    override suspend fun refreshEditorial(liturgicalDate: String) {
        withContext(Dispatchers.IO) {
            if (editorialBaseUrl.isEmpty() ||
                editorialBaseUrl.contains("example.invalid", ignoreCase = true)
            ) {
                seedEditorialFromAsset(liturgicalDate)
                return@withContext
            }
            val url = "$editorialBaseUrl/editorial/$liturgicalDate.json"
            val request = Request.Builder().url(url).build()
            okHttpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    Log.w(TAG, "Editorial fetch failed (${response.code}) for $url; using seed")
                    seedEditorialFromAsset(liturgicalDate)
                    return@use
                }
                val body = response.body?.string() ?: return@use
                val dto = editorialAdapter.fromJson(body) ?: return@use
                editorialDao.insert(dto.toEntity())
                Log.i(TAG, "Editorial refreshed from remote for $liturgicalDate")
            }
        }
    }

    private suspend fun seedEditorialFromAsset(liturgicalDate: String) {
        runCatching {
            application.assets.open(EDITORIAL_SEED_FILE).use { input ->
                val dto = editorialAdapter.fromJson(input.source().buffer()) ?: return@use
                editorialDao.insert(
                    dto.toEntity().copy(
                        liturgicalDate = liturgicalDate,
                        externalId = "seed-editorial-$liturgicalDate",
                    ),
                )
                Log.i(TAG, "Editorial seeded from local asset for $liturgicalDate")
            }
        }.onFailure {
            Log.w(TAG, "Failed loading editorial seed asset", it)
        }
    }

    companion object {
        private const val TAG = "DefaultContentRepository"
        private const val EDITORIAL_SEED_FILE = "editorial.seed.json"
    }
}
