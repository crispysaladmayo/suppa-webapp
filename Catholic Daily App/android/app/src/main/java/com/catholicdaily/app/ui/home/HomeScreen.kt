package com.catholicdaily.app.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.catholicdaily.app.R
import com.catholicdaily.app.data.local.entity.EditorialPieceEntity
import com.catholicdaily.app.data.local.entity.HomilyDocumentEntity
import com.catholicdaily.app.data.local.entity.ReadingBlockEntity
import com.catholicdaily.app.data.model.HomeDailyContent
import com.catholicdaily.app.ui.theme.StreamHairlineColor
import org.json.JSONObject
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    content: HomeDailyContent,
    liturgicalZoneLabel: String,
    onRefresh: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val uriHandler = LocalUriHandler.current
    val fallbackLiturgyTitle = stringResource(R.string.home_liturgy_name_placeholder)
    var showAboutSheet by rememberSaveable { mutableStateOf(false) }
    var showProfileSheet by rememberSaveable { mutableStateOf(false) }
    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            HomeHeader(
                liturgicalDayName = resolveLiturgicalDayName(content, fallbackLiturgyTitle),
                liturgicalZoneLabel = liturgicalZoneLabel,
                liturgicalDate = content.liturgicalDate,
                onOpenAbout = { showAboutSheet = true },
                onOpenProfile = { showProfileSheet = true },
            )
        },
    ) { inner ->
        LazyColumn(
            Modifier
                .padding(inner)
                .fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 16.dp),
        ) {
            val readings = content.readings
            if (readings == null) {
                item {
                    EmptySection(
                        title = stringResource(R.string.section_readings),
                        message = stringResource(R.string.readings_empty),
                    )
                }
            } else {
                itemsIndexed(readings.blocks) { index, block ->
                    ReadingBlockItem(
                        block = block,
                        showTopDivider = index > 0,
                    )
                }
            }

            item {
                InjilToHomilyThreshold()
                HomilySection(
                    homily = content.homily,
                    onOpenSource = { url -> uriHandler.openUri(url) },
                )
            }

            item {
                StreamDivider(top = 18.dp, bottom = 18.dp)
                RenunganSection(editorial = content.editorial)
            }
        }
    }

    if (showAboutSheet) {
        AboutContentSheet(
            liturgicalZoneLabel = liturgicalZoneLabel,
            liturgicalDate = content.liturgicalDate,
            onDismiss = { showAboutSheet = false },
        )
    }
    if (showProfileSheet) {
        ProfileActionsSheet(
            onRefresh = {
                onRefresh()
                showProfileSheet = false
            },
            onDismiss = { showProfileSheet = false },
        )
    }
}

@Composable
private fun HomeHeader(
    liturgicalDayName: String,
    liturgicalZoneLabel: String,
    liturgicalDate: String,
    onOpenAbout: () -> Unit,
    onOpenProfile: () -> Unit,
) {
    val formattedDate = formatLiturgicalHeaderDate(liturgicalDate)
    Column(
        modifier =
            Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.background)
                .padding(horizontal = 16.dp, vertical = 12.dp),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = stringResource(R.string.home_title),
                    style =
                        MaterialTheme.typography.labelMedium.copy(
                            fontSize = 11.sp,
                            letterSpacing = 0.66.sp,
                        ),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = liturgicalDayName,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = stringResource(R.string.liturgical_header_date_line, formattedDate, liturgicalZoneLabel),
                    style =
                        MaterialTheme.typography.bodySmall.copy(
                            fontSize = 13.sp,
                            lineHeight = 18.sp,
                        ),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            Row {
                IconButton(onClick = onOpenAbout) {
                    Icon(
                        imageVector = Icons.Filled.Info,
                        contentDescription = stringResource(R.string.home_about_content_description),
                    )
                }
                IconButton(onClick = onOpenProfile) {
                    Icon(
                        imageVector = Icons.Filled.AccountCircle,
                        contentDescription = stringResource(R.string.home_profile_content_description),
                    )
                }
            }
        }
        HorizontalDivider(
            modifier = Modifier.padding(top = 10.dp),
            color = StreamHairlineColor,
        )
    }
}

