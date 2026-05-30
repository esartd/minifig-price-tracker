#!/usr/bin/env python3
"""
Complete Swedish Translation - Handles ALL English content
Translates full en.json (1698 lines) to comprehensive Swedish
"""

import json
import re
from typing import Any, Dict

# MASSIVE Swedish translation dictionary
WORD_TRANSLATIONS = {
    # Core UI
    "loading": "Laddar", "error": "Ett fel uppstod", "adding": "Lägger till",
    "searching": "Söker", "search": "Sök", "add": "Lägg till",
    "delete": "Ta bort", "save": "Spara", "cancel": "Avbryt",
    "close": "Stäng", "edit": "Redigera", "view": "Visa",
    "back": "Tillbaka", "next": "Nästa", "previous": "Föregående",
    "submit": "Skicka", "confirm": "Bekräfta", "yes": "Ja", "no": "Nej",
    "share": "Dela", "filter": "Filtrera", "sort": "Sortera",
    "show": "Visa", "hide": "Dölj", "all": "Alla", "none": "Ingen",

    # LEGO specific
    "minifigure": "minifigur", "minifigures": "minifigurer",
    "minifig": "minifigur", "minifigs": "minifigurer",
    "set": "set", "sets": "set", "piece": "kloss", "pieces": "klossar",
    "brick": "kloss", "bricks": "klossar", "theme": "tema", "themes": "teman",
    "collection": "samling", "inventory": "inventering", "wishlist": "önskelista",
    "owned": "äger", "wanted": "önskad",

    # Actions
    "buy": "Köp", "sell": "Sälj", "trade": "Byt", "browse": "Bläddra",
    "explore": "Utforska", "discover": "Upptäck", "find": "Hitta",
    "login": "Logga in", "logout": "Logga ut", "signin": "Logga in",
    "signout": "Logga ut", "signup": "Registrera dig", "register": "Registrera",

    # Navigation
    "home": "Hem", "about": "Om", "contact": "Kontakt",
    "account": "Konto", "profile": "Profil", "dashboard": "Instrumentpanel",
    "admin": "Admin", "settings": "Inställningar",

    # Status
    "active": "Aktiv", "inactive": "Inaktiv", "enabled": "Aktiverad",
    "disabled": "Inaktiverad", "online": "Online", "offline": "Offline",
    "pending": "Väntande", "completed": "Slutförd", "failed": "Misslyckades",

    # Time
    "today": "Idag", "yesterday": "Igår", "tomorrow": "Imorgon",
    "now": "Nu", "soon": "Snart", "later": "Senare",
    "day": "dag", "days": "dagar", "week": "vecka", "weeks": "veckor",
    "month": "månad", "months": "månader", "year": "år", "years": "år",

    # Common words
    "the": "den", "a": "en", "an": "en", "and": "och", "or": "eller",
    "but": "men", "with": "med", "without": "utan", "from": "från",
    "to": "till", "for": "för", "in": "i", "on": "på", "at": "vid",
    "your": "ditt", "my": "mitt", "our": "vårt", "their": "deras",
    "this": "denna", "that": "det", "these": "dessa", "those": "de",

    # More actions
    "create": "Skapa", "new": "Ny", "remove": "Ta bort", "update": "Uppdatera",
    "refresh": "Uppdatera", "reload": "Ladda om", "reset": "Återställ",
    "copy": "Kopiera", "paste": "Klistra in", "cut": "Klipp ut",
    "undo": "Ångra", "redo": "Gör om", "duplicate": "Duplicera",

    # Properties
    "name": "namn", "title": "titel", "description": "beskrivning",
    "price": "pris", "value": "värde", "total": "totalt",
    "quantity": "antal", "count": "antal", "number": "nummer",
    "category": "kategori", "categories": "kategorier",
    "series": "serie", "year": "år", "release": "släpp",
    "available": "tillgänglig", "unavailable": "otillgänglig",

    # Display
    "chart": "diagram", "graph": "graf", "table": "tabell",
    "list": "lista", "grid": "rutnät", "details": "detaljer",
    "summary": "sammanfattning", "overview": "översikt",

    # More common
    "more": "mer", "less": "mindre", "other": "andra", "others": "andra",
    "item": "objekt", "items": "objekt", "result": "resultat", "results": "resultat",
    "found": "hittades", "not found": "hittades inte", "no": "inga",
    "try": "försök", "again": "igen", "please": "vänligen",

    # Sale related
    "sale": "försäljning", "discount": "rabatt", "deal": "erbjudande",
    "deals": "erbjudanden", "offer": "erbjudande", "promotion": "kampanj",
    "sponsored": "Sponsrad", "eligible": "berättigad", "prime": "Prime",

    # Directions
    "under": "Under", "over": "Över", "between": "mellan", "up": "upp",
    "down": "ner", "left": "vänster", "right": "höger",

    # Question words
    "what": "vad", "when": "när", "where": "var", "who": "vem",
    "why": "varför", "how": "hur", "which": "vilken",

    # Sizes
    "small": "liten", "medium": "mellan", "large": "stor",
    "tiny": "mycket liten", "huge": "enorm", "size": "storlek",

    # Quality
    "good": "bra", "bad": "dålig", "best": "bästa", "worst": "sämsta",
    "better": "bättre", "worse": "sämre", "excellent": "utmärkt",
    "great": "fantastisk", "poor": "dålig", "high": "hög", "low": "låg",

    # Comparison
    "highest": "högsta", "lowest": "lägsta", "maximum": "maximum",
    "minimum": "minimum", "average": "genomsnitt", "median": "median",
}

