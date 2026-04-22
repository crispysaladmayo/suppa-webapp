package com.nutria.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.Canvas
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import com.nutria.app.data.*
import com.nutria.app.ui.components.*
import com.nutria.app.ui.theme.*

private fun fmtRp(v: Int): String = "Rp" + "%,d".format(v).replace(',', '.')

@Composable
fun HomeScreen(onNav: (String) -> Unit) {
    val totalInitial = PREP_STOCK.sumOf { it.initialG }
    val totalLeft = PREP_STOCK.sumOf { it.leftG }
    val overallPct = (totalLeft * 100) / totalInitial
    val critical = PREP_STOCK.firstOrNull { it.critical }
    val needed = GROCERY.count { !it.pantry && it.priceRp > 0 }
    val totalCost = GROCERY.filter { !it.pantry }.sumOf { it.priceRp }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Cream50)
            .verticalScroll(rememberScrollState())
            .padding(bottom = 24.dp),
    ) {
        // Header
        Column(Modifier.padding(start = 24.dp, end = 24.dp, top = 24.dp, bottom = 16.dp)) {
            Text("KAMIS · 23 APRIL", color = Ink500, fontSize = 12.sp, letterSpacing = 1.2.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(4.dp))
            Text("Stok meal prep", color = Ink900, fontSize = 30.sp, fontWeight = FontWeight.SemiBold)
        }

        // PRIMARY — Prep depletion hero
        Card(
            colors = CardDefaults.cardColors(containerColor = Paper),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.padding(horizontal = 16.dp).fillMaxWidth(),
        ) {
            Column {
                // Alert banner
                critical?.let { c ->
                    Row(
                        Modifier.fillMaxWidth()
                            .background(Clay100)
                            .padding(horizontal = 20.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(Icons.Outlined.WarningAmber, null, tint = Clay600, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "${c.name} tinggal ${c.meals} porsi — habis besok",
                            color = Clay600, fontSize = 12.sp, fontWeight = FontWeight.SemiBold,
                        )
                    }
                }

                Column(Modifier.padding(20.dp)) {
                    Row(verticalAlignment = Alignment.Bottom) {
                        Column(Modifier.weight(1f)) {
                            Text("TERSISA DARI PREP MINGGU", color = Ink500, fontSize = 11.sp, letterSpacing = 1.sp, fontWeight = FontWeight.SemiBold)
                            Spacer(Modifier.height(4.dp))
                            Row(verticalAlignment = Alignment.Bottom) {
                                Text("$overallPct", color = Ink900, fontSize = 44.sp, fontWeight = FontWeight.SemiBold)
                                Text("%", color = Ink500, fontSize = 20.sp, fontWeight = FontWeight.Medium, modifier = Modifier.padding(start = 4.dp, bottom = 6.dp))
                            }
                            Text("${100 - overallPct}% sudah dimakan · hari ke-$DAYS_INTO_WEEK dari 7", color = Ink500, fontSize = 12.sp)
                        }
                        DepletionRing(pct = overallPct)
                    }

                    Spacer(Modifier.height(14.dp))
                    PREP_STOCK.forEach { item ->
                        StockBar(item)
                        Spacer(Modifier.height(10.dp))
                    }

                    Spacer(Modifier.height(4.dp))
                    Button(
                        onClick = { onNav("prep") },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (critical != null) Clay500 else Ink900,
                            contentColor = Paper,
                        ),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Text(
                            if (critical != null) "Jadwalkan prep lebih awal" else "Lihat rencana prep Minggu",
                            fontWeight = FontWeight.SemiBold,
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(14.dp))

        // Glance row
        Row(Modifier.padding(horizontal = 16.dp)) {
            GlanceCard(
                modifier = Modifier.weight(1f),
                icon = Icons.Outlined.ShoppingCart,
                title = "$needed item",
                subtitle = "belanjaan",
                detail = fmtRp(totalCost),
                accent = Herb500, bg = Herb100,
                onClick = { onNav("grocery") },
            )
            Spacer(Modifier.width(10.dp))
            GlanceCard(
                modifier = Modifier.weight(1f),
                icon = Icons.Outlined.Restaurant,
                title = "Min 14:00",
                subtitle = NEXT_PREP_IN,
                detail = "2j 30m · 10 tugas",
                accent = Yolk500, bg = Yolk100,
                onClick = { onNav("prep") },
            )
        }

        Spacer(Modifier.height(14.dp))

        // SECONDARY — Consume today
        Column(Modifier.padding(horizontal = 16.dp)) {
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("Makan hari ini", color = Ink900, fontSize = 18.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                TextButton(onClick = { onNav("plan") }) {
                    Text("Minggu →", color = Clay500, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                }
            }
            Card(
                colors = CardDefaults.cardColors(containerColor = Paper),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth(),
            ) {
                Column {
                    val todayMeals = MEALS.filter { it.dayIdx == 3 }.take(3)
                    todayMeals.forEachIndexed { i, meal ->
                        ConsumeRow(meal, consumed = i == 0, next = i == 1, last = i == todayMeals.lastIndex)
                    }
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        // TERTIARY — Prep focus mode
        Card(
            colors = CardDefaults.cardColors(containerColor = Ink900),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.padding(horizontal = 16.dp).fillMaxWidth(),
            onClick = { onNav("prep") },
        ) {
            Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier.size(44.dp).background(Color(0x1AFFFEF9), RoundedCornerShape(14.dp)),
                    contentAlignment = Alignment.Center,
                ) { Icon(Icons.Outlined.Restaurant, null, tint = Cream100, modifier = Modifier.size(22.dp)) }
                Spacer(Modifier.width(14.dp))
                Column(Modifier.weight(1f)) {
                    Text("MODE FOKUS MASAK", color = Clay100, fontSize = 10.sp, letterSpacing = 1.5.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(2.dp))
                    Text("Siap prep Minggu nanti?", color = Paper, fontSize = 17.sp, fontWeight = FontWeight.Medium)
                    Text("Timeline lengkap · timer · parallel steps", color = Cream300, fontSize = 11.sp)
                }
                Icon(Icons.Outlined.ChevronRight, null, tint = Cream100)
            }
        }
    }
}

@Composable
private fun DepletionRing(pct: Int) {
    val low = pct < 40
    val ringColor = if (low) Clay500 else Herb500
    Canvas(modifier = Modifier.size(64.dp)) {
        val stroke = 6.dp.toPx()
        val r = (size.minDimension - stroke) / 2f
        val center = Offset(size.width / 2f, size.height / 2f)
        drawCircle(color = Cream200, radius = r, center = center, style = Stroke(width = stroke))
        drawArc(
            color = ringColor,
            startAngle = -90f,
            sweepAngle = (pct / 100f) * 360f,
            useCenter = false,
            topLeft = Offset(center.x - r, center.y - r),
            size = androidx.compose.ui.geometry.Size(r * 2, r * 2),
            style = Stroke(width = stroke, cap = StrokeCap.Round),
        )
    }
}

@Composable
private fun StockBar(item: StockItem) {
    val pct = (item.leftG * 100) / item.initialG
    val low = pct < 30
    Column {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier.size(20.dp).background(Cream100, RoundedCornerShape(6.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    when (item.iconName) {
                        "chicken" -> Icons.Outlined.Restaurant
                        "egg" -> Icons.Outlined.EggAlt
                        else -> Icons.Outlined.Eco
                    },
                    null, tint = Color(item.colorHex), modifier = Modifier.size(11.dp),
                )
            }
            Spacer(Modifier.width(8.dp))
            Text(item.name, color = Ink900, fontSize = 12.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
            Text(
                "${item.leftG}g · ${item.meals} porsi",
                color = if (low) Clay500 else Ink500,
                fontSize = 11.sp,
                fontWeight = if (low) FontWeight.SemiBold else FontWeight.Medium,
            )
        }
        Spacer(Modifier.height(5.dp))
        Box(
            Modifier.fillMaxWidth().height(6.dp).background(Cream200, RoundedCornerShape(3.dp)),
        ) {
            Box(
                Modifier.fillMaxWidth(pct / 100f).height(6.dp)
                    .background(if (low) Clay500 else Color(item.colorHex), RoundedCornerShape(3.dp)),
            )
        }
    }
}

@Composable
private fun GlanceCard(
    modifier: Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String, subtitle: String, detail: String,
    accent: Color, bg: Color, onClick: () -> Unit,
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = bg),
        shape = RoundedCornerShape(20.dp),
        onClick = onClick,
    ) {
        Column(Modifier.padding(14.dp)) {
            Box(
                Modifier.size(30.dp).background(Paper.copy(alpha = 0.6f), RoundedCornerShape(9.dp)),
                contentAlignment = Alignment.Center,
            ) { Icon(icon, null, tint = accent, modifier = Modifier.size(16.dp)) }
            Spacer(Modifier.height(8.dp))
            Text(title, color = Ink900, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
            Text(subtitle, color = Ink700, fontSize = 12.sp)
            Spacer(Modifier.height(6.dp))
            Text(detail, color = Ink500, fontSize = 10.sp, fontStyle = FontStyle.Italic)
        }
    }
}

@Composable
private fun ConsumeRow(meal: Meal, consumed: Boolean, next: Boolean, last: Boolean) {
    Row(
        Modifier.fillMaxWidth()
            .alpha(if (consumed) 0.55f else 1f)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier.size(38.dp)
                .background(if (consumed) Cream100 else Clay100, RoundedCornerShape(11.dp)),
            contentAlignment = Alignment.Center,
        ) {
            if (consumed) Icon(Icons.Outlined.Check, null, tint = Herb500, modifier = Modifier.size(16.dp))
            else Text(meal.emoji, fontSize = 18.sp)
        }
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                val slotColor = when (meal.slot) {
                    Slot.Breakfast -> Yolk500; Slot.Lunch -> Herb500; Slot.Dinner -> Berry500; Slot.Snack -> Clay500
                }
                Text(meal.slot.label.uppercase(), color = slotColor, fontSize = 10.sp, letterSpacing = 0.8.sp, fontWeight = FontWeight.SemiBold)
                if (next) {
                    Spacer(Modifier.width(6.dp))
                    Pill("berikutnya", bg = Clay500, fg = Paper)
                }
                if (meal.prep && !consumed) {
                    Spacer(Modifier.width(6.dp))
                    Pill("prep", bg = Yolk100, fg = Yolk500)
                }
            }
            Text(
                meal.name,
                color = Ink900,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                textDecoration = if (consumed) TextDecoration.LineThrough else TextDecoration.None,
            )
        }
        if (!consumed) {
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (next) Ink900 else Cream100,
                    contentColor = if (next) Paper else Ink700,
                ),
                shape = RoundedCornerShape(10.dp),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
            ) { Text("Makan", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) }
        }
    }
    if (!last) HorizontalDivider(color = Hairline, thickness = 0.5.dp)
}
