#!/bin/bash
# Check which theme prefixes exist in the catalog
# Run this after daily catalog updates to verify new themes are being found

echo "🎨 Theme Coverage Report"
echo "========================"
echo ""

themes=(
  "sw:Star Wars"
  "sh:Super Heroes"
  "smb:Super Mario"
  "min:Minecraft"
  "jw:Jurassic World"
  "mk:Monkie Kid"
  "for:Fortnite"
  "pok:Pokemon"
  "son:Sonic"
  "zel:Zelda"
  "onp:One Piece"
  "blu:Bluey"
  "pep:Peppa Pig"
  "gab:Gabby's Dollhouse"
  "wed:Wednesday"
  "wic:Wicked"
  "nik:Nike"
  "anc:Animal Crossing"
  "drz:DREAMZzz"
  "ide:Ideas"
  "ico:Icons"
  "dis:Disney"
  "hp:Harry Potter"
  "njo:Ninjago"
  "frnd:Friends"
  "mar:Marvel"
  "col:Collectible"
  "cas:Castle"
)

for theme in "${themes[@]}"; do
  prefix="${theme%%:*}"
  name="${theme##*:}"
  count=$(grep -c "no: '$prefix" lib/minifig-catalog.ts)

  if [ $count -eq 0 ]; then
    echo "❌ $name ($prefix): 0 found - check if prefix is correct"
  else
    echo "✅ $name ($prefix): $count minifigs"
  fi
done

echo ""
echo "📊 Total catalog size:"
grep -c "no: '" lib/minifig-catalog.ts
