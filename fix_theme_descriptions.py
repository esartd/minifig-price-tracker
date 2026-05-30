#!/usr/bin/env python3
"""
Fix mixed-language theme descriptions in Italian and Dutch translations
Reads existing files, identifies mixed content, applies proper translations
"""

import json
import re

def fix_italian_themes():
    """Fix Italian theme descriptions that contain English"""
    print("Fixing Italian theme descriptions...")

    with open('/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/it.json', 'r', encoding='utf-8') as f:
        it_data = json.load(f)

    # Common English-to-Italian translations for theme descriptions
    replacements = {
        # Common phrases
        "One of the most": "Uno dei più",
        "iconic": "iconici",
        "franchises": "franchise",
        "galaxy": "galassia",
        "has been captivating": "ha affascinato",
        "fans since": "fan dal",
        "and our": "e le nostre",
        "minifigures": "minifigure",
        "minifigure": "minifigurines",
        "bring that": "portano quella",
        "galaxy far, far away": "galassia lontana lontana",
        "right to your": "direttamente alla tua",
        "collection": "collezione",
        "From": "Da",
        "to": "a",
        "collect": "colleziona",
        "heroes": "eroi",
        "villains": "cattivi",
        "characters": "personaggi",
        "beloved": "amati",
        "legendary": "leggendari",
        "epic": "epici",
        "adventures": "avventure",
        "build": "costruisci",
        "builders": "costruttori",
        "Perfect for": "Perfetto per",
        "collectors": "collezionisti",
        "fans": "fan",
        "who love": "che amano",
        "Explore": "Esplora",
        "Discover": "Scopri",
        "Journey": "Viaggio",
        "Join": "Unisciti",
        "features": "caratteristiche",
        "includes": "include",
        "sets": "set",
        "with": "con",
        "and": "e",
        "the": "il",
        "this": "questo",
        "these": "questi",
        "all": "tutti",
        "every": "ogni",
        "each": "ogni",
        "that": "che",
        "theme": "tema",
        "series": "serie",
        "world": "mondo",
        "universe": "universo",
    }

    # Fix theme descriptions if they exist
    if 'themes' in it_data and 'descriptions' in it_data['themes']:
        descriptions = it_data['themes']['descriptions']
        for theme_name, description in descriptions.items():
            if isinstance(description, str):
                # Apply replacements
                fixed_desc = description
                for eng, ita in replacements.items():
                    # Case-insensitive replacement
                    fixed_desc = re.sub(r'\b' + re.escape(eng) + r'\b', ita, fixed_desc, flags=re.IGNORECASE)

                descriptions[theme_name] = fixed_desc

    # Also check themeDescriptions section
    if 'themeDescriptions' in it_data:
        for theme_name, description in it_data['themeDescriptions'].items():
            if isinstance(description, str):
                fixed_desc = description
                for eng, ita in replacements.items():
                    fixed_desc = re.sub(r'\b' + re.escape(eng) + r'\b', ita, fixed_desc, flags=re.IGNORECASE)

                it_data['themeDescriptions'][theme_name] = fixed_desc

    with open('/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/it.json', 'w', encoding='utf-8') as f:
        json.dump(it_data, f, ensure_ascii=False, indent=2)

    print("✓ Italian theme descriptions fixed")

def fix_dutch_themes():
    """Fix Dutch theme descriptions that contain English"""
    print("Fixing Dutch theme descriptions...")

    with open('/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/nl.json', 'r', encoding='utf-8') as f:
        nl_data = json.load(f)

    # Common English-to-Dutch translations
    replacements = {
        "One of the most": "Een van de meest",
        "iconic": "iconische",
        "franchises": "franchises",
        "galaxy": "melkweg",
        "has been captivating": "heeft gefascineerd",
        "fans since": "fans sinds",
        "and our": "en onze",
        "minifigures": "minifiguren",
        "minifigure": "minifiguur",
        "bring that": "brengen die",
        "galaxy far, far away": "verre, verre melkweg",
        "right to your": "direct naar je",
        "collection": "collectie",
        "From": "Van",
        "to": "naar",
        "collect": "verzamel",
        "heroes": "helden",
        "villains": "schurken",
        "characters": "personages",
        "beloved": "geliefde",
        "legendary": "legendarische",
        "epic": "epische",
        "adventures": "avonturen",
        "build": "bouw",
        "builders": "bouwers",
        "Perfect for": "Perfect voor",
        "collectors": "verzamelaars",
        "fans": "fans",
        "who love": "die houden van",
        "Explore": "Verken",
        "Discover": "Ontdek",
        "Journey": "Reis",
        "Join": "Sluit je aan",
        "features": "kenmerken",
        "includes": "bevat",
        "sets": "sets",
        "with": "met",
        "and": "en",
        "the": "de",
        "this": "deze",
        "these": "deze",
        "all": "alle",
        "every": "elke",
        "each": "elke",
        "that": "dat",
        "theme": "thema",
        "series": "serie",
        "world": "wereld",
        "universe": "universum",
        "don't": "niet",
        "fit": "passen",
        "traditional": "traditionele",
        "categories": "categorieën",
    }

    # Fix theme descriptions
    if 'themes' in nl_data and 'descriptions' in nl_data['themes']:
        descriptions = nl_data['themes']['descriptions']
        for theme_name, description in descriptions.items():
            if isinstance(description, str):
                fixed_desc = description
                for eng, dut in replacements.items():
                    fixed_desc = re.sub(r'\b' + re.escape(eng) + r'\b', dut, fixed_desc, flags=re.IGNORECASE)

                descriptions[theme_name] = fixed_desc

    if 'themeDescriptions' in nl_data:
        for theme_name, description in nl_data['themeDescriptions'].items():
            if isinstance(description, str):
                fixed_desc = description
                for eng, dut in replacements.items():
                    fixed_desc = re.sub(r'\b' + re.escape(eng) + r'\b', dut, fixed_desc, flags=re.IGNORECASE)

                nl_data['themeDescriptions'][theme_name] = fixed_desc

    with open('/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/nl.json', 'w', encoding='utf-8') as f:
        json.dump(nl_data, f, ensure_ascii=False, indent=2)

    print("✓ Dutch theme descriptions fixed")

if __name__ == "__main__":
    print("Fixing theme descriptions...")
    print("=" * 60)

    fix_italian_themes()
    fix_dutch_themes()

    print("=" * 60)
    print("Theme descriptions fixed!")

    import os
    for lang in ['it', 'nl']:
        path = f'/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/{lang}.json'
        size = os.path.getsize(path) / 1024
        with open(path, 'r') as f:
            lines = len(f.readlines())
        print(f"  {lang}.json: {lines} lines, {size:.1f} KB")
