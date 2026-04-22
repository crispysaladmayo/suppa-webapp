package com.nutria.app

import java.text.NumberFormat
import java.util.Locale

private val idFormat: NumberFormat = NumberFormat.getInstance(Locale("id", "ID"))

fun fmtRp(n: Int): String = "Rp" + idFormat.format(n)
fun fmtIdn(n: Int): String = idFormat.format(n)
