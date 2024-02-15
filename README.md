<img alt="Tori.fi karttahaku logo" src="https://raw.githubusercontent.com/jehna/tori-fi-karttahaku/main/public/logo512.png" width=200>

# Tori.fi karttahaku
> Hae kartan mukaan lähistöllä olevia kohteita tori.fi:sta

Tämä työkalu luo sinulle tori.fi -sivustolle hakutermin, jolla voit hakea
tietyllä alueella olevia kohteita. Tori.fi:n oma haku antaa hakea vain
postinumerolla ja kaupungin nimellä, joka ei ole kovin hyvä lähtökohta jos
esimerkiksi asuu kahden kaupungin rajalla ja fillarimatkan päässä on kymmeniä
postinumeroalueita.

## Miten tämä toimii?

Mene sivustolle:

https://jehna.github.io/tori-fi-karttahaku/

ja kokeile työkalua!

Katso demovideo Youtubesta:  
[<img alt="Demovideo" src="https://img.youtube.com/vi/QrdJ1NbSQXU/0.jpg" width=200>](https://www.youtube.com/watch?v=QrdJ1NbSQXU)

## Devaus

Tämä on perin yksinkertainen Create React APP-pohjainen ja hutaisemalla
rakennettu palvelu. Teknologia on tylsää ja yksitoikkoista. Se lähtee päälle kun ajaa:

```shell
npm i
npm start
```

### Julkaisu

[CI][ci] julkaisee sivuston automaagisesti

[ci]: https://github.com/jehna/tori-fi-karttahaku/blob/main/.github/workflows/static.yml

## Ominaisuudet

Tämän projektin nostot:
* Karttahaku tori.fi -sivustolle 🎉
* Käyttää OpenStreetMapsin karttaa
* Ei seuraa sinua, eikä kerää mitään dataa, en minä sillä mitään tee
* On täysin ilmainen
* Toivottavasti joku tori.fi:lta näkee tämän projektin ja kopioi suoraan sinne
  tori.fi:lle että ei tarvisi tällaisia tehdä

## Haluatko osallistua devaukseen?

Anna palaa! Forkkaa repo ja pistä pullari tulemaan. Jos löydät bugin tai on
jotain muuta kehitysideoita niin lisää issue niin jutellaan.

## Lisenssi

Tämä projekti on lisensointu MIT-lisenssillä, joten voit tehdä sillä mitä
lystäät.

Huomaathan, että postinumerodata on alun perin Tilastokeskukselta ja suoraan
[Mikael Ahosen sivustolta][postinumerodata] nykäisty, eli sen lisenssi on
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.fi).

[postinumerodata]: https://mikaelahonen.com/fi/data/postinumero-data-suomi/
