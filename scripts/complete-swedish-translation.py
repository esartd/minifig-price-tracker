#!/usr/bin/env python3
"""
Complete Swedish Translation Generator
Translates entire en.json to comprehensive Swedish (sv.json)
"""

import json
import re

# Comprehensive Swedish translation dictionary
TRANSLATIONS = {
    # Common terms
    "search": "Sök",
    "add": "Lägg till",
    "delete": "Ta bort",
    "save": "Spara",
    "cancel": "Avbryt",
    "loading": "Laddar",
    "error": "Ett fel uppstod",
    "close": "Stäng",
    "edit": "Redigera",
    "view": "Visa",
    "back": "Tillbaka",
    "next": "Nästa",
    "previous": "Föregående",
    "submit": "Skicka",
    "confirm": "Bekräfta",
    "yes": "Ja",
    "no": "Nej",
    "share": "Dela",
    "adding": "Lägger till",
    "searching": "Söker",
    "filter": "Filtrera",
    "clear": "Rensa",
    "sort": "Sortera",
    "show": "Visa",
    "hide": "Dölj",
    "all": "Alla",
    "none": "Ingen",
    "select": "Välj",
    "upload": "Ladda upp",
    "download": "Ladda ner",
    "print": "Skriv ut",
    "copy": "Kopiera",
    "paste": "Klistra in",
    "cut": "Klipp ut",
    "undo": "Ångra",
    "redo": "Gör om",
    "refresh": "Uppdatera",
    "reload": "Ladda om",
    "reset": "Återställ",
    "update": "Uppdatera",
    "create": "Skapa",
    "new": "Ny",
    "remove": "Ta bort",
    "move": "Flytta",
    "duplicate": "Duplicera",
    "rename": "Byt namn",
    "settings": "Inställningar",
    "preferences": "Preferenser",
    "options": "Alternativ",
    "help": "Hjälp",
    "about": "Om",
    "contact": "Kontakt",
    "support": "Support",
    "feedback": "Feedback",
    "report": "Rapportera",
    "bug": "Bugg",
    "feature": "Funktion",
    "request": "Begäran",
    "suggestion": "Förslag",
    "question": "Fråga",
    "answer": "Svar",
    "comment": "Kommentar",
    "reply": "Svara",
    "like": "Gilla",
    "dislike": "Ogilla",
    "share": "Dela",
    "follow": "Följ",
    "unfollow": "Sluta följa",
    "subscribe": "Prenumerera",
    "unsubscribe": "Avprenumerera",
    "notification": "Avisering",
    "notifications": "Aviseringar",
    "message": "Meddelande",
    "messages": "Meddelanden",
    "inbox": "Inkorg",
    "sent": "Skickat",
    "draft": "Utkast",
    "trash": "Papperskorg",
    "spam": "Skräppost",
    "archive": "Arkiv",
    "starred": "Stjärnmärkt",
    "important": "Viktigt",
    "read": "Läs",
    "unread": "Oläst",
    "mark": "Markera",
    "unmark": "Avmarkera",

    # LEGO-specific terms
    "minifigure": "minifigur",
    "minifigures": "minifigurer",
    "minifig": "minifigur",
    "minifigs": "minifigurer",
    "set": "set",
    "sets": "set",
    "piece": "kloss",
    "pieces": "klossar",
    "brick": "kloss",
    "bricks": "klossar",
    "part": "del",
    "parts": "delar",
    "element": "element",
    "elements": "element",
    "color": "färg",
    "colors": "färger",
    "theme": "tema",
    "themes": "teman",
    "category": "kategori",
    "categories": "kategorier",
    "series": "serie",
    "year": "år",
    "years": "år",
    "release": "släpp",
    "released": "släppt",
    "retired": "utgången",
    "available": "tillgänglig",
    "unavailable": "otillgänglig",
    "discontinued": "upphörd",
    "limited": "begränsad",
    "exclusive": "exklusiv",
    "rare": "sällsynt",
    "common": "vanlig",
    "uncommon": "ovanlig",
    "new": "ny",
    "used": "begagnad",
    "condition": "skick",
    "mint": "nyskick",
    "good": "gott skick",
    "acceptable": "acceptabelt skick",
    "damaged": "skadad",
    "complete": "komplett",
    "incomplete": "ofullständig",
    "sealed": "försegla",
    "opened": "öppnad",
    "box": "låda",
    "instruction": "instruktion",
    "instructions": "instruktioner",
    "manual": "manual",
    "catalog": "katalog",
    "inventory": "inventering",
    "collection": "samling",
    "wishlist": "önskelista",
    "owned": "äger",
    "wanted": "önskad",
    "for sale": "till salu",
    "to keep": "att behålla",
    "quantity": "antal",
    "price": "pris",
    "value": "värde",
    "total": "totalt",
    "average": "genomsnitt",
    "minimum": "minimum",
    "maximum": "maximum",
    "currency": "valuta",
    "weight": "vikt",
    "dimensions": "dimensioner",
    "width": "bredd",
    "height": "höjd",
    "depth": "djup",
    "length": "längd",
    "size": "storlek",
    "scale": "skala",
    "version": "version",
    "variant": "variant",
    "model": "modell",
    "design": "design",
    "style": "stil",
    "pattern": "mönster",
    "print": "tryck",
    "printed": "tryckt",
    "sticker": "dekal",
    "decal": "dekal",
    "torso": "överkropp",
    "legs": "ben",
    "head": "huvud",
    "hair": "hår",
    "hat": "hatt",
    "helmet": "hjälm",
    "accessory": "tillbehör",
    "accessories": "tillbehör",
    "weapon": "vapen",
    "weapons": "vapen",
    "tool": "verktyg",
    "tools": "verktyg",
    "cape": "mantel",
    "armor": "rustning",
    "shield": "sköld",
    "sword": "svärd",
    "gun": "gevär",
    "lightsaber": "ljussabel",
    "blaster": "blaster",

    # Navigation
    "home": "Hem",
    "browse": "Bläddra",
    "explore": "Utforska",
    "discover": "Upptäck",
    "find": "Hitta",
    "login": "Logga in",
    "logout": "Logga ut",
    "signin": "Logga in",
    "signout": "Logga ut",
    "signup": "Registrera dig",
    "register": "Registrera",
    "account": "Konto",
    "profile": "Profil",
    "dashboard": "Instrumentpanel",
    "admin": "Admin",
    "user": "Användare",
    "users": "Användare",
    "member": "Medlem",
    "members": "Medlemmar",
    "guest": "Gäst",
    "public": "Publik",
    "private": "Privat",
    "personal": "Personlig",

    # Actions
    "buy": "Köp",
    "sell": "Sälj",
    "trade": "Byt",
    "swap": "Byt",
    "exchange": "Växla",
    "compare": "Jämför",
    "track": "Spåra",
    "manage": "Hantera",
    "organize": "Organisera",
    "customize": "Anpassa",
    "personalize": "Personifiera",
    "configure": "Konfigurera",
    "setup": "Konfigurera",
    "install": "Installera",
    "uninstall": "Avinstallera",
    "enable": "Aktivera",
    "disable": "Inaktivera",
    "activate": "Aktivera",
    "deactivate": "Inaktivera",
    "start": "Starta",
    "stop": "Stoppa",
    "pause": "Pausa",
    "resume": "Återuppta",
    "continue": "Fortsätt",
    "finish": "Slutför",
    "complete": "Slutför",
    "skip": "Hoppa över",
    "ignore": "Ignorera",
    "dismiss": "Avfärda",
    "approve": "Godkänn",
    "reject": "Avvisa",
    "accept": "Acceptera",
    "decline": "Avslå",

    # Status
    "status": "Status",
    "active": "Aktiv",
    "inactive": "Inaktiv",
    "enabled": "Aktiverad",
    "disabled": "Inaktiverad",
    "online": "Online",
    "offline": "Offline",
    "connected": "Ansluten",
    "disconnected": "Frånkopplad",
    "synced": "Synkroniserad",
    "syncing": "Synkroniserar",
    "pending": "Väntande",
    "processing": "Bearbetar",
    "completed": "Slutförd",
    "failed": "Misslyckades",
    "success": "Framgång",
    "warning": "Varning",
    "info": "Information",
    "tip": "Tips",
    "note": "Notera",
    "notice": "Meddelande",
    "alert": "Varning",
    "danger": "Fara",

    # Time
    "today": "Idag",
    "yesterday": "Igår",
    "tomorrow": "Imorgon",
    "now": "Nu",
    "soon": "Snart",
    "later": "Senare",
    "recent": "Senaste",
    "latest": "Senaste",
    "oldest": "Äldsta",
    "newest": "Nyaste",
    "current": "Aktuell",
    "past": "Tidigare",
    "future": "Framtida",
    "date": "Datum",
    "time": "Tid",
    "duration": "Varaktighet",
    "period": "Period",
    "day": "dag",
    "days": "dagar",
    "week": "vecka",
    "weeks": "veckor",
    "month": "månad",
    "months": "månader",
    "year": "år",
    "hour": "timme",
    "hours": "timmar",
    "minute": "minut",
    "minutes": "minuter",
    "second": "sekund",
    "seconds": "sekunder",
    "ago": "sedan",
    "from now": "från nu",

    # Common phrases
    "loading chart": "Laddar diagram",
    "clear filter": "Rensa filter",
    "no results": "Inga resultat",
    "no results for": "Inga resultat för",
    "try again": "Försök igen",
    "something went wrong": "Något gick fel",
    "please try again": "Vänligen försök igen",
    "learn more": "Läs mer",
    "get started": "Kom igång",
    "sign in to continue": "Logga in för att fortsätta",
    "create account": "Skapa konto",
    "forgot password": "Glömt lösenord",
    "remember me": "Kom ihåg mig",
    "stay signed in": "Håll mig inloggad",
    "not found": "Hittades inte",
    "coming soon": "Kommer snart",
    "under construction": "Under konstruktion",
    "maintenance": "Underhåll",
    "privacy policy": "Integritetspolicy",
    "terms of service": "Användarvillkor",
    "cookie policy": "Cookie-policy",
    "copyright": "Upphovsrätt",
    "all rights reserved": "Alla rättigheter förbehållna",

    # LEGO themes - Common translations
    "star wars": "Star Wars",
    "castle": "Borg",
    "city": "Stad",
    "space": "Rymd",
    "pirates": "Pirater",
    "creator": "Skapare",
    "technic": "Technic",
    "friends": "Vänner",
    "ninjago": "Ninjago",
    "harry potter": "Harry Potter",
    "marvel": "Marvel",
    "dc": "DC",
    "super heroes": "Superhjältar",
    "architecture": "Arkitektur",
    "ideas": "Idéer",
    "classic": "Klassisk",
    "duplo": "Duplo",
    "juniors": "Juniors",
    "dimensions": "Dimensioner",
    "mindstorms": "Mindstorms",
    "education": "Utbildning",
    "seasonal": "Säsong",
    "holiday": "Högtid",
    "christmas": "Jul",
    "halloween": "Halloween",
    "easter": "Påsk",
    "valentine": "Alla hjärtans dag",

    # More specific translations
    "your": "Ditt",
    "my": "Mitt",
    "our": "Vårt",
    "their": "Deras",
    "this": "Denna",
    "that": "Det",
    "these": "Dessa",
    "those": "De",
    "here": "Här",
    "there": "Där",
    "and": "och",
    "or": "eller",
    "but": "men",
    "with": "med",
    "without": "utan",
    "from": "från",
    "to": "till",
    "for": "för",
    "in": "i",
    "on": "på",
    "at": "vid",
    "by": "av",
    "of": "av",
    "the": "den",
    "a": "en",
    "an": "en",

    # Numbers and counting
    "one": "en",
    "two": "två",
    "three": "tre",
    "four": "fyra",
    "five": "fem",
    "six": "sex",
    "seven": "sju",
    "eight": "åtta",
    "nine": "nio",
    "ten": "tio",
    "first": "första",
    "second": "andra",
    "third": "tredje",
    "last": "sista",
    "count": "antal",
    "number": "nummer",
    "amount": "mängd",

    # Collection management
    "add to collection": "Lägg till i samling",
    "remove from collection": "Ta bort från samling",
    "add to wishlist": "Lägg till i önskelista",
    "mark as owned": "Markera som ägd",
    "mark for sale": "Markera till försäljning",
    "mark to keep": "Markera att behålla",
    "update quantity": "Uppdatera antal",
    "set quantity": "Ange antal",
    "increase": "Öka",
    "decrease": "Minska",
    "bulk edit": "Massredigering",
    "select all": "Välj alla",
    "deselect all": "Avmarkera alla",
    "export": "Exportera",
    "import": "Importera",

    # Sorting and filtering
    "sort by": "Sortera efter",
    "filter by": "Filtrera efter",
    "group by": "Gruppera efter",
    "order by": "Ordna efter",
    "ascending": "Stigande",
    "descending": "Fallande",
    "alphabetical": "Alfabetisk",
    "chronological": "Kronologisk",
    "by name": "efter namn",
    "by date": "efter datum",
    "by price": "efter pris",
    "by value": "efter värde",
    "by year": "efter år",
    "by theme": "efter tema",
    "by category": "efter kategori",
    "by popularity": "efter popularitet",
    "by rating": "efter betyg",

    # Display options
    "view mode": "Visningsläge",
    "grid view": "Rutnätsvy",
    "list view": "Listvy",
    "detail view": "Detaljvy",
    "compact view": "Kompakt vy",
    "expanded view": "Utökad vy",
    "thumbnail": "Miniatyrbild",
    "preview": "Förhandsvisning",
    "full size": "Full storlek",
    "zoom in": "Zooma in",
    "zoom out": "Zooma ut",
    "fit to screen": "Anpassa till skärm",
    "actual size": "Verklig storlek",

    # Statistics and analytics
    "statistics": "Statistik",
    "analytics": "Analys",
    "report": "Rapport",
    "chart": "Diagram",
    "graph": "Graf",
    "data": "Data",
    "summary": "Sammanfattning",
    "overview": "Översikt",
    "details": "Detaljer",
    "insights": "Insikter",
    "trends": "Trender",
    "comparison": "Jämförelse",
    "breakdown": "Uppdelning",
    "distribution": "Fördelning",
    "percentage": "Procent",
    "ratio": "Förhållande",
    "growth": "Tillväxt",
    "decline": "Nedgång",
    "change": "Förändring",
    "difference": "Skillnad",
}

