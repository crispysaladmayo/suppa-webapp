package com.catholicdaily.app.work

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.catholicdaily.app.CatholicDailyApplication
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ContentRefreshWorker(
    context: Context,
    params: WorkerParameters,
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result =
        withContext(Dispatchers.IO) {
            val app = applicationContext as? CatholicDailyApplication ?: return@withContext Result.failure()
            return@withContext try {
                app.contentRepository.refreshHomilyIfNeeded()
                app.contentRepository.refreshEditorial(app.liturgicalDateResolver.todayLiturgicalDate())
                Result.success()
            } catch (_: Exception) {
                Result.retry()
            }
        }
}
