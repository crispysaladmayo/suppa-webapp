package com.nutria.app.data

// ──────────────────────────────────────────────────────────────────────────────
// In-memory seed data — Indonesian meal plan, 2 adults, weekly repeat
// ──────────────────────────────────────────────────────────────────────────────

data class FamilyMember(val id: String, val name: String, val role: String, val colorHex: Long, val initial: String)

val FAMILY = mapOf(
    "W" to FamilyMember("W", "Maya",  "Istri",  0xFF9B3C56, "M"),
    "H" to FamilyMember("H", "Arief", "Suami",  0xFF4A6B3E, "A"),
)

enum class Slot(val label: String) {
    Breakfast("Sarapan"),
    Lunch("Makan siang"),
    Snack("Snack"),
    Dinner("Makan malam"),
}

data class Meal(
    val id: String,
    val dayIdx: Int,      // 0 = Senin
    val slot: Slot,
    val name: String,
    val detail: String,
    val who: List<String>,
    val prep: Boolean = false,
    val fresh: Boolean = false,
    val kcal: Int,
    val protein: Int,
    val emoji: String,
)

val DAYS_SHORT = listOf("Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min")
val DAYS_LONG  = listOf("Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu")

val MEALS: List<Meal> = buildList {
    for (d in 0..6) {
        add(Meal("s$d",   d, Slot.Breakfast, "Healthy shake",
            "200g putih telur · 50g oats · 150g alpukat · 1 scoop whey",
            listOf("W","H"), fresh = true, kcal = 520, protein = 42, emoji = "🥤"))
        add(Meal("l$d",   d, Slot.Lunch, "Ayam + jagung + buncis",
            "150g ayam · 100g jagung · 50g buncis",
            listOf("W","H"), prep = true, kcal = 380, protein = 38, emoji = "🍗"))
        add(Meal("sn1$d", d, Slot.Snack, "Pisang",
            "150g", listOf("W","H"), fresh = true, kcal = 135, protein = 2, emoji = "🍌"))
        add(Meal("sn2$d", d, Slot.Snack, "Ubi rebus",
            "300g", listOf("W","H"), prep = true, kcal = 258, protein = 3, emoji = "🍠"))
        add(Meal("sn3$d", d, Slot.Snack, "Pepaya",
            "200g", listOf("W","H"), fresh = true, kcal = 86, protein = 1, emoji = "🥭"))
        add(Meal("dn$d",  d, Slot.Dinner, "Ayam + jagung + buncis",
            "150g ayam · 100g jagung · 50g buncis",
            listOf("W","H"), prep = true, kcal = 380, protein = 38, emoji = "🍗"))
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Grocery (prices in IDR)
// ──────────────────────────────────────────────────────────────────────────────

enum class GrocerySection(val title: String) {
    Produce("Sayur & buah"),
    Meat("Protein"),
    Pantry("Bahan pokok"),
}

data class GroceryItem(
    val name: String,
    val qty: String,
    val priceRp: Int,
    val section: GrocerySection,
    val pantry: Boolean = false,
    val note: String? = null,
)

val GROCERY: List<GroceryItem> = listOf(
    GroceryItem("Alpukat",       "14 buah (~2.1kg)", 84_000, GrocerySection.Produce, note = "untuk shake harian"),
    GroceryItem("Pisang",        "2.1 kg",           42_000, GrocerySection.Produce),
    GroceryItem("Pepaya",        "2 buah (~2.8kg)",  28_000, GrocerySection.Produce),
    GroceryItem("Ubi madu",      "4.2 kg",           63_000, GrocerySection.Produce, note = "snack harian"),
    GroceryItem("Jagung manis",  "1.4 kg pipil",     35_000, GrocerySection.Produce),
    GroceryItem("Buncis",        "700 g",            14_000, GrocerySection.Produce),

    GroceryItem("Dada ayam fillet", "5.6 kg",         252_000, GrocerySection.Meat, note = "→ 2.1kg dimasak (susut 25%)"),
    GroceryItem("Putih telur",      "2.8 kg (~56 btr)", 140_000, GrocerySection.Meat, note = "untuk shake 200g/hari/org"),

    GroceryItem("Oatmeal",        "700 g",        45_000, GrocerySection.Pantry),
    GroceryItem("Whey protein",   "14 scoop",     0,      GrocerySection.Pantry, pantry = true, note = "sudah ada stok"),
    GroceryItem("Minyak zaitun",  "100 ml",       0,      GrocerySection.Pantry, pantry = true, note = "sudah ada"),
    GroceryItem("Garam & lada",   "secukupnya",   0,      GrocerySection.Pantry, pantry = true, note = "sudah ada"),
    GroceryItem("Bawang putih",   "200 g",         8_000, GrocerySection.Pantry),
)

// ──────────────────────────────────────────────────────────────────────────────
// Prep session (Minggu sore)
// ──────────────────────────────────────────────────────────────────────────────

enum class TaskKind { Prep, Chicken, Beef, Wait, Grain, Veg, Pack }

data class PrepTask(
    val time: String,
    val durMin: Int,
    val title: String,
    val detail: String,
    val kind: TaskKind,
    val qty: String? = null,
)

val PREP_TASKS: List<PrepTask> = listOf(
    PrepTask("14:00", 15, "Siapkan bahan",       "Cuci ayam, sayur, ubi · timbang porsi", TaskKind.Prep),
    PrepTask("14:15", 20, "Rebus ubi madu",      "4.2 kg ubi — 14 porsi 300g", TaskKind.Grain, "4.2 kg"),
    PrepTask("14:20", 10, "Potong dada ayam",    "5.6kg → 28 potong 200g (mentah)", TaskKind.Chicken, "5.6 kg"),
    PrepTask("14:30",  5, "Bumbui ayam",         "Bawang putih, garam, lada, minyak zaitun", TaskKind.Prep),
    PrepTask("14:35", 40, "Panggang ayam (oven)","180°C · batch 2.8kg → jadi ~2.1kg matang", TaskKind.Chicken),
    PrepTask("14:45", 15, "Kukus jagung & buncis","1.4kg jagung + 700g buncis · paralel", TaskKind.Veg),
    PrepTask("15:15", 15, "Rebus putih telur",   "2.8kg (56 butir) · untuk shake pagi", TaskKind.Wait, "2.8 kg"),
    PrepTask("15:30", 10, "Pisahkan putih telur","Simpan dalam container kaca", TaskKind.Pack),
    PrepTask("15:40", 30, "Porsikan 14 meal",    "14 box: 150g ayam + 100g jagung + 50g buncis", TaskKind.Pack),
    PrepTask("16:10", 20, "Label & simpan",      "Senin-Jumat kulkas, Sabtu-Minggu freezer", TaskKind.Pack),
)

const val PREP_TOTAL_MIN = 150
const val PREP_START = "14:00"
const val PREP_END   = "16:30"

// ──────────────────────────────────────────────────────────────────────────────
// Prep stock — "Kamis morning, 4th day of week" snapshot
// ──────────────────────────────────────────────────────────────────────────────

data class StockItem(
    val name: String,
    val initialG: Int,
    val leftG: Int,
    val meals: Int,
    val colorHex: Long,
    val iconName: String,      // matches icon key in Icons.kt
    val critical: Boolean = false,
)

val PREP_STOCK: List<StockItem> = listOf(
    StockItem("Ayam panggang",   2100, 600,  4, 0xFFC65D3C, "chicken", critical = true),
    StockItem("Ubi rebus",       4200, 1500, 5, 0xFF4A6B3E, "leaf"),
    StockItem("Jagung + buncis", 2100, 700,  4, 0xFF6A8A52, "leaf"),
    StockItem("Putih telur",     2800, 1200, 6, 0xFFD79A3E, "egg"),
)

const val DAYS_INTO_WEEK = 4
const val NEXT_PREP_IN   = "3 hari"
const val NEXT_PREP_DAY  = "Minggu"