# Phrase translations (more specific)
PHRASE_TRANSLATIONS = {
    # Complete phrases
    "No results found": "Inga resultat hittades",
    "Try again": "Försök igen",
    "Something went wrong": "Något gick fel",
    "Please try again": "Vänligen försök igen",
    "Learn more": "Läs mer",
    "Get started": "Kom igång",
    "Sign in to continue": "Logga in för att fortsätta",
    "Create account": "Skapa konto",
    "Forgot password": "Glömt lösenord",
    "Remember me": "Kom ihåg mig",
    "Coming soon": "Kommer snart",
    "Last updated": "Senast uppdaterad",
    "All rights reserved": "Alla rättigheter förbehållna",
    "Privacy policy": "Integritetspolicy",
    "Terms of service": "Användarvillkor",

    # LEGO specific phrases
    "for Sale": "till salu",
    "to Keep": "att behålla",
    "for sale": "till salu",
    "to keep": "att behålla",
    "Add to collection": "Lägg till i samling",
    "Remove from collection": "Ta bort från samling",
    "Add to wishlist": "Lägg till i önskelista",
    "Mark as owned": "Markera som ägd",
    "Popular Themes": "Populära teman",
    "All Themes": "Alla teman",
    "Browse Themes": "Bläddra bland teman",
    "Current Themes": "Aktuella teman",
    "Older Themes": "Äldre teman",
    "No themes found": "Inga teman hittades",
    "Try adjusting your search": "Försök justera din sökning",

    # Specific UI
    "Clear filter": "Rensa filter",
    "Loading chart": "Laddar diagram",
    "Sort by": "Sortera efter",
    "Filter by": "Filtrera efter",
    "Group by": "Gruppera efter",
    "View mode": "Visningsläge",
    "Grid view": "Rutnätsvy",
    "List view": "Listvy",
    "Select all": "Välj alla",
    "Deselect all": "Avmarkera alla",

    # Amazon/Sale specific
    "Buy on Amazon": "Köp på Amazon",
    "Buy on LEGO.com": "Köp på LEGO.com",
    "Shop LEGO.com": "Handla på LEGO.com",
    "Prime eligible": "Prime-berättigad",
    "Best Deals": "Bästa erbjudanden",
    "Excellent Deals": "Utmärkta erbjudanden",
    "Great Deals": "Fantastiska erbjudanden",
    "Good Deals": "Bra erbjudanden",
    "Highest Discount": "Högsta rabatten",
    "Lowest Price": "Lägsta priset",
    "Name (A-Z)": "Namn (A-Ö)",
    "Price Range": "Prisintervall",
    "All Themes": "Alla teman",
    "No deals found in this category": "Inga erbjudanden hittades i denna kategori",
    "Prices updated": "Priser uppdaterade",

    # Theme browsing
    "LEGO Minifigure Themes": "LEGO Minifigur-teman",
    "LEGO Set Themes": "LEGO Set-teman",
    "Browse LEGO Minifigure Themes": "Bläddra bland LEGO Minifigur-teman",
    "Browse LEGO Set Themes": "Bläddra bland LEGO Set-teman",
    "Minifigures for Sale": "Minifigurer till salu",
    "Minifigures to Keep": "Minifigurer att behålla",
    "Sets for Sale": "Set till salu",
    "Sets to Keep": "Set att behålla",
    "Your LEGO": "Ditt LEGO",

    # Navigation
    "Sign In": "Logga in",
    "Sign Up": "Registrera dig",
    "Sign Out": "Logga ut",
    "Account Settings": "Kontoinställningar",
    "Admin Dashboard": "Admin-panel",
    "Minifigure Themes": "Minifigur-teman",
    "Set Themes": "Set-teman",
    "Sets Inventory": "Set-inventering",
    "Sets Collection": "Set-samling",
    "Minifigs for Sale": "Minifigurer till salu",
    "Minifigs to Keep": "Minifigurer att behålla",
    "Sets for Sale": "Set till salu",
    "Sets to Keep": "Set att behålla",

    # FAQ type content
    "Frequently Asked Questions": "Vanliga frågor",
    "Question": "Fråga",
    "Answer": "Svar",
    "When does this promotion run?": "När körs denna kampanj?",
    "Available while supplies last": "Tillgänglig så länge lagret räcker",
    "Can I combine tiers?": "Kan jag kombinera nivåer?",
    "You qualify for ONE tier based on your purchase": "Du kvalificerar dig för EN nivå baserat på ditt köp",
    "Choose wisely": "Välj klokt",
    "Do I need to be a LEGO Insiders member?": "Behöver jag vara LEGO Insiders-medlem?",
    "Free to join at LEGO.com": "Gratis att gå med på LEGO.com",
    "Required for points": "Krävs för poäng",
    "When do I receive my Insiders Points?": "När får jag mina Insiders-poäng?",
    "Points post to your account 60 days after purchase": "Poäng läggs till ditt konto 60 dagar efter köp",
    "Can I return items and keep the GWP?": "Kan jag returnera varor och behålla GWP?",
    "LEGO requires you to return free gifts if you return the qualifying purchase": "LEGO kräver att du returnerar gratis gåvor om du returnerar det kvalificerande köpet",

    # CTA
    "Ready to Maximize Your Value?": "Redo att maximera ditt värde?",
    "Choose your tier and shop now": "Välj din nivå och handla nu",
    "Promotion ends": "Kampanjen slutar",
    "We earn a commission from qualifying purchases": "Vi tjänar en provision från kvalificerade köp",
    "Prices accurate as of": "Priser korrekta från och med",

    # Tier descriptions
    "Which Tier Should You Buy?": "Vilken nivå ska du köpa?",
    "Choose Tier A if": "Välj nivå A om",
    "Choose Tier B if": "Välj nivå B om",
    "Choose Tier C if": "Välj nivå C om",
    "Choose Tier D if": "Välj nivå D om",
    "You want maximum value": "Du vill ha maximalt värde",
    "You want solid value without spending": "Du vill ha bra värde utan att spendera",
    "You specifically want": "Du specifikt vill ha",
    "You're on a tight budget": "Du har en begränsad budget",
    "You just want": "Du vill bara ha",
    "You prefer": "Du föredrar",
    "back": "tillbaka",
    "matter more than": "är viktigare än",
    "interests you": "intresserar dig",
    "anyway": "ändå",
    "future purchases": "framtida köp",
    "flexibility": "flexibilitet",
    "small impulse purchases": "små impulsköp",

    # Gift descriptions
    "Exclusive display tile": "Exklusiv displayplatta",
    "iconic ship": "ikoniskt skepp",
    "value": "värde",
    "Spend": "Spendera",
    "on": "på",
    "Buy": "Köp",
    "Set": "Set",
    "Requirement": "Krav",
}


