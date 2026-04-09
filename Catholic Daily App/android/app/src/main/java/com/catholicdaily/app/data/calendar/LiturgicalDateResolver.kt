package com.catholicdaily.app.data.calendar

import java.time.ZoneId
import java.time.ZonedDateTime

/**
 * Resolves the **liturgical calendar date** string (YYYY-MM-DD) for loading readings + editorial.
 *
 * V1 default: **civil date** in [displayZone] (e.g. Asia/Jakarta). Replace with KWI-specific rules
 * when your calendar source is integrated.
 */
interface LiturgicalDateResolver {
    val displayZone: ZoneId

    fun todayLiturgicalDate(): String
}

class DefaultLiturgicalDateResolver(
    override val displayZone: ZoneId = ZoneId.of("Asia/Jakarta"),
) : LiturgicalDateResolver {
    override fun todayLiturgicalDate(): String =
        ZonedDateTime.now(displayZone).toLocalDate().toString()
}
