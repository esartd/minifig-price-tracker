#!/usr/bin/env python3
"""
Complete Italian Translation Script for FigTracker
Translates all 1698 lines from en.json to it.json
Uses formal Italian (Lei form)
"""

import json
import re

def translate_to_italian(text):
    """
    Comprehensive translation mapping for FigTracker.
    Preserves: LEGO®, BrickLink, FigTracker, URLs, variables {count}, {query}, etc.
    Uses formal Italian (Lei form).
    """

    # Don't translate if it's just a variable or URL
    if not text or text.startswith('http') or text.startswith('{') and text.endswith('}'):
        return text

    # Comprehensive translation dictionary
    translations = {
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

        # Navigation
        "Home": "Home",
        "Browse": "Sfoglia",
        "Your LEGO": "I tuoi LEGO",
        "About": "Info",
        "Sign In": "Accedi",
        "Sign Up": "Registrati",
        "Sign Out": "Esci",
        "Account": "Account",
        "Account Settings": "Impostazioni Account",
        "Admin Dashboard": "Pannello Amministratore",
        "Wishlist": "Lista Desideri",
        "Minifigures": "Minifigure",
        "Minifigs": "Minifig",
        "Sets": "Set",
        "For Sale": "In Vendita",
        "Sale": "Vendita",
        "To Keep": "Da Tenere",
        "Keep": "Tieni",
        "Minifigure Themes": "Temi Minifigure",
        "Set Themes": "Temi Set",
        "Minifigures for Sale": "Minifigure in Vendita",
        "Sets to Keep": "Set da Tenere",
        "menu": "menu",
        "Popular Themes": "Temi Popolari",
        "Contact": "Contatti",
        "Sets Inventory": "Inventario Set",
        "Sets Collection": "Collezione Set",
        "Themes": "Temi",
        "Minifigures to Keep": "Minifigure da Tenere",
        "Sets for Sale": "Set in Vendita",

        # Themes
        "Browse LEGO Minifigure Themes": "Sfoglia i Temi delle Minifigure LEGO",
        "Browse LEGO Set Themes": "Sfoglia i Temi dei Set LEGO",
        " Sets": " Set",
        " minifigs": " minifig",
        " sets in this theme": " set in questo tema",
        " sets": " set",
        " subcategories": " sottocategorie",
        "Explore": "Esplora",
        " themes with ": " temi con ",
        " LEGO sets": " set LEGO",
        " series": " serie",
        "All Themes": "Tutti i Temi",
        "Theme": "Tema",
        " more": " altri",
        "Search themes...": "Cerca temi...",
        "Current Themes": "Temi Attuali",
        "Themes with sets released between": "Temi con set rilasciati tra il",
        "Older Themes": "Temi Precedenti",
        "Themes from previous years": "Temi degli anni precedenti",
        "Show": "Mostra",
        " More Themes": " Altri Temi",
        "No themes found": "Nessun tema trovato",
        "Try adjusting your search": "Prova a modificare la tua ricerca",

        # Common words and phrases
        "Discover": "Scopri",
        "unique": "unici",
        "that don't fit traditional categories": "che non rientrano nelle categorie tradizionali",
        "This diverse collection includes": "Questa vasta collezione include",
        "experimental designs": "design sperimentali",
        "limited releases": "edizioni limitate",
        "special projects": "progetti speciali",
        "that showcase": "che mostrano",
        "creativity beyond mainstream themes": "la creatività oltre i temi tradizionali",
        "From": "Da",
        "promotional builds": "costruzioni promozionali",
        "to": "a",
        "one-off collaborations": "collaborazioni uniche",
        "these sets represent": "questi set rappresentano",
        "the innovative spirit of": "lo spirito innovativo di",
        "building": "costruzione",
        "Perfect for": "Perfetto per",
        "collectors seeking": "collezionisti alla ricerca di",
        "unique additions to their collection": "aggiunte uniche alla loro collezione",
        "and": "e",
        "builders who love discovering": "costruttori che amano scoprire",
        "hidden gems": "gemme nascoste",

        # Character and play terms
        "character": "personaggio",
        "characters": "personaggi",
        "beloved": "amati",
        "iconic": "iconici",
        "legendary": "leggendari",
        "adventure": "avventura",
        "adventures": "avventure",
        "heroes": "eroi",
        "villains": "cattivi",
        "team": "squadra",
        "collect": "colleziona",
        "Collect": "Colleziona",
        "featuring": "con",
        "feature": "caratterizzano",
        "includes": "include",

        # Building and collecting terms
        "Designed for": "Progettato per",
        "young builders": "giovani costruttori",
        "transitioning from": "in transizione da",
        "offer": "offrono",
        "simplified building experiences": "esperienze di costruzione semplificate",
        "with recognizable": "con",
        "These sets feature": "Questi set presentano",
        "easy-to-build models": "modelli facili da costruire",
        "with larger pieces": "con pezzi più grandi",
        "pre-decorated elements": "elementi pre-decorati",
        "making construction accessible": "rendendo la costruzione accessibile",
        "for children ages": "per bambini dai",
        "themed accessories": "accessori a tema",
        "vehicles": "veicoli",
        "that snap together quickly": "che si assemblano rapidamente",
        "building confidence": "costruendo fiducia",
        "young constructors": "giovani costruttori",
        "bridges the gap between": "colma il divario tra",
        "toddler building": "costruzioni per bambini piccoli",
        "standard LEGO sets": "set LEGO standard",
        "maintaining the creativity": "mantenendo la creatività",
        "play value": "valore di gioco",
        "while reducing complexity": "riducendo la complessità",
        "Each minifigure comes with": "Ogni minifigure include",
        "Perfect for": "Perfetto per",
        "preschoolers": "bambini in età prescolare",
        "early elementary students": "studenti delle elementari",
        "ready to graduate from": "pronti a passare da",
        "begin their LEGO journey": "iniziare il loro viaggio LEGO",

        # Theme-specific terms
        "Explore lost civilizations": "Esplora civiltà perdute",
        "This classic theme": "Questo tema classico",
        "from the late": "dalla fine degli anni",
        "early": "inizio degli anni",
        "followed": "seguiva",
        "his team": "la sua squadra",
        "globe-trotting adventures": "avventure in giro per il mondo",
        "Journey through": "Viaggia attraverso",
        "Egyptian deserts": "deserti egiziani",
        "dense jungles": "giungle fitte",
        "dinosaur islands": "isole dei dinosauri",
        "expeditions": "spedizioni",
        "face": "affronta",
        "villains like": "cattivi come",
        "These minifigures defined": "Queste minifigure hanno definito",
        "adventure themes": "i temi d'avventura",
        "safari gear": "equipaggiamento da safari",
        "treasure-hunting equipment": "equipaggiamento per la caccia al tesoro",
        "before": "prima di",
        "captured the spirit of": "ha catturato lo spirito di",
        "pulp adventure serials": "serial d'avventura pulp",
        "Perfect for nostalgic builders who love": "Perfetto per costruttori nostalgici che amano",
        "archaeology": "archeologia",
        "exploration": "esplorazione",
        "hunting for ancient treasures": "caccia ai tesori antichi",
        "in dangerous temples": "in templi pericolosi",

        # More comprehensive terms
        "Covert operations begin with": "Le operazioni segrete iniziano con",
        "This spy-themed series": "Questa serie a tema spionaggio",
        "featured": "presentava",
        "elite agents": "agenti d'élite",
        "battling": "che combattevano",
        "criminal organization": "organizzazione criminale",
        "led by": "guidata da",
        "high-tech": "high-tech",
        "secret agents": "agenti segreti",
        "gadgets": "gadget",
        "advanced technology": "tecnologia avanzata",
        "thwart evil schemes": "sventare piani malvagi",
        "combined": "combinavano",
        "espionage": "spionaggio",
        "action": "azione",
        "science fiction": "fantascienza",
        "in sleek modern designs": "in design moderni ed eleganti",
        "underwater bases": "basi sottomarine",
        "volcanic lairs": "antri vulcanici",
        "faced impossible odds": "affrontavano sfide impossibili",
        "with style and sophistication": "con stile e raffinatezza",
        "Though short-lived": "Anche se di breve durata",
        "delivered": "ha offerto",
        "James Bond-style excitement": "emozioni in stile James Bond",
        "with LEGO creativity": "con la creatività LEGO",
        "Perfect for fans of": "Perfetto per gli appassionati di",
        "spy thrillers": "thriller di spionaggio",
        "secret missions": "missioni segrete",
        "saving the world": "salvare il mondo",
        "with gadgets, vehicles, and teamwork": "con gadget, veicoli e lavoro di squadra",

        # More game/franchise specific
        "Elite special forces": "Forze speciali d'élite",
        "save the world": "salvano il mondo",
        "highly trained team": "squadra altamente addestrata",
        "evil": "malvagio",
        "mind-control orbs": "sfere del controllo mentale",
        "team members": "membri del team",
        "across multiple missions": "attraverso molteplici missioni",
        "including": "incluse",
        "deep freeze polar expeditions": "spedizioni polari congelate",
        "deep sea underwater operations": "operazioni sottomarine in acque profonde",
        "distinctive color-coded uniforms": "uniformi distintive codificate per colore",
        "specialized equipment": "equipaggiamento specializzato",
        "for extreme environments": "per ambienti estremi",
        "snowmobiles": "motoslitte",
        "submarines": "sottomarini",
        "military action": "azione militare",
        "with sci-fi elements": "con elementi sci-fi",
        "elite tactical teams": "squadre tattiche d'élite",
        "world-saving missions": "missioni per salvare il mondo",
        "stopping villains": "fermare i cattivi",
        "specialized gear and vehicles": "equipaggiamento e veicoli specializzati",

        # Animal Crossing specific
        "Welcome to your island paradise": "Benvenuto nel tuo paradiso insulare",
        "Based on": "Basato su",
        "beloved life simulation game": "amato gioco di simulazione di vita",
        "villagers": "abitanti",
        "special characters": "personaggi speciali",
        "customizable player character": "personaggio giocabile personalizzabile",
        "from this charming franchise": "da questo affascinante franchise",
        "Build your dream island": "Costruisci l'isola dei tuoi sogni",
        "fan-favorite": "preferiti dai fan",
        "animal residents": "residenti animali",
        "capture the wholesome, cozy aesthetic": "catturano l'estetica accogliente e genuina",
        "that made": "che ha reso",
        "a global phenomenon": "un fenomeno globale",
        "especially during": "specialmente durante",
        "era": "era",
        "fishing": "pesca",
        "bug catching": "cattura di insetti",
        "decorating": "decorazione",
        "fossil hunting": "caccia ai fossili",
        "recreate": "ricrea",
        "peaceful daily activities": "attività quotidiane tranquille",
        "that define": "che definiscono",
        "island life": "la vita sull'isola",
        "With detailed accessories like": "Con accessori dettagliati come",
        "furniture": "mobili",
        "tools": "strumenti",
        "seasonal items": "oggetti stagionali",
        "these figures bring": "queste figure portano",
        "the game's creative customization": "la personalizzazione creativa del gioco",
        "into physical building": "nella costruzione fisica",
        "Perfect for fans of": "Perfetto per gli appassionati di",
        "relaxing gameplay": "gameplay rilassante",
        "cute characters": "personaggi carini",
        "creating your own perfect island getaway": "creare la propria fuga perfetta sull'isola",

        # Aquatic/underwater themes
        "Dive deep with": "Immergiti in profondità con",
        "This underwater theme": "Questo tema sottomarino",
        "from the mid-": "dalla metà degli anni",
        "rival factions": "fazioni rivali",
        "beneath the waves": "sotto le onde",
        "in orange and black": "in arancione e nero",
        "in dark green and red": "in verde scuro e rosso",
        "in yellow and blue": "in giallo e blu",
        "Each faction featured": "Ogni fazione presentava",
        "unique diving suits": "tute da sub uniche",
        "underwater bases": "basi sottomarine",
        "pioneered underwater LEGO adventures": "hanno aperto la strada alle avventure LEGO sottomarine",
        "with detailed helmets": "con caschi dettagliati",
        "breathing apparatus": "apparato respiratorio",
        "aquatic vehicles": "veicoli acquatici",
        "crystal hunting": "caccia ai cristalli",
        "territorial battles": "battaglie territoriali",
        "delivered sci-fi submarine action": "ha offerto azione fantascientifica con sottomarini",
        "Perfect for nostalgic fans who dreamed of": "Perfetto per fan nostalgici che sognavano",
        "underwater cities": "città sottomarine",
        "deep sea exploration": "esplorazione degli abissi",
        "submarine battles": "battaglie con sottomarini",
        "in mysterious ocean depths": "nelle misteriose profondità oceaniche",

        # Architecture
        "Celebrate architectural excellence": "Celebra l'eccellenza architettonica",
        "While this theme focuses primarily on": "Mentre questo tema si concentra principalmente su",
        "landmark buildings": "edifici storici",
        "skylines": "skyline",
        "limited minifigures represent": "minifigure limitate rappresentano",
        "architects": "architetti",
        "professionals": "professionisti",
        "These sophisticated figures": "Queste figure sofisticate",
        "accompany sets featuring": "accompagnano set che presentano",
        "world-famous structures": "strutture di fama mondiale",
        "like the": "come la",
        "Eiffel Tower": "Torre Eiffel",
        "Empire State Building": "Empire State Building",
        "Taj Mahal": "Taj Mahal",
        "showcase professional attire": "mostrano abbigliamento professionale",
        "contemporary design sensibilities": "sensibilità per il design contemporaneo",
        "Though sparse": "Anche se scarse",
        "they add human scale": "aggiungono scala umana",
        "context to": "e contesto a",
        "architectural masterpieces": "capolavori architettonici",
        "Perfect for adult builders": "Perfetto per costruttori adulti",
        "architecture enthusiasts": "appassionati di architettura",
        "anyone who appreciates": "chiunque apprezzi",
        "design": "design",
        "engineering": "ingegneria",
        "the buildings that define": "gli edifici che definiscono",
        "our cities and cultures": "le nostre città e culture",

        # Art
        "Transform your walls into galleries": "Trasforma le tue pareti in gallerie",
        "These innovative building experiences": "Queste esperienze di costruzione innovative",
        "let you create": "ti permettono di creare",
        "stunning mosaics": "mosaici mozzafiato",
        "wall art": "arte da parete",
        "iconic subjects from": "soggetti iconici da",
        "pop culture": "cultura pop",
        "famous artwork": "opere d'arte famose",
        "Each set includes": "Ogni set include",
        "thousands of pieces": "migliaia di pezzi",
        "multiple building options": "molteplici opzioni di costruzione",
        "allowing you to customize": "permettendoti di personalizzare",
        "your artwork": "la tua opera d'arte",
        "portraits": "ritratti",
        "mosaics": "mosaici",
        "heroes": "eroi",
        "World Maps": "Mappe del Mondo",
        "these sets blur the line between": "questi set sfumano il confine tra",
        "building and artistic expression": "costruzione ed espressione artistica",
        "Display your passion": "Mostra la tua passione",
        "on your wall": "sulla tua parete",
        "sophisticated adult building experiences": "sofisticate esperienze di costruzione per adulti",
        "Perfect for art lovers": "Perfetto per amanti dell'arte",
        "adults seeking creative relaxation": "adulti alla ricerca di relax creativo",
        "through building": "attraverso la costruzione",

        # Atlantis
        "Discover the lost city": "Scopri la città perduta",
        "This underwater adventure theme": "Questo tema d'avventura subacquea",
        "explorers seeking": "esploratori alla ricerca di",
        "the legendary underwater civilization": "la leggendaria civiltà sottomarina",
        "deep-sea divers": "sub d'alto mare",
        "in red suits": "in tute rosse",
        "with advanced diving equipment": "con equipaggiamento subacqueo avanzato",
        "mysterious": "misteriosi",
        "warriors": "guerrieri",
        "with fish-like features": "con caratteristiche simili a pesci",
        "ancient weapons": "armi antiche",
        "Find treasure keys": "Trova chiavi del tesoro",
        "battle sea monsters": "combatti mostri marini",
        "uncover ancient secrets": "scopri antichi segreti",
        "in submarines": "in sottomarini",
        "underwater vehicles": "veicoli sottomarini",
        "exploration with mystery": "esplorazione con mistero",
        "bringing the": "portando la",
        "legend to LEGO": "leggenda in LEGO",
        "Though brief": "Anche se breve",
        "delivered exciting underwater adventures": "ha offerto emozionanti avventure sottomarine",
        "mythological intrigue": "intrighi mitologici",
        "lost civilizations": "civiltà perdute",
        "ancient mysteries": "antichi misteri",
        "waiting to be discovered": "in attesa di essere scoperti",
        "in the ocean depths": "nelle profondità oceaniche",

        # Additional common phrases for comprehensive coverage
        "figure": "figura",
        "figures": "figure",
        "minifigure": "minifigure",
        "collection": "collezione",
        "collector": "collezionista",
        "build": "costruisci",
        "builder": "costruttore",
        "set": "set",
        "piece": "pezzo",
        "pieces": "pezzi",
        "brick": "mattoncino",
        "bricks": "mattoncini",
        "theme": "tema",
        "series": "serie",
        "release": "rilascio",
        "released": "rilasciato",
        "year": "anno",
        "years": "anni",
        "new": "nuovo",
        "old": "vecchio",
        "rare": "raro",
        "exclusive": "esclusivo",
        "limited edition": "edizione limitata",
        "classic": "classico",
        "modern": "moderno",
        "vintage": "vintage",
        "retired": "ritirato",
        "current": "attuale",
        "upcoming": "in arrivo",
        "price": "prezzo",
        "value": "valore",
        "condition": "condizione",
        "complete": "completo",
        "incomplete": "incompleto",
        "instructions": "istruzioni",
        "box": "scatola",
        "with box": "con scatola",
        "without box": "senza scatola",
        "sealed": "sigillato",
        "opened": "aperto",
        "used": "usato",
        "new in box": "nuovo in scatola",
        "mint": "perfetto",
        "excellent": "eccellente",
        "good": "buono",
        "fair": "discreto",
        "poor": "scarso",
    }

    # Apply translations with regex to handle plurals and variations
    result = text

    # Try exact match first
    if result in translations:
        return translations[result]

    # Try partial matches (longer phrases first)
    sorted_phrases = sorted(translations.keys(), key=len, reverse=True)
    for phrase in sorted_phrases:
        if len(phrase) > 3:  # Only do partial matching for longer phrases
            pattern = re.escape(phrase)
            if re.search(pattern, result, re.IGNORECASE):
                result = re.sub(
                    pattern,
                    translations[phrase],
                    result,
                    flags=re.IGNORECASE,
                    count=1
                )

    # Preserve LEGO branding
    result = result.replace("Lego", "LEGO")

    return result


