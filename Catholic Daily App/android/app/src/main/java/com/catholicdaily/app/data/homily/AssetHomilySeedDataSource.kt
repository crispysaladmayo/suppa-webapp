package com.catholicdaily.app.data.homily

import android.content.Context
import android.util.Log
import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity
import com.catholicdaily.app.data.remote.HomilyLatestJsonDto
import com.catholicdaily.app.data.remote.toEntity
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okio.buffer
import okio.source

class AssetHomilySeedDataSource(
    private val context: Context,
    private val assetFileName: String = "homily_latest.seed.json",
) : HomilyDataSource {

    private val adapter =
        Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()
            .adapter(HomilyLatestJsonDto::class.java)

    override suspend fun fetchLatest(): HomilyDocumentEntity? =
        withContext(Dispatchers.IO) {
            runCatching {
                context.assets.open(assetFileName).use { input ->
                    val dto = adapter.fromJson(input.source().buffer())
                    dto?.toEntity()
                }
            }.onFailure {
                Log.w(TAG, "Failed to load homily seed asset: $assetFileName", it)
            }.getOrNull()
        }

    companion object {
        private const val TAG = "AssetHomilySeedSource"
    }
}