@Composable
private fun ReadingBlockItem(
    block: ReadingBlockEntity,
    showTopDivider: Boolean,
) {
    val isGospel = block.kind.equals("injil", ignoreCase = true) || block.kind.contains("gospel", ignoreCase = true)
    Column(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(vertical = 6.dp),
    ) {
        if (showTopDivider) {
            StreamHairline(
                modifier = Modifier.padding(bottom = 16.dp),
            )
        }
        Row(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = blockLabel(block.kind).uppercase(),
                    style =
                        MaterialTheme.typography.labelLarge.copy(
                            fontSize = 12.sp,
                            letterSpacing = 0.48.sp,
                        ),
                    color =
                        if (isGospel) MaterialTheme.colorScheme.tertiary
                        else MaterialTheme.colorScheme.primary,
                )
                val refLine = block.title ?: block.reference.orEmpty()
                if (refLine.isNotBlank()) {
                    Text(
                        text = refLine,
                        style =
                            MaterialTheme.typography.bodySmall.copy(
                                fontSize = 14.sp,
                                lineHeight = 20.sp,
                            ),
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            IconButton(
                onClick = { /* share sheet follows in next screen iteration */ },
            ) {
                Icon(
                    imageVector = Icons.Filled.MoreVert,
                    contentDescription = stringResource(R.string.reading_overflow_content_description),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        val bodyModifier =
            if (isGospel) {
                Modifier
                    .padding(top = 10.dp)
                    .gospelMarker()
            } else {
                Modifier.padding(top = 10.dp)
            }

        Text(
            text = block.body,
            style = MaterialTheme.typography.bodyLarge.copy(fontFamily = FontFamily.Serif),
            modifier = bodyModifier,
        )
        block.sourceLine?.takeIf { it.isNotBlank() }?.let { source ->
            Text(
                text = source,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 10.dp),
            )
        }
    }
}

@Composable
private fun HomilySection(
    homily: HomilyDocumentEntity?,
    onOpenSource: (String) -> Unit,
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = stringResource(R.string.section_homily),
            style = MaterialTheme.typography.titleMedium,
        )
        if (homily == null) {
            Text(
                text = stringResource(R.string.homily_empty),
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.padding(top = 8.dp),
            )
            return
        }

        val meta = listOfNotNull(homily.homilyDate, homily.sourceName).joinToString(" \u00B7 ")
        Text(
            text = meta,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(top = 4.dp),
        )
        homily.title?.takeIf { it.isNotBlank() }?.let { title ->
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                modifier = Modifier.padding(top = 10.dp),
            )
        }

        if (!homily.body.isNullOrBlank()) {
            Text(
                text = homily.body,
                style = MaterialTheme.typography.bodyLarge.copy(fontFamily = FontFamily.Serif),
                modifier = Modifier.padding(top = 10.dp),
            )
        } else {
            Text(
                text = stringResource(R.string.homily_link_only),
                style = MaterialTheme.typography.bodyLarge.copy(fontStyle = FontStyle.Italic),
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 10.dp),
            )
        }
        Spacer(modifier = Modifier.height(10.dp))
        Text(
            text = stringResource(R.string.homily_source_footnote, homily.sourceName ?: "-"),
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        if (homily.sourceUrl.isNotBlank()) {
            Text(
                text = homily.sourceUrl,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.primary,
                modifier =
                    Modifier
                        .padding(top = 2.dp)
                        .clickable { onOpenSource(homily.sourceUrl) },
            )
        }
    }
}

@Composable
private fun RenunganSection(editorial: EditorialPieceEntity?) {
    Column(modifier = Modifier.fillMaxWidth().padding(bottom = 28.dp)) {
        Text(
            text = stringResource(R.string.section_renungan),
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        if (editorial == null) {
            Text(
                text = stringResource(R.string.editorial_empty),
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.padding(top = 8.dp),
            )
            return
        }

        editorial.title?.takeIf { it.isNotBlank() }?.let { title ->
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(top = 6.dp),
            )
        }
        Text(
            text = editorial.byline,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(top = 4.dp),
        )
        if (editorial.aiAssisted) {
            Text(
                text = stringResource(R.string.renungan_ai_disclosure),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(top = 10.dp),
            )
        }
        Text(
            text = editorial.body,
            style = MaterialTheme.typography.bodyLarge.copy(fontFamily = FontFamily.Serif),
            modifier = Modifier.padding(top = 10.dp),
        )
    }
}

@Composable
private fun EmptySection(
    title: String,
    message: String,
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(title, style = MaterialTheme.typography.titleMedium)
        Text(
            text = message,
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.padding(top = 8.dp),
        )
    }
}

