package com.nutria.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.nutria.app.ui.components.BottomTabBar
import com.nutria.app.ui.screens.*
import com.nutria.app.ui.theme.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NutriaTheme {
                Surface(color = Cream50) {
                    var tab by remember { mutableStateOf("home") }
                    Column(Modifier.fillMaxSize().background(Cream50).statusBarsPadding()) {
                        Box(Modifier.weight(1f)) {
                            when (tab) {
                                "home"    -> HomeScreen(onNav = { tab = it })
                                "plan"    -> PlanScreen()
                                "grocery" -> GroceryScreen()
                                "prep"    -> PrepScreen()
                            }
                        }
                        BottomTabBar(active = tab, onChange = { tab = it })
                        Spacer(Modifier.navigationBarsPadding())
                    }
                }
            }
        }
    }
}
