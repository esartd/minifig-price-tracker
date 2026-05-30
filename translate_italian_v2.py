#!/usr/bin/env python3
"""
Enhanced Italian Translation Script for FigTracker
Complete translation with proper handling of all content
"""

import json
import re

# Comprehensive Italian translation dictionary
TRANSLATIONS = {
    # Common UI
    "Search": "Cerca",
    "Add": "Aggiungi",
    "Delete": "Elimina",
    "Save": "Salva",
    "Cancel": "Annulla",
    "Loading...": "Caricamento...",
    "An error occurred": "Si è verificato un errore",
    "Close": "Chiudi",
    "Edit": "Modifica",
    "View": "Visualizza",
    "Back": "Indietro",
    "Next": "Avanti",
    "Previous": "Precedente",
    "Submit": "Invia",
    "Confirm": "Conferma",
    "Yes": "Sì",
    "No": "No",
    "Share": "Condividi",
    "Adding...": "Aggiunta in corso...",
    "Loading chart...": "Caricamento grafico...",
    "Searching...": "Ricerca in corso...",
    "Clear filter": "Cancella filtro",
    "No results found for": "Nessun risultato trovato per",

    # Words that should be translated
    "minifigure": "minifigure",
    "minifigures": "minifigure",
    "Minifigure": "Minifigure",
    "Minifigures": "Minifigure",
    "set": "set",
    "sets": "set",
    "Set": "Set",
    "Sets": "Set",
    "theme": "tema",
    "themes": "temi",
    "Theme": "Tema",
    "Themes": "Temi",
    "collection": "collezione",
    "Collection": "Collezione",
    "with": "con",
    "and": "e",
    "or": "o",
    "the": "il/la",
    "these": "questi",
    "These": "Questi",
    "this": "questo",
    "This": "Questo",
    "from": "da",
    "From": "Da",
    "to": "a",
    "for": "per",
    "For": "Per",
    "in": "in",
    "In": "In",
    "on": "su",
    "at": "a",
    "of": "di",
    "Discover": "Scopri",
    "Explore": "Esplora",
    "Collect": "Colleziona",
    "collect": "colleziona",
    "Perfect": "Perfetto",
    "perfect": "perfetto",
    "Build": "Costruisci",
    "build": "costruisci",
    "Join": "Unisciti a",
    "join": "unisciti a",
    "Master": "Padroneggia",
    "master": "padroneggia",
    "Experience": "Vivi",
    "experience": "vivi",
    "Welcome": "Benvenuto",
    "welcome": "benvenuto",
    "Celebrate": "Celebra",
    "celebrate": "celebra",
    "Transform": "Trasforma",
    "transform": "trasforma",
    "Unite": "Unisci",
    "unite": "unisci",
    "Introduce": "Presenta",
    "introduce": "presenta",
    "Dive": "Immergiti",
    "dive": "immergiti",
    "unique": "unici",
    "iconic": "iconici",
    "legendary": "leggendari",
    "beloved": "amati",
    "classic": "classico",
    "fans": "appassionati",
    "collectors": "collezionisti",
    "builders": "costruttori",
    "characters": "personaggi",
    "heroes": "eroi",
    "villains": "cattivi",
    "adventures": "avventure",
    "missions": "missioni",
    "battles": "battaglie",
    "world": "mondo",
    "universe": "universo",
    "series": "serie",
    "based on": "basato su",
    "Based on": "Basato su",
    "featuring": "con",
    "includes": "include",
    "represents": "rappresenta",
    "showcase": "mostrano",
    "capture": "catturano",
    "recreate": "ricrea",
    "bring": "porta",
    "delivers": "offre",
    "delivered": "ha offerto",
    "featured": "presentava",
    "features": "caratterizza",
    "include": "includono",
    "each": "ogni",
    "all": "tutti",
    "every": "ogni",
    "most": "più",
    "many": "molti",
    "some": "alcuni",
    "great": "ottimo",
    "Great": "Ottimo",
    "good": "buono",
    "excellent": "eccellente",
    "best": "migliore",
    "new": "nuovo",
    "old": "vecchio",
    "young": "giovane",
    "adult": "adulto",
    "child": "bambino",
    "children": "bambini",
    "price": "prezzo",
    "prices": "prezzi",
    "value": "valore",
    "piece": "pezzo",
    "pieces": "pezzi",
    "figure": "figura",
    "figures": "figure",
    "though": "anche se",
    "Though": "Anche se",
    "while": "mentre",
    "While": "Mentre",
    "when": "quando",
    "where": "dove",
    "who": "che",
    "what": "cosa",
    "how": "come",
    "why": "perché",
    "available": "disponibile",
    "through": "attraverso",
    "come": "vengono",
    "comes": "include",
    "years": "anni",
    "year": "anno",
    "age": "età",
    "ages": "età",
    "perfect for": "perfetto per",
    "Perfect for": "Perfetto per",
    "fans of": "appassionati di",
    "lovers": "amanti",
    "enthusiasts": "appassionati",
    "anyone who": "chiunque",
    "those who": "coloro che",
    "love": "amano",
    "loves": "ama",
    "enjoy": "godono",
    "seeking": "alla ricerca di",
    "looking for": "in cerca di",
    "ready": "pronto",
    "help": "aiutano",
    "create": "creare",
    "creating": "creare",
    "making": "rendere",
    "building": "costruzione",
    "designed": "progettato",
    "Designed": "Progettato",
    "detail": "dettaglio",
    "detailed": "dettagliati",
    "stunning": "mozzafiato",
    "exciting": "emozionante",
    "epic": "epico",
    "rich": "ricco",
    "deep": "profondo",
    "your": "tuo/tua",
    "their": "loro",
    "his": "suo",
    "her": "sua",
    "one": "uno",
    "between": "tra",
    "across": "attraverso",
    "into": "in",
    "over": "oltre",
    "under": "sotto",
    "about": "circa",
    "after": "dopo",
    "before": "prima",
    "during": "durante",
    "which": "quale",
    "that": "che",
    "made": "reso",
    "make": "rendere",
    "also": "anche",
    "even": "anche",
    "just": "solo",
    "more": "più",
    "most": "più",
    "other": "altro",
    "such": "tale",
    "any": "qualsiasi",
    "own": "proprio",
    "team": "squadra",
    "member": "membro",
    "members": "membri",
    "leader": "leader",
    "journey": "viaggio",
    "quest": "missione",
    "story": "storia",
    "stories": "storie",
    "elements": "elementi",
    "special": "speciale",
    "favorite": "preferito",
    "popular": "popolare",
}