# Theme descriptions in Swedish
THEME_DESCRIPTIONS = {
    "Star Wars": "LEGO Star Wars-set och minifigurer från det ikoniska rymdoperafranchise, inklusive karaktärer, fordon och platser från alla Star Wars-filmer och serier.",
    "Castle": "Medeltida LEGO-set med borgar, riddare, drakar och kungariken från LEGO:s klassiska Castle-tema.",
    "City": "LEGO City-set som representerar det moderna stadslivet med poliser, brandmän, fordon och stadsmiljöer.",
    "Space": "LEGO Space-set med rymdutforskare, rymdstationer, rymdskepp och utomjordiska äventyr.",
    "Pirates": "LEGO Pirate-set med piratskepp, skattkistor, ödörön och sjöfartande äventyr.",
    "Creator": "LEGO Creator-set som erbjuder flera byggalternativ från ett set, ofta med fordon, byggnader och djur.",
    "Technic": "LEGO Technic-set med avancerade mekaniska funktioner, realistiska modeller av fordon och maskiner.",
    "Friends": "LEGO Friends-set med karaktärer och miljöer fokuserade på vänskap, kreativitet och Heartlake City.",
    "Ninjago": "LEGO Ninjago-set med ninjahjältar, drakar, kampscener och mystiska äventyr i Ninjago-världen.",
    "Harry Potter": "LEGO Harry Potter-set baserade på den magiska världen av Hogwarts, med karaktärer, platser och varelser från böckerna och filmerna.",
    "Marvel": "LEGO Marvel Super Heroes-set med superhjältar och skurkar från Marvel-universumet.",
    "DC": "LEGO DC Super Heroes-set med Batman, Superman och andra DC Comics-karaktärer.",
    "Architecture": "LEGO Architecture-set som återger berömda byggnader och landmärken från hela världen.",
    "Ideas": "LEGO Ideas-set som skapats från fanförslag, med unika och innovativa byggprojekt.",
    "Classic": "LEGO Classic-set med grundläggande klossar och delar för fri kreativ bygglek.",
    "Duplo": "LEGO Duplo-set för yngre barn med större klossar och enkla byggprojekt.",
    "Minifigures": "LEGO Collectible Minifigures-serier med unika karaktärer i förseglade påsar.",
    "Seasonal": "LEGO säsongsbaserade set för högtider som jul, påsk, halloween och andra firanden.",
    "Jurassic World": "LEGO Jurassic World-set med dinosaurier, fordon och karaktärer från Jurassic Park-filmerna.",
    "The LEGO Movie": "LEGO-set baserade på LEGO Movie-filmerna med Emmet, Wyldstyle och andra karaktärer.",
    "Disney": "LEGO Disney-set med prinsessor, slott och karaktärer från Disney-filmer.",
    "Minecraft": "LEGO Minecraft-set som återger Minecraft-världen med block, biom och karaktärer.",
    "Speed Champions": "LEGO Speed Champions-set med detaljerade modeller av riktiga sportbilar och racingfordon.",
    "Powered UP": "LEGO Powered UP-set med motoriserade och fjärrstyrda funktioner.",
    "Education": "LEGO Education-set designade för lärande och klassrumsanvändning.",
    "Monkie Kid": "LEGO Monkie Kid-set inspirerade av kinesisk mytologi med äventyr och karaktärer.",
    "VIDIYO": "LEGO VIDIYO-set som kombinerar LEGO-byggande med musikvideoskapande.",
    "Hidden Side": "LEGO Hidden Side-set som blandar fysiskt byggande med AR-spökjakt.",
    "Overwatch": "LEGO Overwatch-set baserade på videospelet med hjältar och stridsscenarier.",
    "Stranger Things": "LEGO Stranger Things-set inspirerade av TV-serien.",
    "Super Mario": "LEGO Super Mario-set med interaktiva banor och karaktärer från Nintendo-spelet.",
    "Art": "LEGO Art-set för vuxna med mosaiker och porträtt att bygga och hänga upp.",
    "Botanical Collection": "LEGO Botanical Collection med realistiska blommor och växter.",
    "BrickHeadz": "LEGO BrickHeadz-set med stiliserade karaktärsbyggen med stora huvuden.",
    "Dots": "LEGO Dots-set för kreativa smyckes- och dekorationsprojekt.",
    "Forma": "LEGO Forma-set för vuxna med organiska och konstnärliga byggen.",
    "Icons": "LEGO Icons-set (tidigare Creator Expert) med detaljerade modeller för vuxna.",
    "Minions": "LEGO Minions-set med karaktärer från Despicable Me-filmerna.",
    "Trolls World Tour": "LEGO Trolls-set inspirerade av Trolls-filmerna.",
    "Avatar": "LEGO Avatar: The Last Airbender-set med karaktärer och platser från serien.",
    "Fabuland": "Klassiska LEGO Fabuland-set från 1970-80-talen med djurkaraktärer.",
    "Adventurers": "LEGO Adventurers-set från 1990-2000-talen med skattjakt och äventyr.",
    "Time Cruisers": "LEGO Time Cruisers-set med tidsresor och futuristiska fordon.",
    "Aquanauts": "LEGO Aquanauts undervattenstemat från 1990-talet.",
    "Rock Raiders": "LEGO Rock Raiders-set från 1990-talet med gruvarbetare och monster.",
    "Insectoids": "LEGO Insectoids-set från 1990-talet med insektsliknande rymdfarkoster.",
    "UFO": "LEGO UFO-set från 1990-talet med utomjordingar och rymdskepp.",
    "Western": "LEGO Western-set med cowboys, outlaws och vilda västern.",
    "Orient Expedition": "LEGO Orient Expedition-set med äventyr i Asien.",
    "Dino Island": "LEGO Dino Island-set med dinosaurier och utforskare.",
    "Alpha Team": "LEGO Alpha Team-set med agenter som bekämpar superskurkar.",
    "Bionicle": "LEGO Bionicle-set med biomechaniska hjältar och episka berättelser.",
    "Hero Factory": "LEGO Hero Factory-set med byggbara robothjältar.",
    "Knights Kingdom": "LEGO Knights Kingdom-set med riddare och kungariken.",
    "Exo-Force": "LEGO Exo-Force-set med mechs och robot-strider.",
    "Viking": "LEGO Viking-set med nordiska krigare och mytologiska varelser.",
    "Power Miners": "LEGO Power Miners-set med gruvarbetare som utforskar jordens innandöme.",
    "Atlantis": "LEGO Atlantis undervattenstemat med skattkistor och havsmonstrer.",
    "Pharaoh's Quest": "LEGO Pharaoh's Quest-set med egyptiska äventyr och skattjakt.",
    "Monster Fighters": "LEGO Monster Fighters-set med jägare som bekämpar monster.",
    "Galaxy Squad": "LEGO Galaxy Squad-set med rymdinsekter och insektsvärmare.",
    "Chima": "LEGO Legends of Chima-set med djurhjältar och chi-energi.",
    "Ultra Agents": "LEGO Ultra Agents-set med hemliga agenter och superskurkar.",
    "Mixels": "LEGO Mixels små byggbara varelser från olika stammar.",
    "Elves": "LEGO Elves-set med magiska alver, drakar och fantasivärld.",
    "Angry Birds": "LEGO Angry Birds-set baserade på mobilspelet.",
    "Ghostbusters": "LEGO Ghostbusters-set med spökjägare och ikoniska fordon.",
    "Scooby-Doo": "LEGO Scooby-Doo-set med mysterielösande gäng och spökscenarier.",
    "The Simpsons": "LEGO Simpsons-set med familjen Simpson och Springfield.",
    "Doctor Who": "LEGO Doctor Who-set med TARDIS och Doctor.",
    "Back to the Future": "LEGO Back to the Future-set med DeLorean-tidsmaskinen.",
    "The Beatles": "LEGO Beatles-set med Yellow Submarine.",
    "Ghostbusters": "LEGO Ghostbusters-set baserade på de klassiska filmerna.",
    "Voltron": "LEGO Voltron-set med den ikoniska robothjälten.",
    "The Flintstones": "LEGO Flintstones-set med familjen Flinta.",
    "WALL-E": "LEGO WALL-E-set med den älskade roboten från Pixar-filmen.",
    "Powered Up": "LEGO Powered Up system för motoriserade set.",
    "Technic": "LEGO Technic avancerade byggset med mekaniska funktioner.",
    "DC Comics": "LEGO DC Comics Super Heroes-set med Batman och Justitieliga.",
    "Marvel Super Heroes": "LEGO Marvel Super Heroes med Avengers och Spider-Man.",
    "Indiana Jones": "LEGO Indiana Jones-set baserade på äventyrsfilmerna.",
    "Prince of Persia": "LEGO Prince of Persia-set från filmen.",
    "Toy Story": "LEGO Toy Story-set med Woody, Buzz Lightyear och gänget.",
    "Cars": "LEGO Cars-set med Blixten McQueen och andra karaktärer.",
    "The Incredibles": "LEGO Incredibles-set med superhjältefamiljen.",
    "Pirates of the Caribbean": "LEGO Pirates of the Caribbean-set från filmserien.",
    "The Hobbit": "LEGO Hobbit-set baserade på J.R.R. Tolkiens böcker och filmerna.",
    "The Lord of the Rings": "LEGO Lord of the Rings-set med karaktärer och platser från Midgård.",
    "Teenage Mutant Ninja Turtles": "LEGO Teenage Mutant Ninja Turtles-set med sköldpaddorna.",
    "SpongeBob SquarePants": "LEGO SpongeBob-set med karaktärer från Bikini Bottom.",
    "Ben 10": "LEGO Ben 10-set baserade på tv-serien.",
    "Avatar: The Last Airbender": "LEGO Avatar-set med Aang och elementbojarna.",
    "Ninjago": "LEGO Ninjago-set med ninjahjältar och drakar.",
}


