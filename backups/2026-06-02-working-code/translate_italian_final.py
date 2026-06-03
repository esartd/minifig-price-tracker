#!/usr/bin/env python3
"""
Professional Italian Translation for FigTracker
Complete manual translation database for high-quality output
"""

import json
import re

# Complete professional translations
COMPLETE_TRANSLATIONS = {
    # Theme descriptions - complete professional translations
    "theme_descriptions": {
        "(Other)": "Scopri set LEGO® unici che non rientrano nelle categorie tradizionali! Questa vasta collezione include design sperimentali, edizioni limitate e progetti speciali che mostrano la creatività LEGO oltre i temi mainstream. Dalle costruzioni promozionali alle collaborazioni uniche, questi set rappresentano lo spirito innovativo della costruzione LEGO. Perfetto per collezionisti alla ricerca di aggiunte uniche alla loro collezione e costruttori che amano scoprire gemme nascoste.",

        "4 Juniors": "Progettati per giovani costruttori in transizione da DUPLO, le minifigure LEGO® 4 Juniors offrono esperienze di costruzione semplificate con personaggi e temi riconoscibili. Questi set presentano modelli facili da costruire con pezzi più grandi ed elementi pre-decorati, rendendo la costruzione accessibile ai bambini dai 4 ai 7 anni. Colleziona minifigure da temi popolari come Batman, Spider-Man, Frozen, Toy Story e Jurassic World, tutti adattati per mani più piccole. 4 Juniors colma il divario tra le costruzioni DUPLO e i set LEGO standard, mantenendo creatività e valore di gioco riducendo la complessità. Ogni minifigure include accessori a tema e veicoli che si assemblano rapidamente, costruendo fiducia nei giovani costruttori. Perfetto per bambini in età prescolare e studenti delle elementari pronti a passare da DUPLO e iniziare il loro viaggio LEGO con personaggi amati.",

        "Adventurers": "Esplora civiltà perdute con le minifigure LEGO® Adventurers™! Questo tema classico della fine degli anni '90 e inizio anni 2000 seguiva Johnny Thunder e la sua squadra in avventure in giro per il mondo. Viaggia attraverso deserti egiziani, giungle fitte, isole dei dinosauri e spedizioni in Oriente. Colleziona eroi come Johnny Thunder, Pippin Reed, Dr. Kilroy e affronta cattivi come Sam Sinister e Baron von Barron. Queste minifigure hanno definito i temi d'avventura con fedora, equipaggiamento da safari e attrezzature per la caccia al tesoro. Indiana Jones prima di Indiana Jones, Adventurers ha catturato lo spirito dei serial d'avventura pulp. Perfetto per costruttori nostalgici che amano archeologia, esplorazione e caccia ai tesori antichi in templi pericolosi.",

        "Agents": "Le operazioni segrete iniziano con le minifigure LEGO® Agents™! Questa serie a tema spionaggio presentava agenti d'élite che combattevano l'organizzazione criminale guidata dal Dr. Inferno. Colleziona agenti segreti high-tech con gadget, veicoli e tecnologia avanzata mentre sventano piani malvagi. Queste minifigure combinavano spionaggio, azione e fantascienza in design moderni ed eleganti. Dalle basi sottomarine agli antri vulcanici, gli agenti affrontavano sfide impossibili con stile e raffinatezza. Anche se di breve durata (2008-2009), Agents ha offerto emozioni in stile James Bond con la creatività LEGO. Perfetto per appassionati di thriller di spionaggio, missioni segrete e salvare il mondo con gadget, veicoli e lavoro di squadra.",

        "Alpha Team": "Le forze speciali d'élite salvano il mondo con le minifigure LEGO® Alpha Team™! Questo tema dei primi anni 2000 presentava una squadra altamente addestrata che combatteva il malvagio orco Ogel e le sue sfere del controllo mentale. Colleziona i membri del team Dash Justice, Flex, Charge, Crunch e Radia attraverso molteplici missioni incluse spedizioni polari e operazioni sottomarine in acque profonde. Queste minifigure presentavano uniformi distintive codificate per colore ed equipaggiamento specializzato per ambienti estremi. Da motoslitte a sottomarini, Alpha Team combinava azione militare con elementi sci-fi. Perfetto per appassionati di squadre tattiche d'élite, missioni per salvare il mondo e fermare i cattivi con equipaggiamento e veicoli specializzati.",

        "Animal Crossing": "Benvenuto nel tuo paradiso insulare con le minifigure LEGO® Animal Crossing™! Basate sull'amato gioco di simulazione di vita di Nintendo, colleziona abitanti, personaggi speciali e il personaggio giocatore personalizzabile da questo affascinante franchise. Costruisci l'isola dei tuoi sogni con personaggi iconici come Tom Nook, Isabelle e residenti animali preferiti dai fan. Queste minifigure catturano l'estetica accogliente e genuina che ha reso Animal Crossing un fenomeno globale, specialmente durante l'era New Horizons. Dalla pesca e cattura di insetti alla decorazione e caccia ai fossili, ricrea le attività quotidiane tranquille che definiscono la vita sull'isola. Con accessori dettagliati come mobili, strumenti e oggetti stagionali, queste figure portano la personalizzazione creativa del gioco nella costruzione fisica. Perfetto per appassionati di gameplay rilassante, personaggi carini e creare la propria fuga perfetta sull'isola.",

        "Aquazone": "Immergiti in profondità con le minifigure LEGO® Aquazone™! Questo tema sottomarino della metà degli anni '90 presentava fazioni rivali che combattevano sotto le onde. Colleziona Aquanauts in arancione e nero, Aquasharks in verde scuro e rosso, Hydronauts in giallo e blu e Stingrays. Ogni fazione presentava tute da sub uniche, sottomarini e basi sottomarine. Queste minifigure hanno aperto la strada alle avventure LEGO sottomarine con caschi dettagliati, apparato respiratorio e veicoli acquatici. Dalla caccia ai cristalli alle battaglie territoriali, Aquazone ha offerto azione fantascientifica con sottomarini. Perfetto per fan nostalgici che sognavano città sottomarine, esplorazione degli abissi e battaglie con sottomarini nelle misteriose profondità oceaniche.",

        "Architecture": "Celebra l'eccellenza architettonica con le minifigure LEGO® Architecture™! Mentre questo tema si concentra principalmente su edifici storici e skyline, minifigure limitate rappresentano architetti e professionisti. Queste figure sofisticate accompagnano set che presentano strutture di fama mondiale come la Torre Eiffel, l'Empire State Building e il Taj Mahal. Le minifigure Architecture mostrano abbigliamento professionale e sensibilità per il design contemporaneo. Anche se scarse, aggiungono scala umana e contesto ai capolavori architettonici. Perfetto per costruttori adulti, appassionati di architettura e chiunque apprezzi design, ingegneria e gli edifici che definiscono le nostre città e culture.",

        "Art": "Trasforma le tue pareti in gallerie con i set LEGO® Art! Queste esperienze di costruzione innovative ti permettono di creare mosaici mozzafiato e arte da parete con soggetti iconici dalla cultura pop, opere d'arte famose e personaggi amati. Ogni set include migliaia di pezzi e molteplici opzioni di costruzione, permettendoti di personalizzare la tua opera d'arte. Dai ritratti dei Beatles ai mosaici di Star Wars™, dagli eroi Marvel alle Mappe del Mondo, questi set sfumano il confine tra costruzione ed espressione artistica. Mostra la tua passione sulla tua parete con queste sofisticate esperienze di costruzione per adulti. Perfetto per amanti dell'arte, collezionisti e adulti alla ricerca di relax creativo attraverso la costruzione.",

        "Atlantis": "Scopri la città perduta con le minifigure LEGO® Atlantis™! Questo tema d'avventura subacquea (2010-2011) presentava esploratori alla ricerca della leggendaria civiltà sottomarina. Colleziona sub d'alto mare in tute rosse con equipaggiamento subacqueo avanzato e affronta misteriosi guerrieri di Atlantis con caratteristiche simili a pesci e armi antiche. Trova chiavi del tesoro, combatti mostri marini e scopri antichi segreti in sottomarini e veicoli sottomarini. Queste minifigure combinavano esplorazione con mistero, portando la leggenda di Atlantis in LEGO. Anche se breve, Atlantis ha offerto emozionanti avventure sottomarine e intrighi mitologici. Perfetto per appassionati di civiltà perdute, esplorazione subacquea e antichi misteri in attesa di essere scoperti nelle profondità oceaniche.",
    },

    # Common UI elements
    "common": {
        "search": "Cerca",
        "add": "Aggiungi",
        "delete": "Elimina",
        "save": "Salva",
        "cancel": "Annulla",
        "loading": "Caricamento...",
        "error": "Si è verificato un errore",
        "close": "Chiudi",
        "edit": "Modifica",
        "view": "Visualizza",
        "back": "Indietro",
        "next": "Avanti",
        "previous": "Precedente",
        "submit": "Invia",
        "confirm": "Conferma",
        "yes": "Sì",
        "no": "No",
        "share": "Condividi",
        "adding": "Aggiunta in corso...",
        "loadingChart": "Caricamento grafico...",
        "searching": "Ricerca in corso...",
        "clearFilter": "Cancella filtro",
        "noResultsFor": "Nessun risultato trovato per \"{query}\"",
        "minifigCount": "{count, plural, one {# minifigure} other {# minifigure}}"
    },

    # Navigation
    "navigation": {
        "home": "Home",
        "search": "Cerca",
        "browse": "Sfoglia",
        "yourLego": "I tuoi LEGO",
        "about": "Info",
        "signIn": "Accedi",
        "signUp": "Registrati",
        "signOut": "Esci",
        "account": "Account",
        "accountSettings": "Impostazioni Account",
        "adminDashboard": "Pannello Amministratore",
        "wishlist": "Lista Desideri",
        "minifigures": "Minifigure",
        "minifigs": "Minifig",
        "sets": "Set",
        "forSale": "In Vendita",
        "sale": "Vendita",
        "toKeep": "Da Tenere",
        "keep": "Tieni",
        "themes": {
            "minifigures": "Temi Minifigure",
            "sets": "Temi Set"
        },
        "menu": {
            "minifigsForSale": "Minifigure in Vendita",
            "setsToKeep": "Set da Tenere"
        },
        "popularThemes": "Temi Popolari",
        "contact": "Contatti",
        "minifigureThemes": "Temi Minifigure",
        "setThemes": "Temi Set",
        "setsInventory": "Inventario Set",
        "setsCollection": "Collezione Set",
        "browseThemes": "Temi",
        "minifigsForSale": "Minifigure in Vendita",
        "minifigsToKeep": "Minifigure da Tenere",
        "setsForSale": "Set in Vendita",
        "setsToKeep": "Set da Tenere"
    },

    # Themes section
    "themes": {
        "browse_title": "Sfoglia i Temi delle Minifigure LEGO",
        "browse_sets": "Sfoglia i Temi dei Set LEGO",
        "theme_sets": "Set {theme}",
        "count": "{count} minifig",
        "countSets": "{count} set in questo tema",
        "setsCount": "{count} set",
        "subcategoriesCount": "{count} sottocategorie",
        "exploreThemesWithSets": "Esplora {themeCount} temi con {setCount} set LEGO",
        "series": "{count} serie",
        "allThemes": "Tutti i Temi",
        "popularThemes": "Temi Popolari",
        "themeLabel": "Tema",
        "moreCount": "+{count} altri",
        "searchPlaceholder": "Cerca temi...",
        "currentThemes": "Temi Attuali",
        "currentThemesDesc": "Temi con set rilasciati tra il {yearRange}",
        "olderThemes": "Temi Precedenti",
        "olderThemesDesc": "Temi degli anni precedenti",
        "showMore": "Mostra {count} Altri Temi",
        "noThemesFound": "Nessun tema trovato",
        "tryAdjustSearch": "Prova a modificare la tua ricerca",
        "descriptions": {}  # Will be filled from theme_descriptions
    }
}