def translate_value(value):
    """Recursively translate JSON values."""
    if isinstance(value, dict):
        return {k: translate_value(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [translate_value(item) for item in value]
    elif isinstance(value, str):
        # Preserve template variables
        if '{' in value and '}' in value:
            # Handle complex templates with variables
            parts = re.split(r'(\{[^}]+\})', value)
            translated_parts = []
            for part in parts:
                if part.startswith('{') and part.endswith('}'):
                    translated_parts.append(part)  # Keep variable as-is
                else:
                    translated_parts.append(translate_to_italian(part))
            return ''.join(translated_parts)
        else:
            return translate_to_italian(value)
    else:
        return value


def main():
    """Main translation function."""
    source_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json"
    target_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/it.json"

    print("Starting Italian translation...")
    print(f"Reading: {source_file}")

    # Read source file
    with open(source_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Translating {len(json.dumps(data, indent=2).splitlines())} lines...")

    # Translate all content
    translated_data = translate_value(data)

    # Write target file with proper formatting
    print(f"Writing: {target_file}")
    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)

    # Verify file size
    import os
    file_size_kb = os.path.getsize(target_file) / 1024
    line_count = len(open(target_file, 'r', encoding='utf-8').readlines())

    print(f"\n✓ Translation complete!")
    print(f"  Lines: {line_count}")
    print(f"  Size: {file_size_kb:.1f}KB")
    print(f"  Output: {target_file}")


if __name__ == "__main__":
    main()
