package com.catholicdaily.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.repeatOnLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.catholicdaily.app.ui.home.HomeScreen
import com.catholicdaily.app.ui.theme.CatholicDailyTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val app = application as CatholicDailyApplication
        setContent {
            CatholicDailyTheme {
                val vm: HomeViewModel =
                    viewModel(
                        factory =
                            HomeViewModelFactory(
                                app.contentRepository,
                                app.liturgicalDateResolver,
                            ),
                    )
                val state by vm.homeContent.collectAsStateWithLifecycle()
                val lifecycleOwner = LocalLifecycleOwner.current
                LaunchedEffect(lifecycleOwner) {
                    lifecycleOwner.repeatOnLifecycle(Lifecycle.State.RESUMED) {
                        vm.refreshLiturgicalToday()
                    }
                }
                HomeScreen(
                    content = state,
                    liturgicalZoneLabel = vm.liturgicalZoneLabel,
                    onRefresh = { vm.refreshFromNetwork() },
                )
            }
        }
    }
}
