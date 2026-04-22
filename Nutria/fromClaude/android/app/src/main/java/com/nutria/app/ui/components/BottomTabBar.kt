package com.nutria.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nutria.app.ui.theme.*

data class TabItem(val key: String, val label: String, val icon: ImageVector)

val Tabs = listOf(
    TabItem("home",    "Hari ini", Icons.Outlined.WbSunny),
    TabItem("plan",    "Rencana",  Icons.Outlined.CalendarMonth),
    TabItem("grocery", "Belanja",  Icons.Outlined.ShoppingCart),
    TabItem("prep",    "Prep",     Icons.Outlined.Restaurant),
)

@Composable
fun BottomTabBar(active: String, onChange: (String) -> Unit) {
    Box(modifier = Modifier.fillMaxWidth().background(Paper)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
        ) {
            Tabs.forEach { t ->
                val isActive = t.key == active
                val interaction = remember { MutableInteractionSource() }
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .weight(1f)
                        .clickable(interactionSource = interaction, indication = null) { onChange(t.key) }
                        .padding(vertical = 4.dp),
                ) {
                    Icon(
                        t.icon, contentDescription = t.label,
                        tint = if (isActive) Clay500 else Ink500,
                        modifier = Modifier.size(22.dp),
                    )
                    Spacer(Modifier.height(3.dp))
                    Text(
                        t.label,
                        fontSize = 10.sp,
                        color = if (isActive) Clay500 else Ink500,
                        fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Medium,
                    )
                }
            }
        }
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter).padding(bottom = 6.dp)
                .size(width = 134.dp, height = 4.dp)
                .background(Ink900.copy(alpha = 0.6f), RoundedCornerShape(100.dp)),
        )
    }
}