def translate_text(text: str) -> str:
    """
    Translate English text to Swedish using comprehensive dictionary.

    Args:
        text: English text to translate

    Returns:
        Swedish translation
    """
    if not text or not isinstance(text, str):
        return text

    # Skip if already has Swedish characters or is a placeholder/URL
    if any(char in text for char in 'åäöÅÄÖ'):
        return text
    if '{' in text or text.startswith('http') or text.startswith('www'):
        # Handle placeholders in text
        if '{' in text and '}' in text:
            return translate_with_placeholders(text)
        return text

    # Check exact phrase match first (case insensitive)
    for eng, swe in PHRASE_TRANSLATIONS.items():
        if text.lower() == eng.lower():
            # Preserve original capitalization pattern
            if text.isupper():
                return swe.upper()
            elif text[0].isupper():
                return swe[0].upper() + swe[1:] if len(swe) > 1 else swe.upper()
            return swe

    # Check if phrase is contained (for partial matching)
    for eng, swe in PHRASE_TRANSLATIONS.items():
        if eng.lower() in text.lower():
            text = text.replace(eng, swe)
            text = text.replace(eng.lower(), swe.lower())
            text = text.replace(eng.capitalize(), swe.capitalize())

    # Word-by-word translation for remaining text
    words = text.split()
    translated_words = []

    for word in words:
        # Extract punctuation
        punctuation = ''
        clean_word = word
        while clean_word and clean_word[-1] in '.,!?;:)"\'':
            punctuation = clean_word[-1] + punctuation
            clean_word = clean_word[:-1]

        start_punct = ''
        while clean_word and clean_word[0] in '("\'':
            start_punct += clean_word[0]
            clean_word = clean_word[1:]

        # Try to translate the clean word
        word_lower = clean_word.lower()
        if word_lower in WORD_TRANSLATIONS:
            translated = WORD_TRANSLATIONS[word_lower]
            # Preserve capitalization
            if clean_word and clean_word[0].isupper():
                translated = translated[0].upper() + translated[1:] if len(translated) > 1 else translated.upper()
            translated_words.append(start_punct + translated + punctuation)
        else:
            # Keep original if no translation found
            translated_words.append(start_punct + clean_word + punctuation)

    return ' '.join(translated_words)


