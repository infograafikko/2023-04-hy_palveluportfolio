# Projekti

Tämä on Helsingin yliopiston palveluportfoliota esittävä interaktiivinen visualisointi.

Projekti on rakennettu SolidJS:llä hyödyntäen SolidFlow-kirjastoa https://github.com/miguelsalesvieira/solid-flow Koska paketissa oli asioita, joita oli tarvetta räätälöidä, sen sisältämä koodi on tweakattuna liitetty projektin `SolidFlow`-kansion.

Saman operaation tein myös PinchZoomPan-kirjastolle https://github.com/SanichKotikov/pinch-zoom-pan joka hoitaa canvasin zoomailua ja siirtelyä projektissa.

Projektin css on yhdistelmä Tailwindiä ja CSS-moduuleja.

Projektin käyttämä data on `data.ts`-tiedostossa. Sen sisältämässä `initialTsv`-muuttujassa data on tsv-muodossa ja se parsitaan koodissa JSONiksi. Tähän ratkaisuun päädyttiin sen vuoksi, että Excelistä voi copy-pastettaa dataa frontin tekstilaatikkoon tai muuttujaan. Kun kopioit Excelistä dataa huomioi ainakin seuraavat seikat.

- \r parsitaan rivivaihtona. Excelin natiiveja rivivaihtoja ei voi käyttää, koska se rikkoo tsv-tiedoston
- Tekstimuotoiluja voi tehdä Markdown-muotoisesti esimerkiksi boldaamalla tekstiä tai luomalla hyperlinkkejä
- Tyhjiä soluja ei hyväksytä. Laita esimerkiksi viiva (-) sellaisiin kohtiin, joihin ei haluta tietoa