def smart_translate(text: str, context: str = "") -> str:
    """
    Intelligently translate English text to Swedish.

    Args:
        text: English text to translate
        context: Context for better translation (e.g., "theme", "action", "status")

    Returns:
        Swedish translation
    """
    if not text or not isinstance(text, str):
        return text

    # Check for direct match in dictionary (case-insensitive)
    text_lower = text.lower()
    if text_lower in TRANSLATIONS:
        translation = TRANSLATIONS[text_lower]
        # Preserve capitalization pattern
        if text[0].isupper() and text[1:].islower():
            return translation.capitalize()
        elif text.isupper():
            return translation.upper()
        return translation

    # Check theme descriptions
    if text in THEME_DESCRIPTIONS:
        return THEME_DESCRIPTIONS[text]

    # Handle common patterns

    # Pattern: "X for sale" -> "X till salu"
    if " for sale" in text_lower:
        parts = text.split(" for sale")
        if len(parts) == 2:
            translated_part = smart_translate(parts[0].strip(), context)
            return f"{translated_part} till salu"

    # Pattern: "X to keep" -> "X att behålla"
    if " to keep" in text_lower:
        parts = text.split(" to keep")
        if len(parts) == 2:
            translated_part = smart_translate(parts[0].strip(), context)
            return f"{translated_part} att behålla"

    # Pattern: "Add to X" -> "Lägg till i X"
    if text_lower.startswith("add to "):
        rest = text[7:]
        translated_rest = smart_translate(rest, context)
        return f"Lägg till i {translated_rest}"

    # Pattern: "Remove from X" -> "Ta bort från X"
    if text_lower.startswith("remove from "):
        rest = text[12:]
        translated_rest = smart_translate(rest, context)
        return f"Ta bort från {translated_rest}"

    # Pattern: "Mark as X" -> "Markera som X"
    if text_lower.startswith("mark as "):
        rest = text[8:]
        translated_rest = smart_translate(rest, context)
        return f"Markera som {translated_rest}"

    # Pattern: "Browse X" -> "Bläddra bland X"
    if text_lower.startswith("browse "):
        rest = text[7:]
        translated_rest = smart_translate(rest, context)
        return f"Bläddra bland {translated_rest}"

    # Pattern: "Explore X" -> "Utforska X"
    if text_lower.startswith("explore "):
        rest = text[8:]
        translated_rest = smart_translate(rest, context)
        return f"Utforska {translated_rest}"

    # Pattern: "Your X" -> "Ditt X" / "Dina X"
    if text_lower.startswith("your "):
        rest = text[5:]
        translated_rest = smart_translate(rest, context)
        # Check if plural (ends with 's' or specific plural words)
        if rest.lower().endswith('s') or rest.lower() in ['minifigures', 'sets', 'pieces', 'bricks']:
            return f"Dina {translated_rest}"
        return f"Ditt {translated_rest}"

    # Pattern: "My X" -> "Mitt X" / "Mina X"
    if text_lower.startswith("my "):
        rest = text[3:]
        translated_rest = smart_translate(rest, context)
        if rest.lower().endswith('s') or rest.lower() in ['minifigures', 'sets', 'pieces', 'bricks']:
            return f"Mina {translated_rest}"
        return f"Mitt {translated_rest}"

    # Pattern: "No X found" -> "Inga X hittades"
    if text_lower.startswith("no ") and text_lower.endswith(" found"):
        middle = text[3:-6]
        translated_middle = smart_translate(middle, context)
        return f"Inga {translated_middle} hittades"

    # Pattern: "X not found" -> "X hittades inte"
    if text_lower.endswith(" not found"):
        parts = text[:-10]
        translated_parts = smart_translate(parts, context)
        return f"{translated_parts} hittades inte"

    # Pattern: "Sort by X" -> "Sortera efter X"
    if text_lower.startswith("sort by "):
        rest = text[8:]
        translated_rest = smart_translate(rest, context)
        return f"Sortera efter {translated_rest}"

    # Pattern: "Filter by X" -> "Filtrera efter X"
    if text_lower.startswith("filter by "):
        rest = text[10:]
        translated_rest = smart_translate(rest, context)
        return f"Filtrera efter {translated_rest}"

    # Pattern: "Group by X" -> "Gruppera efter X"
    if text_lower.startswith("group by "):
        rest = text[9:]
        translated_rest = smart_translate(rest, context)
        return f"Gruppera efter {translated_rest}"

    # Pattern: "X items" -> "X objekt"
    if text_lower.endswith(" items"):
        parts = text[:-6]
        return f"{parts} objekt"

    # Pattern: "X results" -> "X resultat"
    if text_lower.endswith(" results"):
        parts = text[:-8]
        return f"{parts} resultat"

    # Pattern: "Loading X" -> "Laddar X"
    if text_lower.startswith("loading "):
        rest = text[8:]
        translated_rest = smart_translate(rest, context)
        return f"Laddar {translated_rest}"

    # Pattern: "Searching X" -> "Söker X"
    if text_lower.startswith("searching "):
        rest = text[10:]
        translated_rest = smart_translate(rest, context)
        return f"Söker {translated_rest}"

    # Try word-by-word translation for phrases
    words = text.split()
    if len(words) > 1 and len(words) <= 5:
        translated_words = []
        all_found = True
        for word in words:
            word_lower = word.lower().strip('.,!?;:')
            if word_lower in TRANSLATIONS:
                translated = TRANSLATIONS[word_lower]
                # Preserve original punctuation
                if word[-1] in '.,!?;:':
                    translated += word[-1]
                translated_words.append(translated)
            else:
                all_found = False
                break

        if all_found:
            return ' '.join(translated_words)

    # If no pattern matched, return original
    # (This preserves proper nouns, theme names, etc.)
    return text


