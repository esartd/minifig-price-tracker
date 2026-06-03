#!/usr/bin/env python3
"""
Fix Swedish Translation Issues
Corrects specific broken translations in sv.json
"""

import json

def fix_translation(text):
    """Fix common translation errors."""
    if not isinstance(text, str):
        return text

    # Fix specific broken patterns
    fixes = {
        # Broken word formations
        "Minifigururs": "Minifigurer",
        "minifigururs": "minifigurer",
        "Minifigurs": "Minifigurer",
        "minifigurs": "minifigurer",
        "Minifigurur": "Minifigur",
        "minifigurur": "minifigur",

        # Navigation fixes
        "For Rea": "Till salu",
        "To Keep": "Att behålla",
        "Keep": "Behåll",

        # Theme words
        "Temas": "Teman",
        "temas": "teman",
        "Tema's": "Temans",
        "tema's": "temans",

        # Common UI
        "chart": "diagram",
        "Chart": "Diagram",
        "Nej results": "Inga resultat",
        "results found": "resultat hittades",
        "found for": "hittades för",
        "Sortera By": "Sortera efter",
        "sort by": "sortera efter",
        "Filter by": "Filtrera efter",
        "filter by": "filtrera efter",
        "Laddar chart": "Laddar diagram",
        "Laddar Chart": "Laddar diagram",

        # Plurals
        "set in this": "set i detta",
        "with set released": "med set släppta",
        "from föregående years": "från tidigare år",
        "More Temas": "Fler teman",

        # Broken word endings (common pattern)
        "nej": "ne",  # Fix broken "no" translations
        "Nej": "Inga",  # In context of "No results"
        "lägg tillitions": "tillägg",

        # Fix mangled words
        "innejvative": "innovativ",
        "dinejsaur": "dinosaur",
        "expredigeraions": "expeditioner",
        "nejstalgic": "nostalgisk",
        "Infernej": "Inferno",
        "technejlogy": "teknologi",
        "snejwmobiles": "snöskotrar",
        "Nejok": "Nook",
        "phenejmenejn": "fenomen",
        "especiallay": "särskilt",
        "wallas": "väggar",
        "gallaeries": "gallerier",
        "allaowing": "tillåter",

        # Common phrase fixes
        "Explore {themeCount} temas with {setCount} LEGO set": "Utforska {themeCount} teman med {setCount} LEGO-set",
        "Show {count} More Temas": "Visa {count} fler teman",
        "{count} minifigurs": "{count} minifigurer",
        "{count} set in this tema": "{count} set i detta tema",
        "{count} subcategories": "{count} underkategorier",
        "{count} serie": "{count} serier",
        "+{count} more": "+{count} fler",

        # Long text fixes
        "don't fit": "inte passar",
        "doesn't fit": "passar inte",
        "that showcase": "som visar upp",
        "who love": "som älskar",
        "while reducing": "samtidigt som den minskar",
        "that snap together": "som snäpps ihop",
        "ready to graduate": "redo att gå vidare",
        "with beloved": "med älskade",

        # Plural forms
        "minifigure": "minifigur",
        "minifigures": "minifigurer",
        "# minifigurr": "# minifigurer",
        "# minifigur}": "# minifigurer}",
    }

    result = text
    for wrong, correct in fixes.items():
        result = result.replace(wrong, correct)

    return result


def fix_dict(obj):
    """Recursively fix all strings in dict."""
    if isinstance(obj, dict):
        return {k: fix_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [fix_dict(item) for item in obj]
    elif isinstance(obj, str):
        return fix_translation(obj)
    return obj


def main():
    sv_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/sv.json"

    print("Reading Swedish file...")
    with open(sv_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("Fixing translation issues...")
    fixed = fix_dict(data)

    print("Writing corrected file...")
    with open(sv_file, 'w', encoding='utf-8') as f:
        json.dump(fixed, f, ensure_ascii=False, indent=2)

    import os
    size = os.path.getsize(sv_file)
    with open(sv_file) as f:
        lines = len(f.readlines())

    print(f"\n✓ Fixed! {lines:,} lines, {size/1024:.1f} KB")


if __name__ == "__main__":
    main()
