package com.nutria.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nutria.app.data.*
import com.nutria.app.ui.components.*
import com.nutria.app.ui.theme.*

@Composable
fun PlanScreen() {
    var selectedDay by remember { mutableStateOf(3) }
    Column(Modifier.fillMaxSize().background(Cream50)) {
        Column(Modifier.padding(start = 24.dp, end = 24.dp, top = 24.dp, bottom = 12.dp)) {
            Text("RENCANA MINGGU INI", color = Ink500, fontSize = 12.sp, letterSpacing = 1.2.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(4.dp))
            Text("7 hari, berulang", color = Ink900, fontSize = 30.sp, fontWeight = FontWeight.SemiBold)
        }
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            DAYS_SHORT.forEachIndexed { i, d ->
                val active = i == selectedDay
                Box(
                    Modifier.weight(1f).clip(RoundedCornerShape(12.dp))
                        .background(if (active) Ink900 else Paper)
                        .clickable { selectedDay = i }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(d, color = if (active) Paper else Ink700, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        Text("${20 + i}", color = if (active) Cream300 else Ink500, fontSize = 10.sp)
                    }
                }
            }
        }
        val meals = MEALS.filter { it.dayIdx == selectedDay }
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            items(meals) { m ->
                Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Paper)) {
                    Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(Modifier.size(44.dp).background(Cream100, RoundedCornerShape(12.dp)), contentAlignment = Alignment.Center) {
                            Text(m.emoji, fontSize = 22.sp)
                        }
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            val slotColor = when (m.slot) {
                                Slot.Breakfast -> Yolk500
                                Slot.Lunch -> Herb500
                                Slot.Dinner -> Berry500
                                Slot.Snack -> Clay500
                            }
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(m.slot.label.uppercase(), color = slotColor, fontSize = 10.sp, letterSpacing = 0.8.sp, fontWeight = FontWeight.SemiBold)
                                Spacer(Modifier.width(8.dp))
                                if (m.prep) {
                                    Pill("prep", bg = Yolk100, fg = Yolk500)
                                    Spacer(Modifier.width(4.dp))
                                }
                                if (m.fresh) Pill("segar", bg = Herb100, fg = Herb600)
                            }
                            Text(m.name, color = Ink900, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                            Text(m.detail, color = Ink500, fontSize = 11.sp)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("${m.kcal}", color = Ink900, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                            Text("kcal · ${m.protein}p", color = Ink500, fontSize = 10.sp)
                        }
                    }
                }
            }
        }
    }
}