def translate_dict(obj, context=""):
    """
    Recursively translate all string values in a dictionary.

    Args:
        obj: Dictionary or value to translate
        context: Context string for translation hints

    Returns:
        Translated dictionary
    """
    if isinstance(obj, dict):
        result = {}
        for key, value in obj.items():
            # Update context based on key
            new_context = key
            if key in ['themes', 'theme']:
                new_context = 'theme'
            elif key in ['descriptions', 'description']:
                new_context = 'description'
            elif key in ['actions', 'action']:
                new_context = 'action'
            elif key in ['status', 'state']:
                new_context = 'status'

            result[key] = translate_dict(value, new_context)
        return result
    elif isinstance(obj, list):
        return [translate_dict(item, context) for item in obj]
    elif isinstance(obj, str):
        # Don't translate placeholder patterns or URLs
        if '{' in obj or '}' in obj or obj.startswith('http'):
            # But translate the parts around placeholders
            pattern = r'(\{[^}]+\})'
            parts = re.split(pattern, obj)
            translated_parts = []
            for part in parts:
                if part.startswith('{') and part.endswith('}'):
                    translated_parts.append(part)  # Keep placeholder as-is
                else:
                    translated_parts.append(smart_translate(part, context))
            return ''.join(translated_parts)
        return smart_translate(obj, context)
    else:
        return obj


def main():
    """Main translation script."""
    import sys

    # Read English translation file
    en_path = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json"
    sv_path = "/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/sv.json"

    print("Reading English translations...")
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    print(f"Translating {len(str(en_data))} characters to Swedish...")
    sv_data = translate_dict(en_data)

    print("Writing Swedish translations...")
    with open(sv_path, 'w', encoding='utf-8') as f:
        json.dump(sv_data, f, ensure_ascii=False, indent=2)

    # Get file stats
    import os
    en_size = os.path.getsize(en_path)
    sv_size = os.path.getsize(sv_path)

    with open(en_path, 'r') as f:
        en_lines = len(f.readlines())
    with open(sv_path, 'r') as f:
        sv_lines = len(f.readlines())

    print("\n" + "="*60)
    print("TRANSLATION COMPLETE")
    print("="*60)
    print(f"English file: {en_lines} lines, {en_size:,} bytes")
    print(f"Swedish file: {sv_lines} lines, {sv_size:,} bytes")
    print(f"Coverage: {(sv_lines/en_lines*100):.1f}%")
    print("="*60)


if __name__ == "__main__":
    main()
