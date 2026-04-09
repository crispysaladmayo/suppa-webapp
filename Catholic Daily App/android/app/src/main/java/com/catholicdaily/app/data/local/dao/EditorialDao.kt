package com.catholicdaily.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.catholicdaily.app.data.local.entity.EditorialPieceEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface EditorialDao {
    @Query(
        """
        SELECT * FROM editorial_piece
        WHERE liturgical_date = :liturgicalDate AND language = 'id'
        LIMIT 1
        """,
    )
    fun observeEditorial(liturgicalDate: String): Flow<EditorialPieceEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: EditorialPieceEntity)
}
