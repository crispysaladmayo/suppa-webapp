package com.catholicdaily.app

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.catholicdaily.app.data.calendar.LiturgicalDateResolver
import com.catholicdaily.app.data.model.HomeDailyContent
import com.catholicdaily.app.data.repository.ContentRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class HomeViewModel(
    private val repository: ContentRepository,
    private val liturgicalDateResolver: LiturgicalDateResolver,
) : ViewModel() {

    val liturgicalZoneLabel: String = liturgicalDateResolver.displayZone.id

    private val liturgicalDateFlow =
        MutableStateFlow(liturgicalDateResolver.todayLiturgicalDate())

    val homeContent: StateFlow<HomeDailyContent> =
        liturgicalDateFlow
            .flatMapLatest { date -> repository.observeHome(date) }
            .stateIn(
                viewModelScope,
                SharingStarted.WhileSubscribed(5_000),
                HomeDailyContent(liturgicalDate = liturgicalDateFlow.value),
            )

    fun refreshLiturgicalToday() {
        val today = liturgicalDateResolver.todayLiturgicalDate()
        if (today != liturgicalDateFlow.value) {
            liturgicalDateFlow.value = today
        }
    }

    fun refreshFromNetwork() {
        val date = liturgicalDateFlow.value
        viewModelScope.launch {
            repository.refreshHomilyIfNeeded()
            repository.refreshEditorial(date)
        }
    }
}

class HomeViewModelFactory(
    private val repository: ContentRepository,
    private val liturgicalDateResolver: LiturgicalDateResolver,
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return HomeViewModel(repository, liturgicalDateResolver) as T
        }
        throw IllegalArgumentException("Unknown ViewModel: ${modelClass.name}")
    }
}