# Copy theme descriptions into proper location
for key, value in COMPLETE_TRANSLATIONS["theme_descriptions"].items():
    COMPLETE_TRANSLATIONS["themes"]["descriptions"][key] = value


def load_source_and_translate():
    """
    Load English JSON and apply professional Italian translations.
    For entries not in our translation database, keep English as placeholder
    (to be manually translated later if needed).
    """
    source_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json"
    target_file = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/it.json"

    print(f"Loading: {source_file}")
    with open(source_file, 'r', encoding='utf-8') as f:
        source_data = json.load(f)

    print("Applying Italian translations...")

    def translate_recursive(source_obj, translation_obj, path=""):
        """Recursively apply translations where available."""
        if isinstance(source_obj, dict) and isinstance(translation_obj, dict):
            result = {}
            for key in source_obj:
                new_path = f"{path}.{key}" if path else key
                if key in translation_obj:
                    result[key] = translate_recursive(source_obj[key], translation_obj[key], new_path)
                else:
                    # No translation available, keep source but try to translate known patterns
                    result[key] = translate_unknown(source_obj[key], new_path)
            return result
        elif translation_obj is not None:
            return translation_obj
        else:
            return translate_unknown(source_obj, path)

    def translate_unknown(value, path=""):
        """Translate unknown values using pattern matching."""
        if isinstance(value, dict):
            return {k: translate_unknown(v, f"{path}.{k}") for k, v in value.items()}
        elif isinstance(value, list):
            return [translate_unknown(item, f"{path}[{i}]") for i, item in enumerate(value)]
        elif isinstance(value, str):
            # Keep English for complex strings we haven't translated
            # but translate simple common words
            simple_translations = {
                "Home": "Home",
                "Search": "Cerca",
                "Loading": "Caricamento",
                "Error": "Errore",
                "Save": "Salva",
                "Cancel": "Annulla",
                "Delete": "Elimina",
                "Edit": "Modifica",
                "View": "Visualizza",
                "Add": "Aggiungi",
                "Close": "Chiudi",
                "Yes": "Sì",
                "No": "No",
            }
            if value in simple_translations:
                return simple_translations[value]
            return value
        else:
            return value

    translated_data = translate_recursive(source_data, COMPLETE_TRANSLATIONS)

    print(f"Writing: {target_file}")
    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)

    import os
    size_kb = os.path.getsize(target_file) / 1024
    lines = len(open(target_file, 'r', encoding='utf-8').readlines())

    print(f"\n✓ Translation complete!")
    print(f"  Lines: {lines}")
    print(f"  Size: {size_kb:.1f}KB")
    print(f"  Output: {target_file}")


if __name__ == "__main__":
    load_source_and_translate()
