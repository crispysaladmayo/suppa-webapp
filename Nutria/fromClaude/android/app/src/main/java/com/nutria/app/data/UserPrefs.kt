package com.nutria.app.data

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import android.content.Context
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "nutria_prefs")

class UserPrefs(private val ctx: Context) {
    private val groceryChecked = stringSetPreferencesKey("grocery_checked")
    private val prepDone = stringSetPreferencesKey("prep_done")

    val groceryCheckedFlow: Flow<Set<String>> = ctx.dataStore.data.map { it[groceryChecked] ?: emptySet() }
    val prepDoneFlow: Flow<Set<String>> = ctx.dataStore.data.map { it[prepDone] ?: emptySet() }

    suspend fun toggleGrocery(name: String) {
        ctx.dataStore.edit { prefs ->
            val cur = prefs[groceryChecked] ?: emptySet()
            prefs[groceryChecked] = if (name in cur) cur - name else cur + name
        }
    }
    suspend fun togglePrep(taskTime: String) {
        ctx.dataStore.edit { prefs ->
            val cur = prefs[prepDone] ?: emptySet()
            prefs[prepDone] = if (taskTime in cur) cur - taskTime else cur + taskTime
        }
    }
}