@Composable
private fun StreamDivider(top: Dp, bottom: Dp) {
    Column(modifier = Modifier.fillMaxWidth().padding(top = top, bottom = bottom)) {
        StreamHairline()
    }
}

@Composable
private fun InjilToHomilyThreshold() {
    Column(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(top = 28.dp, bottom = 24.dp),
    ) {
        StreamHairline()
    }
}

@Composable
private fun StreamHairline(
    modifier: Modifier = Modifier,
) {
    val hairline = StreamHairlineColor
    Box(
        modifier =
            modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(
                    brush =
                        Brush.horizontalGradient(
                            colorStops =
                                listOf(
                                    0.0f to Color.Transparent,
                                    0.30f to hairline,
                                    0.70f to hairline,
                                    1.0f to Color.Transparent,
                                ).toTypedArray(),
                        ),
                ),
    )
}

@Composable
private fun SheetDivider(
    modifier: Modifier = Modifier,
) {
    HorizontalDivider(
        modifier = modifier,
        color = StreamHairlineColor,
    )
}

private fun blockLabel(kind: String): String =
    when (kind.trim().lowercase()) {
        "bacaan1", "bacaan i", "first_reading", "reading_1" -> "Bacaan I"
        "bacaan2", "bacaan ii", "second_reading", "reading_2" -> "Bacaan II"
        "injil", "gospel" -> "Injil"
        else -> kind.replace('_', ' ').replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
    }

private fun Modifier.gospelMarker(): Modifier =
    this.then(
        Modifier.padding(start = 12.dp),
    )

private fun formatLiturgicalHeaderDate(date: String): String =
    runCatching {
        val parsed = LocalDate.parse(date)
        parsed.format(DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", Locale("id", "ID")))
    }.getOrDefault(date)

private fun resolveLiturgicalDayName(content: HomeDailyContent, fallback: String): String {
    val metadata = content.readings?.cycleMetadata.orEmpty().trim()
    if (metadata.isNotBlank() && metadata.startsWith("{")) {
        runCatching {
            val json = JSONObject(metadata)
            val keyCandidates =
                listOf(
                    "liturgy_name",
                    "liturgyName",
                    "liturgical_day_name",
                    "liturgicalDayName",
                    "liturgical_day",
                    "liturgicalDay",
                    "title",
                    "name",
                )
            keyCandidates.forEach { key ->
                val value = json.optString(key).trim()
                if (value.isNotBlank()) return value
            }
        }
    }
    return fallback
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AboutContentSheet(
    liturgicalZoneLabel: String,
    liturgicalDate: String,
    onDismiss: () -> Unit,
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp),
        ) {
            Text(
                text = stringResource(R.string.about_sheet_title),
                style = MaterialTheme.typography.titleMedium,
            )
            Text(
                text = stringResource(R.string.about_sheet_calendar_line, liturgicalZoneLabel),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 6.dp),
            )
            Text(
                text = stringResource(R.string.about_sheet_date_line, formatLiturgicalHeaderDate(liturgicalDate)),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp),
            )
            SheetDivider(modifier = Modifier.padding(vertical = 12.dp))
            Text(
                text = stringResource(R.string.about_sheet_readings_source),
                style = MaterialTheme.typography.bodyMedium,
            )
            Text(
                text = stringResource(R.string.about_sheet_homily_source),
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(top = 8.dp),
            )
            Text(
                text = stringResource(R.string.about_sheet_disclaimer),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 12.dp),
            )
            TextButton(
                onClick = onDismiss,
                modifier = Modifier.padding(top = 8.dp),
            ) {
                Text(text = stringResource(R.string.action_close))
            }
            Spacer(modifier = Modifier.height(12.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ProfileActionsSheet(
    onRefresh: () -> Unit,
    onDismiss: () -> Unit,
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp),
        ) {
            Text(
                text = stringResource(R.string.profile_sheet_title),
                style = MaterialTheme.typography.titleMedium,
            )
            Text(
                text = stringResource(R.string.profile_sheet_subtitle),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 4.dp, bottom = 14.dp),
            )
            Button(
                onClick = onRefresh,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(text = stringResource(R.string.action_refresh_content))
            }
            TextButton(
                onClick = onDismiss,
                modifier = Modifier.padding(top = 8.dp),
            ) {
                Text(text = stringResource(R.string.action_close))
            }
            Spacer(modifier = Modifier.height(12.dp))
        }
    }
}