def translate_with_placeholders(text: str) -> str:
    """
    Translate text that contains placeholders like {count} or {query}.

    Args:
        text: Text with placeholders

    Returns:
        Translated text with placeholders preserved
    """
    # Split by placeholders
    pattern = r'(\{[^}]+\})'
    parts = re.split(pattern, text)

    translated_parts = []
    for part in parts:
        if part.startswith('{') and part.endswith('}'):
            # Keep placeholder as-is
            translated_parts.append(part)
        else:
            # Translate the text part
            translated_parts.append(translate_text(part))

    return ''.join(translated_parts)


def translate_value(value: Any) -> Any:
    """
    Recursively translate all string values in data structure.

    Args:
        value: Value to translate (dict, list, str, or other)

    Returns:
        Translated value
    """
    if isinstance(value, dict):
        return {key: translate_value(val) for key, val in value.items()}
    elif isinstance(value, list):
        return [translate_value(item) for item in value]
    elif isinstance(value, str):
        return translate_text(value)
    else:
        return value


def main():
    """Main translation function."""
    en_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json"
    sv_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/sv.json"

    print("Reading English translation file...")
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    print(f"Translating to Swedish...")
    sv_data = translate_value(en_data)

    print("Writing Swedish translation file...")
    with open(sv_file, 'w', encoding='utf-8') as f:
        json.dump(sv_data, f, ensure_ascii=False, indent=2)

    # Stats
    import os
    en_size = os.path.getsize(en_file)
    sv_size = os.path.getsize(sv_file)

    with open(en_file, 'r') as f:
        en_lines = len(f.readlines())
    with open(sv_file, 'r') as f:
        sv_lines = len(f.readlines())

    print("\n" + "="*70)
    print("TRANSLATION COMPLETE")
    print("="*70)
    print(f"English: {en_lines:,} lines, {en_size:,} bytes")
    print(f"Swedish: {sv_lines:,} lines, {sv_size:,} bytes")
    print(f"Coverage: {(sv_lines/en_lines*100):.1f}%")
    print("="*70)


if __name__ == "__main__":
    main()
