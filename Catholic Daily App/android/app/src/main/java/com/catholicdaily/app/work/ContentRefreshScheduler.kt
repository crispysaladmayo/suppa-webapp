package com.catholicdaily.app.work

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

object ContentRefreshScheduler {

    private const val UNIQUE_NAME = "catholic-daily-content-refresh"

    fun schedule(context: Context) {
        val constraints =
            Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()
        val request =
            PeriodicWorkRequestBuilder<ContentRefreshWorker>(12, TimeUnit.HOURS)
                .setConstraints(constraints)
                .build()
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            UNIQUE_NAME,
            ExistingPeriodicWorkPolicy.KEEP,
            request,
        )
    }
}
