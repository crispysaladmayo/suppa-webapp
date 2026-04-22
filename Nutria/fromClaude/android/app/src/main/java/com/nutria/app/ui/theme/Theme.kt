package com.nutria.app.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

private val NutriaColors = lightColorScheme(
    primary = Clay500,
    onPrimary = Paper,
    secondary = Herb500,
    onSecondary = Paper,
    tertiary = Yolk500,
    background = Cream50,
    onBackground = Ink900,
    surface = Paper,
    onSurface = Ink900,
    surfaceVariant = Cream100,
    onSurfaceVariant = Ink700,
    outline = Ink300,
    error = Clay600,
)

val NutriaShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(20.dp),
    extraLarge = RoundedCornerShape(28.dp),
)

@Composable
fun NutriaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = NutriaColors,
        typography = NutriaTypography,
        shapes = NutriaShapes,
        content = content,
    )
}
