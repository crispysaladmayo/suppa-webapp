package com.nutria.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nutria.app.data.*
import com.nutria.app.ui.theme.*
import kotlinx.coroutines.launch

private fun fmtRp(v: Int): String = if (v == 0) "—" else "Rp" + "%,d".format(v).replace(',', '.')

@Composable
fun GroceryScreen() {
    val ctx = LocalContext.current
    val prefs = remember { UserPrefs(ctx) }
    val scope = rememberCoroutineScope()
    val checked by prefs.groceryCheckedFlow.collectAsState(initial = emptySet())

    val total = GROCERY.filter { !it.pantry }.sumOf { it.priceRp }
    val remaining = GROCERY.filter { !it.pantry && it.name !in checked }.sumOf { it.priceRp }

    Column(Modifier.fillMaxSize().background(Cream50)) {
        Column(Modifier.padding(start = 24.dp, end = 24.dp, top = 24.dp, bottom = 12.dp)) {
            Text("BELANJA MINGGUAN", color = Ink500, fontSize = 12.sp, letterSpacing = 1.2.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(4.dp))
            Text(fmtRp(total), color = Ink900, fontSize = 30.sp, fontWeight = FontWeight.SemiBold)
            Text("tersisa ${fmtRp(remaining)}", color = Clay500, fontSize = 12.sp, fontWeight = FontWeight.Medium)
        }
        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            GrocerySection.values().forEach { section ->
                val items = GROCERY.filter { it.section == section }
                item(key = section.name) {
                    Column {
                        Text(
                            section.title.uppercase(),
                            color = Ink500, fontSize = 10.sp, letterSpacing = 1.2.sp, fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(bottom = 8.dp, start = 4.dp),
                        )
                        Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Paper)) {
                            Column {
                                items.forEachIndexed { i, g ->
                                    val isChecked = g.name in checked || g.pantry
                                    Row(
                                        Modifier.fillMaxWidth()
                                            .clickable(enabled = !g.pantry) { scope.launch { prefs.toggleGrocery(g.name) } }
                                            .padding(14.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                    ) {
                                        Box(
                                            Modifier.size(22.dp).clip(RoundedCornerShape(7.dp))
                                                .background(if (isChecked) Herb500 else Color.White)
                                                .then(if (!isChecked) Modifier.border(width = 1.5.dp, color = Ink300, shape = RoundedCornerShape(7.dp)) else Modifier),
                                            contentAlignment = Alignment.Center,
                                        ) {
                                            if (isChecked) Icon(Icons.Outlined.Check, null, tint = Paper, modifier = Modifier.size(14.dp))
                                        }
                                        Spacer(Modifier.width(12.dp))
                                        Column(Modifier.weight(1f)) {
                                            Text(
                                                g.name, color = Ink900, fontSize = 14.sp, fontWeight = FontWeight.Medium,
                                                textDecoration = if (isChecked) TextDecoration.LineThrough else TextDecoration.None,
                                            )
                                            Text(
                                                "${g.qty}${if (g.note != null) " · ${g.note}" else ""}",
                                                color = Ink500, fontSize = 11.sp,
                                                fontStyle = if (g.note != null) FontStyle.Italic else FontStyle.Normal,
                                            )
                                        }
                                        Text(
                                            fmtRp(g.priceRp),
                                            color = if (g.pantry) Ink400 else Ink900,
                                            fontSize = 13.sp, fontWeight = FontWeight.SemiBold,
                                        )
                                    }
                                    if (i != items.lastIndex) HorizontalDivider(color = Hairline, thickness = 0.5.dp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
