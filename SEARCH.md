
# Searching Cards

Operators can be specified multiple times, and most operators will support commas to specify multiple values. Any numerical operators will be specified, but they should all support `>`, `>=`, `<=`, `<`, `!=` in addition to equality checks.

## Abilities

You can search for cards by ability by putting it bare into the search field. For example, searching for `Brainstorm` will return all cards with `Brainstorm` in the text.

## Attribute

Attributes can be searched for by doing:

- `attribute:stylish` to add attribute `stylish` to the search results
- `attribute:none` to add cards with no attribute to the search results
- `a:quintuplets` to add attribute `quintuplets` to the search results
- `-a:ribbon` to remove attribute `ribbon` from the search results
- `-a:ribbon,stylish` to remove attribute `ribbon` and `stylish` from the search results

## Code

Cards can be searched by code by doing:

- `5HY/W83-E001` to search for card with code `5HY/W83-E001`
- `id:5HY/W83-E001` to search for card with code `5HY/W83-E001`
- `-id:5HY/W83-E001` to remove card with code `5HY/W83-E001` from the search results

## Color

Colors can be searched for by doing:

- `color:b` to add color `blue` to the search results
- `c:r` to add color `red` to the search results
- `-c:g` to remove color `green` from the search results
- `-c:g,r` to remove color `green` and `red` from the search results

## Cost

Cost can be searched for by doing:

- `cost:0` to add cards with cost `0` to the search results
- `cost:>=1` to add cards with cost >= `1` to the search results
- `cost:!=1` to add cards with cost not equaling `1` to the search results
- `-co:<=2` to remove cards with cost <= `2` from the search results

## Expansion

Expansion can be searched for by doing:

- `expansion:Quintessential` to add cards from `The Quintessential Quintuplets` or `The Quintessential Quintuplets 2` to the search results
- `expansion:"The Quintessential Quintuplets"` to add cards from only `The Quintessential Quintuplets` to the search results
- `expansion:"The Quintessential Quintuplets,Log Horizon"` to add cards from only `The Quintessential Quintuplets` and `Log Horizon` to the search results
- `-e:Quintessential` to remove cards from `The Quintessential Quintuplets` or `The Quintessential Quintuplets 2` from the search results

## Level

Level can be searched for by doing:

- `level:1` to add cards with level `1` to the search results
- `level:>=2` to add cards with level >= `2` to the search results
- `level:!=1` to add cards with level not equaling `1` to the search results
- `-l:<=3` to remove cards with level <= `3` from the search results

Notes: 

* Climax cards are considered to be level 0

## Name

You can search for cards by name by putting it bare into the search field. For example, searching for `Yotsuba` will return all cards with `Yotsuba` in the name.

You can also specify `n` or `name` for it. 

## Power

Power can be searched for by doing:

- `power:1000` to add cards with power `1000` to the search results
- `power:>=2000` to add cards with power >= `2000` to the search results
- `power:!=2000` to add cards with power not equaling `2000` to the search results
- `-p:<=3000` to remove cards with power <= `3000` from the search results

## Rarity

Rarity can be searched for by doing:

- `rarity:R` to add cards with rarity `R` to the search results
- `rarity:C` to add cards with rarity `C` to the search results
- `-r:SP` to remove cards with rarity `SP` from the search results

## Release

Release can be searched for by doing:

- `release:83` to add cards from set `83` (Quintessential Quintuplets) to the search results
- `-rel:83` to remove cards from set `83` (Quintessential Quintuplets) from the search results

## Set

Set can be searched for by doing:

- `set:5HY` to add cards from set `5HY` (Quintessential Quintuplets) to the search results
- `-set:5HY` to remove cards from set `5HY` (Quintessential Quintuplets) from the search results

## Side

Side can be searched for by doing:

- `side:W` to add cards from the Weiss side to the search results
- `-side:S` to remove cards from the Schwarz side from the search results

## Soul

Soul can be searched for by doing:

- `soul:1` to add cards with soul `1` to the search results
- `soul:>=2` to add cards with soul >= `2` to the search results
- `soul:!=2` to add cards with soul not equaling `2` to the search results
- `-s:<=3` to remove cards with soul <= `3` from the search results

## Type

Type can be searched for by doing:

- `type:Character` to add cards with type `Character` to the search results
- `type:Character,Event` to add cards with type `Character` or `Event` to the search results
- `-type:Climax` to remove cards with type `Climax` from the search results

## Trigger

Trigger can be searched for by doing:

- `trigger:draw` to add cards with trigger `draw` to the search results
- `trigger:gate,shot` to add cards with trigger `gate` or `shot` to the search results
- `trigger:none` to add cards with no trigger to the search results
- `-t:pool` to remove cards with trigger `pool` from the search results
