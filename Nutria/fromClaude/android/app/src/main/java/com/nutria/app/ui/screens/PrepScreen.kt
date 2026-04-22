package com.nutria.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.Timer
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nutria.app.data.*
import com.nutria.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun PrepScreen() {
    val ctx = LocalContext.current
    val prefs = remember { UserPrefs(ctx) }
    val scope = rememberCoroutineScope()
    val done by prefs.prepDoneFlow.collectAsState(initial = emptySet())

    Column(Modifier.fillMaxSize().background(Cream50)) {
        Column(Modifier.padding(start = 24.dp, end = 24.dp, top = 24.dp, bottom = 12.dp)) {
            Text("PREP · MINGGU SORE", color = Ink500, fontSize = 12.sp, letterSpacing = 1.2.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(4.dp))
            Text("$PREP_START – $PREP_END", color = Ink900, fontSize = 30.sp, fontWeight = FontWeight.SemiBold)
            Text("2 jam 30 menit · 10 tugas · 14 meal", color = Ink500, fontSize = 12.sp)
        }
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Paper),
            modifier = Modifier.padding(horizontal = 16.dp).fillMaxWidth(),
        ) {
            Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.size(38.dp).background(Clay100, RoundedCornerShape(12.dp)), contentAlignment = Alignment.Center) {
                    Icon(Icons.Outlined.Timer, null, tint = Clay500, modifier = Modifier.size(20.dp))
                }
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text("Selesai: ${done.size} / ${PREP_TASKS.size}", color = Ink900, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                    Text("Ikuti urutan — beberapa tugas paralel", color = Ink500, fontSize = 11.sp)
                }
            }
        }
        Spacer(Modifier.height(12.dp))
        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(count = PREP_TASKS.size, key = { PREP_TASKS[it].time }) { idx ->
                val t = PREP_TASKS[idx]
                val isDone = t.time in done
                val kindColor = when (t.kind) {
                    TaskKind.Chicken -> Clay500
                    TaskKind.Beef -> Berry500
                    TaskKind.Grain -> Yolk500
                    TaskKind.Veg -> Herb500
                    TaskKind.Wait -> Ink400
                    TaskKind.Pack -> Ink700
                    TaskKind.Prep -> Ink500
                }
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Paper),
                    modifier = Modifier.clickable { scope.launch { prefs.togglePrep(t.time) } },
                ) {
                    Row(Modifier.padding(14.dp), verticalAlignment = Alignment.Top) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(50.dp)) {
                            Text(t.time, color = Ink900, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("${t.durMin}m", color = Ink500, fontSize = 10.sp)
                        }
                        Box(Modifier.width(2.dp).height(40.dp).background(kindColor, RoundedCornerShape(1.dp)))
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            Text(
                                t.title,
                                color = Ink900,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                textDecoration = if (isDone) TextDecoration.LineThrough else TextDecoration.None,
                            )
                            Text(t.detail, color = Ink500, fontSize = 11.sp)
                            t.qty?.let {
                                Spacer(Modifier.height(4.dp))
                                Box(Modifier.background(Cream100, RoundedCornerShape(6.dp)).padding(horizontal = 6.dp, vertical = 2.dp)) {
                                    Text(it, color = Ink700, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
                                }
                            }
                        }
                        Box(
                            Modifier.size(24.dp).clip(CircleShape)
                                .background(if (isDone) Herb500 else Cream100),
                            contentAlignment = Alignment.Center,
                        ) {
                            if (isDone) Icon(Icons.Outlined.Check, null, tint = Paper, modifier = Modifier.size(14.dp))
                        }
                    }
                }
            }
        }
    }
}
