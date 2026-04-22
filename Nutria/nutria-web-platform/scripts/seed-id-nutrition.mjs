/**
 * Generates src/data/id-ingredient-nutrition.json
 * Values are approximate per 100 g edible portion, aligned with
 * Indonesian food composition references (PKGM / similar) and USDA analogs.
 * Run: node scripts/seed-id-nutrition.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../app/web/src/data');
const out = join(outDir, 'id-ingredient-nutrition.json');
mkdirSync(outDir, { recursive: true });

/** @type {string[]} each: "alias1;alias2|kcal|protein|carbs|fat|fiber|Fe|Ca|C" */
const raw = `
beras putih;beras kering;beras|365|6.7|80|0.7|1.3|0.9|14|0
nasi putih;nasi matang;nasi|130|2.7|28|0.3|0.4|0.2|10|0
beras merah|360|7.5|76|2.7|3.5|1.2|24|0
jagung pipil;jagung kering|365|9.4|74|4.7|7.3|2.7|7|0
jagung manis rebus;jagung manis|96|3.4|21|1.5|2.4|0.5|3|6
gandum utuh;gandum|339|13.7|72|2.5|10.7|3.6|35|0
terigu;tepung terigu;tepung gandum|364|10.3|76|1|2.7|4.4|18|0
tepung beras|366|6.7|80|0.5|1.4|1.2|7|0
tepung tapioka;tepung kanji|360|0.2|88|0.1|0.1|0.5|20|0
tepung maizena;tepung jagung|381|0.3|91|0.1|0.3|0.5|2|0
mie kering;mie telur|471|14|64|16|3.7|3.6|58|0
bihun;kwetiau kering|350|7|78|1|1|2|20|0
sagu|354|0.2|87|0.2|0.5|2|20|0
ubi jalar;kentang madu|86|1.6|20|0.1|3|0.6|30|19
ubi kayu;singkong;ketela pohon|160|1.4|38|0.3|1.8|0.6|16|20
talas;taro|112|1.5|26|0.2|4.1|0.6|43|5
kentang;kentang rebus|77|2|17|0.1|2.2|0.8|9|20
pisang ambon;pisang|89|1.1|23|0.3|2.6|0.3|5|8.7
pisang raja|90|1.3|23|0.3|2|0.3|5|8.5
apel|52|0.3|14|0.2|2.4|0.1|6|4.6
pepaya|43|0.5|11|0.3|1.7|0.3|20|61
mangga|60|0.8|15|0.4|1.6|0.2|11|36
jeruk;jeruk manis|47|0.9|12|0.1|2.4|0.1|40|53
salak|82|0.8|22|0.4|5.3|1.5|38|8
semangka|30|0.6|8|0.2|0.4|0.2|7|8.1
melon|34|0.8|8|0.2|0.9|0.2|9|27
anggur|69|0.7|18|0.2|0.9|0.4|10|3.2
alpukat|160|2|8.5|14.7|6.7|0.6|12|10
tomat|18|0.9|3.9|0.2|1.2|0.3|10|14
timun|16|0.7|3.6|0.1|0.5|0.3|16|2.8
wortel|41|0.9|10|0.2|2.8|0.3|33|5.9
bayam|23|2.9|3.6|0.4|2.2|3.6|99|28
kangkung|19|2.6|3.1|0.2|2.1|1.3|77|55
sawi hijau;sawi|16|1.5|2.2|0.3|1|0.8|105|45
kol;kubis|25|1.3|6|0.1|2.5|0.5|40|37
brokoli|34|2.8|7|0.4|2.6|0.7|47|89
buncis;kacang panjang|31|1.8|7|0.1|3.4|1|37|16
kacang tanah;kacang kulit|567|26|16|49|8.5|4.6|92|0
kacang hijau|347|24|63|1.2|16.3|6.7|132|2
kacang merah|333|24|60|0.8|24|5.4|143|1
kedelai|446|36|30|20|9.3|15.7|277|6
tempe|192|20|8|11|6|2.7|111|0
tahu;tahu putih|76|8|1.9|4.8|0.3|5|350|0
oncom|155|13|18|6|5|2|50|0
dada ayam mentah;ayam fillet;ayam dada|120|22.5|0|2.6|0|0.9|15|0
paha ayam;ayam paha|177|17|0|12|0|1.2|11|0
ayam kampung|143|24|0|4.5|0|1.3|12|0
bebek|337|19|0|28|0|2.7|11|0
daging sapi;daging sapi tanpa lemak|250|26|0|15|0|2.6|12|0
daging kambing|294|25|0|21|0|2.8|13|0
ati ayam|167|25|1|7|0|9.5|9|27
telur ayam;telur|155|13|1.1|11|0|1.8|56|0
telur bebek|185|13|1.5|14|0|3.1|70|0
ikan kembung|109|20|0|3|0|1.2|20|0
ikan tongkol;cakalang|132|23|0|4|0|1.4|20|0
ikan salmon|208|20|0|13|0|0.8|9|3.9
ikan lele|105|18|0|2.5|0|0.8|50|0
ikan nila|96|19|0|2|0|0.6|20|0
udang;udang windu|99|24|0|0.3|0|2.6|52|0
cumi-cumi;cumi|92|16|3|1.4|0|2.6|32|5
kerang|86|15|3|1|0|6.7|28|0
susu sapi;susu segar|61|3.2|4.8|3.3|0|0|113|1
susu kedelai|54|3.3|6|1.8|0.6|0.6|25|0
yogurt plain|61|3.5|4.7|3.3|0|0.1|121|1
keju cheddar|403|23|1.3|33|0|0.7|721|0
mentega|717|0.8|0.1|81|0|0|24|0
minyak kelapa sawit|884|0|0|100|0|0|0|0
minyak goreng;minyak sayur|884|0|0|100|0|0|0|0
minyak kelapa|862|0|0|100|0|0|0|0
kelapa parut|354|3.3|15|34|9|2|14|3
santan;kental|230|2.3|6|24|3|1.6|16|2
gula pasir|387|0|100|0|0|0.1|1|0
gula merah;gula aren|383|0.1|95|0|0|1.9|80|0
madu|304|0.3|82|0|0.2|0.4|6|0.5
garam|0|0|0|0|0|0|0|0
merica|251|10|64|3.3|25|9.7|443|21
ketumbar|298|12|55|18|42|16.3|630|27
kunyit;turmeric|354|7.8|65|10|21|55|183|25
jahe|80|1.8|18|0.8|2|0.6|16|5
lengkuas|48|0.5|11|0.2|1|1.5|20|0
serai|99|1.8|25|0.5|0|8.9|65|6
daun salam|313|7.6|75|8|26|67|834|0
daun jeruk|293|6.6|75|7|11|44|330|0
bawang merah|40|1.1|9.3|0.1|1.7|0.3|23|7
bawang putih|149|6.4|33|0.5|2.1|1.7|181|31
bawang bombay|40|1.1|9|0.1|1.7|0.2|23|7
cabai rawit;cabe rawit|40|2|8.8|0.4|1.5|1|14|144
cabai merah;cabe merah|31|1.5|6.5|0.3|1.2|0.7|8|144
tomat saus;sambal tomat|30|1.5|7|0.2|1.2|0.5|20|15
kecap manis|290|3.5|67|0|0|2|20|0
kecap asin|60|10|6|0|0|2|20|0
terasi|148|20|13|4|0|6|200|0
petis|120|15|10|4|0|3|50|0
tahu sumedang|77|8|2|5|0.3|1|100|0
tempe gembus|140|12|14|6|4|1.5|80|0
mie instan matang;mie goreng instan|138|4|18|5|1|1|20|0
bakso sapi|217|13|12|14|0.5|1.5|20|0
sosis ayam|250|12|2|21|0|1|10|0
ikan asin teri|289|58|0|6|0|12|200|0
ikan teri|262|63|0|9|0|15|200|0
paru sapi|150|29|1|4|0|5.8|20|0
hati sapi|165|24|5|5|0|6.5|5|2
rendang daging|250|18|5|18|1|2.5|20|0
santan encer|40|0.5|3|4|0|0.3|5|1
daun singkong|49|4.6|8|0.8|4|2.2|150|40
daun pepaya muda|55|6|9|0.5|1.5|1.2|200|30
labu siam|19|0.6|4.5|0.1|1|0.3|20|8
terong|25|1|6|0.2|3|0.2|9|2.2
jamur kancing|22|3.1|3.3|0.3|1|0.5|3|2.1
paprika merah|31|1|6|0.3|2.1|0.4|7|128
selada|14|1.4|2.9|0.2|1.3|1|36|9
ketoprak lontong|120|5|18|3|2|1|30|2
lontong;nasi impit|111|2.5|23|0.3|0.5|0.3|10|0
ketupat|120|2.5|25|0.5|0.5|0.3|10|0
emping melinjo|400|11|83|1|4|3|50|0
kerupuk udang|500|5|60|25|0|2|30|0
`.trim().split('\n').filter(Boolean);

const rows = raw.map((line) => {
  const parts = line.split('|');
  const left = parts[0];
  const numParts = parts.slice(1).map((x) => Number(x.trim()));
  const aliases = left.split(';').map((s) => s.trim()).filter(Boolean);
  const [kcal, proteinG, carbsG, fatG, fiberG, ironMg, calciumMg, vitaminCMg] = numParts;
  return { aliases, kcal, proteinG, carbsG, fatG, fiberG, ironMg, calciumMg, vitaminCMg };
});

writeFileSync(out, JSON.stringify(rows, null, 2));
console.log('Wrote', rows.length, 'rows to', out);