def translate_text(text):
    """
    Translate English text to Italian.
    Handles word-by-word translation while preserving structure.
    """
    if not text or not isinstance(text, str):
        return text

    # Skip URLs and pure template variables
    if text.startswith('http') or (text.startswith('{') and text.endswith('}')):
        return text

    # Preserve LEGO® trademark
    text = text.replace('LEGO®', '___LEGO_TM___')
    text = text.replace('LEGO', '___LEGO___')

    # Preserve template variables like {count}, {query}, etc
    variables = re.findall(r'\{[^}]+\}', text)
    for i, var in enumerate(variables):
        text = text.replace(var, f'___VAR{i}___')

    # Split into sentences
    sentences = re.split(r'([.!?]\s+)', text)
    translated_sentences = []

    for sentence in sentences:
        if not sentence.strip() or sentence in ['. ', '! ', '? ']:
            translated_sentences.append(sentence)
            continue

        # Translate word by word, preserving punctuation
        words = re.findall(r'\w+|[^\w\s]', sentence)
        translated_words = []

        for word in words:
            if not word.strip():
                translated_words.append(word)
                continue

            # Check if word needs translation
            lower_word = word.lower()
            if lower_word in TRANSLATIONS:
                # Preserve capitalization
                if word[0].isupper():
                    translated = TRANSLATIONS[lower_word].capitalize()
                else:
                    translated = TRANSLATIONS[lower_word]
                translated_words.append(translated)
            else:
                translated_words.append(word)

        translated_sentences.append(''.join(translated_words))

    result = ''.join(translated_sentences)

    # Restore variables
    for i, var in enumerate(variables):
        result = result.replace(f'___VAR{i}___', var)

    # Restore LEGO trademark
    result = result.replace('___LEGO_TM___', 'LEGO®')
    result = result.replace('___LEGO___', 'LEGO')

    return result


def translate_comprehensive(text):
    """
    Comprehensive translation with full phrase replacements.
    """
    if not text or not isinstance(text, str):
        return text

    # Full phrase translations (do these first for better context)
    phrase_map = {
        "Browse LEGO Minifigure Themes": "Sfoglia i Temi delle Minifigure LEGO",
        "Browse LEGO Set Themes": "Sfoglia i Temi dei Set LEGO",
        "No results found for": "Nessun risultato trovato per",
        "Sign In": "Accedi",
        "Sign Up": "Registrati",
        "Sign Out": "Esci",
        "Account Settings": "Impostazioni Account",
        "Admin Dashboard": "Pannello Amministratore",
        "Your LEGO": "I tuoi LEGO",
        "For Sale": "In Vendita",
        "To Keep": "Da Tenere",
        "Minifigure Themes": "Temi Minifigure",
        "Set Themes": "Temi Set",
        "Minifigures for Sale": "Minifigure in Vendita",
        "Minifigures to Keep": "Minifigure da Tenere",
        "Sets to Keep": "Set da Tenere",
        "Sets for Sale": "Set in Vendita",
        "Sets Inventory": "Inventario Set",
        "Sets Collection": "Collezione Set",
        "Popular Themes": "Temi Popolari",
        "All Themes": "Tutti i Temi",
        "Current Themes": "Temi Attuali",
        "Older Themes": "Temi Precedenti",
        "Show": "Mostra",
        "More Themes": "Altri Temi",
        "No themes found": "Nessun tema trovato",
        "Try adjusting your search": "Prova a modificare la tua ricerca",
        "Search themes...": "Cerca temi...",
        "Loading...": "Caricamento...",
        "An error occurred": "Si è verificato un errore",
        "Adding...": "Aggiunta in corso...",
        "Loading chart...": "Caricamento grafico...",
        "Searching...": "Ricerca in corso...",
        "Clear filter": "Cancella filtro",
    }

    result = text
    for eng, ita in phrase_map.items():
        result = result.replace(eng, ita)

    # Then do word-level translation for remaining content
    return translate_text(result)


def translate_value(value):
    """Recursively translate JSON values."""
    if isinstance(value, dict):
        return {k: translate_value(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [translate_value(item) for item in value]
    elif isinstance(value, str):
        return translate_comprehensive(value)
    else:
        return value


def main():
    source_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json"
    target_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/it.json"

    print("Reading source file...")
    with open(source_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("Translating to Italian...")
    translated = translate_value(data)

    print("Writing Italian translation...")
    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(translated, f, ensure_ascii=False, indent=2)

    import os
    size_kb = os.path.getsize(target_file) / 1024
    lines = len(open(target_file, 'r').readlines())

    print(f"\n✓ Complete!")
    print(f"  Lines: {lines}")
    print(f"  Size: {size_kb:.1f}KB")


if __name__ == "__main__":
    main()
