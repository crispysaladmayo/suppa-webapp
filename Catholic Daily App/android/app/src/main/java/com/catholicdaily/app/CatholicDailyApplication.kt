package com.catholicdaily.app

import android.app.Application
import android.util.Log
import com.catholicdaily.app.data.calendar.DefaultLiturgicalDateResolver
import com.catholicdaily.app.data.calendar.LiturgicalDateResolver
import com.catholicdaily.app.data.homily.AssetHomilySeedDataSource
import com.catholicdaily.app.data.homily.JsonHomilyFeedDataSource
import com.catholicdaily.app.data.importer.ReadingsBundleImporter
import com.catholicdaily.app.data.local.CatholicDatabase
import com.catholicdaily.app.data.repository.ContentRepository
import com.catholicdaily.app.data.repository.DefaultContentRepository
import com.catholicdaily.app.work.ContentRefreshScheduler
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient

class CatholicDailyApplication : Application() {

    private val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    lateinit var database: CatholicDatabase
        private set

    lateinit var contentRepository: ContentRepository
        private set

    val liturgicalDateResolver: LiturgicalDateResolver = DefaultLiturgicalDateResolver()

    override fun onCreate() {
        super.onCreate()
        database = CatholicDatabase.create(this)
        val okHttp = OkHttpClient()
        val homilyUrl = BuildConfig.HOMILY_FEED_URL.trim()
        val hasConfiguredHomilyRemote =
            homilyUrl.isNotEmpty() &&
                !homilyUrl.contains("example.invalid", ignoreCase = true)
        val homilySource =
            if (hasConfiguredHomilyRemote) {
                Log.i(TAG, "Homily source: remote JSON feed")
                JsonHomilyFeedDataSource(okHttp, homilyUrl)
            } else {
                Log.i(TAG, "Homily source: local seed asset (URL missing/placeholder)")
                AssetHomilySeedDataSource(this)
            }

        contentRepository =
            DefaultContentRepository(
                database = database,
                okHttpClient = okHttp,
                application = this,
                editorialBaseUrl = BuildConfig.EDITORIAL_BASE_URL,
                homilyDataSource = homilySource,
            )

        applicationScope.launch {
            val liturgicalDate = liturgicalDateResolver.todayLiturgicalDate()
            runCatching {
                ReadingsBundleImporter(database).importFromAssetsIfPresent(this@CatholicDailyApplication)
                Log.i(TAG, "Readings bundle import attempted from assets/readings_bundle.db")
                contentRepository.refreshHomilyIfNeeded()
                contentRepository.refreshEditorial(liturgicalDate)
                Log.i(TAG, "Initial content refresh completed for $liturgicalDate")
            }.onFailure {
                Log.w(TAG, "Initial content refresh failed", it)
            }
        }

        ContentRefreshScheduler.schedule(this)
    }

    companion object {
        private const val TAG = "CatholicDailyApplication"
    }
}
