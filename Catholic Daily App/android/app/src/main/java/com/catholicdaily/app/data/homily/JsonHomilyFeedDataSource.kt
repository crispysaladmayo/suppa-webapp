package com.catholicdaily.app.data.homily

import android.util.Log
import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity
import com.catholicdaily.app.data.remote.HomilyLatestJsonDto
import com.catholicdaily.app.data.remote.toEntity
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request

/**
 * Loads a single JSON document from [feedUrl] (e.g. static `homily/latest.json` on your CDN).
 * Shape matches [HomilyLatestJsonDto]; swap for an RSS/XML implementation when your licensor provides it.
 */
class JsonHomilyFeedDataSource(
    private val okHttpClient: OkHttpClient,
    private val feedUrl: String,
) : HomilyDataSource {

    private val moshi =
        Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()
    private val adapter = moshi.adapter(HomilyLatestJsonDto::class.java)

    override suspend fun fetchLatest(): HomilyDocumentEntity? =
        withContext(Dispatchers.IO) {
            val url = feedUrl.trim()
            if (url.isEmpty() || url.contains("example.invalid", ignoreCase = true)) {
                Log.i(TAG, "Remote homily feed disabled by config")
                return@withContext null
            }
            val request = Request.Builder().url(url).build()
            okHttpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    Log.w(TAG, "Homily fetch failed (${response.code}) for $url")
                    return@use null
                }
                val body = response.body?.string() ?: return@use null
                val dto = adapter.fromJson(body) ?: return@use null
                dto.toEntity()
            }
        }

    companion object {
        private const val TAG = "JsonHomilyFeedSource"
    }
}
