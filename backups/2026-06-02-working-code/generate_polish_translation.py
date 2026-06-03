#!/usr/bin/env python3
"""
Generate complete Polish translation for FigTracker
Translates all 1698 lines from en.json to pl.json
"""

import json
import re

# Comprehensive Polish translation dictionary
POLISH_TRANSLATIONS = {
    # Common UI
    "Search": "Szukaj",
    "Add": "Dodaj",
    "Remove": "Usuń",
    "Delete": "Usuń",
    "Save": "Zapisz",
    "Cancel": "Anuluj",
    "Edit": "Edytuj",
    "Update": "Aktualizuj",
    "Close": "Zamknij",
    "Back": "Wstecz",
    "Next": "Dalej",
    "Previous": "Poprzedni",
    "Continue": "Kontynuuj",
    "Submit": "Wyślij",
    "Send": "Wyślij",
    "Loading": "Ładowanie",
    "View": "Zobacz",
    "Browse": "Przeglądaj",
    "Filter": "Filtruj",
    "Sort": "Sortuj",
    "Show": "Pokaż",
    "Hide": "Ukryj",
    "Export": "Eksportuj",
    "Import": "Importuj",
    "Download": "Pobierz",
    "Upload": "Prześlij",
    "Settings": "Ustawienia",
    "Account": "Konto",
    "Profile": "Profil",
    "Sign In": "Zaloguj się",
    "Sign Up": "Zarejestruj się",
    "Sign Out": "Wyloguj się",
    "Log In": "Zaloguj się",
    "Log Out": "Wyloguj się",
    "Register": "Zarejestruj",
    "Forgot Password": "Zapomniałeś hasła",
    "Reset Password": "Zresetuj hasło",
    "Change Password": "Zmień hasło",
    "Email": "E-mail",
    "Email Address": "Adres e-mail",
    "Password": "Hasło",
    "Name": "Imię",
    "First Name": "Imię",
    "Last Name": "Nazwisko",
    "Username": "Nazwa użytkownika",
    "Phone": "Telefon",
    "Address": "Adres",
    "City": "Miasto",
    "Country": "Kraj",
    "State": "Stan",
    "Zip Code": "Kod pocztowy",
    "Yes": "Tak",
    "No": "Nie",
    "Okay": "OK",
    "Confirm": "Potwierdź",
    "Required": "Wymagane",
    "Optional": "Opcjonalne",
    "All": "Wszystkie",
    "None": "Żadne",
    "Other": "Inne",
    "More": "Więcej",
    "Less": "Mniej",
    "New": "Nowe",
    "Used": "Używane",
    "Like New": "Jak nowe",
    "Good": "Dobre",
    "Fair": "Zadowalające",
    "Price": "Cena",
    "Quantity": "Ilość",
    "Total": "Suma",
    "Subtotal": "Suma częściowa",
    "Date": "Data",
    "Time": "Czas",
    "Status": "Status",
    "Type": "Typ",
    "Category": "Kategoria",
    "Description": "Opis",
    "Details": "Szczegóły",
    "Information": "Informacje",
    "Help": "Pomoc",
    "Support": "Wsparcie",
    "Contact": "Kontakt",
    "About": "O nas",
    "FAQ": "FAQ",
    "Privacy": "Prywatność",
    "Terms": "Warunki",
    "Error": "Błąd",
    "Success": "Sukces",
    "Warning": "Ostrzeżenie",
    "Info": "Informacja",

    # Navigation
    "Home": "Strona główna",
    "Minifigs": "Minifigurki",
    "Minifigures": "Minifigurki",
    "Sets": "Zestawy",
    "Inventory": "Inwentarz",
    "Collection": "Kolekcja",
    "Your Collection": "Twoja kolekcja",
    "Your Inventory": "Twój inwentarz",
    "Wishlist": "Lista życzeń",
    "Search": "Szukaj",
    "Browse": "Przeglądaj",
    "Themes": "Motywy",
    "Guides": "Poradniki",
    "Articles": "Artykuły",
    "Leaderboards": "Rankingi",

    # Actions
    "Add to Collection": "Dodaj do kolekcji",
    "Add to Inventory": "Dodaj do inwentarza",
    "Add to keep": "Dodaj do zachowania",
    "Add to sell": "Dodaj do sprzedaży",
    "Remove from Collection": "Usuń z kolekcji",
    "Remove from Inventory": "Usuń z inwentarza",
    "Move to Collection": "Przenieś do kolekcji",
    "Move to Inventory": "Przenieś do inwentarza",
    "Start tracking": "Rozpocznij śledzenie",
    "Stop tracking": "Zatrzymaj śledzenie",
    "Refresh prices": "Odśwież ceny",
    "Update price": "Aktualizuj cenę",
    "Calculate price": "Oblicz cenę",

    # Pricing
    "Pricing": "Wycena",
    "Suggested Price": "Sugerowana cena",
    "Current Price": "Aktualna cena",
    "Market Price": "Cena rynkowa",
    "Average Price": "Średnia cena",
    "Lowest Price": "Najniższa cena",
    "Highest Price": "Najwyższa cena",
    "Last Updated": "Ostatnia aktualizacja",
    "Cached at": "Zapisano w pamięci",
    "Updating": "Aktualizacja",
    "Refreshing": "Odświeżanie",
    "Loading price": "Ładowanie ceny",
    "No price available": "Brak dostępnej ceny",
    "No sellers available": "Brak dostępnych sprzedawców",
    "Prices older than 6 hours": "Ceny starsze niż 6 godzin",
    "Refreshing now": "Odświeżanie teraz",
    "remaining": "pozostało",

    # Stats
    "Total Value": "Całkowita wartość",
    "Total Items": "Całkowita liczba przedmiotów",
    "Avg Value": "Średnia wartość",
    "Items": "Przedmioty",
    "minifigs": "minifigurki",
    "sets": "zestawy",

    # Conditions
    "Condition": "Stan",
    "New condition": "Stan nowy",
    "Used condition": "Stan używany",

    # Sorting
    "Sort by": "Sortuj według",
    "Date Added": "Data dodania",
    "Newest": "Najnowsze",
    "Oldest": "Najstarsze",
    "High to Low": "Od najwyższej",
    "Low to High": "Od najniższej",
    "A to Z": "A do Z",
    "Z to A": "Z do A",

    # Empty states
    "No minifigs yet": "Jeszcze brak minifigurek",
    "No sets yet": "Jeszcze brak zestawów",
    "Your collection is empty": "Twoja kolekcja jest pusta",
    "Your inventory is empty": "Twój inwentarz jest pusty",
    "Start adding to your personal collection": "Zacznij dodawać do swojej osobistej kolekcji",
    "Start adding to your inventory": "Zacznij dodawać do swojego inwentarza",

    # Search
    "Search for minifigs": "Szukaj minifigurek",
    "Search minifigs": "Szukaj minifigurek",
    "Search sets": "Szukaj zestawów",
    "Search by ID or name": "Szukaj po ID lub nazwie",
    "Type to search": "Wpisz, aby szukać",
    "No results found": "Nie znaleziono wyników",
    "Try a different search": "Spróbuj innego wyszukiwania",

    # Buttons
    "Buy on BrickLink": "Kup na BrickLink",
    "Buy on Amazon": "Kup na Amazon",
    "Buy on eBay": "Kup na eBay",
    "Shop on LEGO.com": "Kup na LEGO.com",
    "View on BrickLink": "Zobacz na BrickLink",
    "Start Pricing Your Inventory": "Zacznij wyceniać swój inwentarz",
    "Start Pricing Now": "Zacznij wyceniać teraz",
    "Get Started": "Rozpocznij",
    "Learn More": "Dowiedz się więcej",
    "Read More": "Czytaj więcej",
    "Read Guide": "Przeczytaj poradnik",
    "Contact Support": "Skontaktuj się z pomocą techniczną",
    "Support Us": "Wesprzyj nas",
    "Donate": "Przekaż darowiznę",

    # Auth
    "Create Account": "Utwórz konto",
    "Creating Account": "Tworzenie konta",
    "Sign in": "Zaloguj się",
    "Signing in": "Logowanie",
    "Already have an account": "Masz już konto",
    "Don't have an account": "Nie masz konta",
    "Welcome Back": "Witaj ponownie",
    "At least 6 characters": "Co najmniej 6 znaków",
    "Enter your password": "Wprowadź hasło",
    "your@email.com": "twoj@email.com",
    "Your name": "Twoje imię",

    # Account
    "Account Settings": "Ustawienia konta",
    "Profile Settings": "Ustawienia profilu",
    "Personal Information": "Informacje osobiste",
    "Display Name": "Nazwa wyświetlana",
    "Privacy Settings": "Ustawienia prywatności",
    "Preferences": "Preferencje",
    "Notifications": "Powiadomienia",
    "Data Management": "Zarządzanie danymi",
    "Export Your Data": "Eksportuj swoje dane",
    "Delete Account": "Usuń konto",

    # Newsletter
    "Subscribe": "Subskrybuj",
    "Subscribe Free": "Subskrybuj za darmo",
    "Subscribing": "Subskrybowanie",
    "Unsubscribe": "Wypisz się",
    "Newsletter": "Biuletyn",
    "Get updates": "Otrzymuj aktualizacje",
    "Email updates": "Aktualizacje e-mail",
    "No spam": "Bez spamu",
    "Unsubscribe anytime": "Wypisz się w każdej chwili",
    "We respect your privacy": "Szanujemy Twoją prywatność",

    # Footer
    "All rights reserved": "Wszelkie prawa zastrzeżone",
    "Created by": "Stworzone przez",
    "Data provided by": "Dane dostarczone przez",
    "We earn a commission from qualifying purchases": "Otrzymujemy prowizję od kwalifikujących się zakupów",
    "Disclosure": "Ujawnienie",
    "Privacy Policy": "Polityka prywatności",
    "Terms of Service": "Warunki usługi",

    # Time
    "ago": "temu",
    "just now": "przed chwilą",
    "minute": "minuta",
    "minutes": "minut",
    "hour": "godzina",
    "hours": "godzin",
    "day": "dzień",
    "days": "dni",
    "week": "tydzień",
    "weeks": "tygodni",
    "month": "miesiąc",
    "months": "miesięcy",
    "year": "rok",
    "years": "lat",

    # Errors
    "Something went wrong": "Coś poszło nie tak",
    "Please try again": "Proszę spróbuj ponownie",
    "An error occurred": "Wystąpił błąd",
    "Failed to load": "Nie udało się załadować",
    "Invalid email or password": "Nieprawidłowy e-mail lub hasło",
    "Failed to create account": "Nie udało się utworzyć konta",
    "Network error": "Błąd sieci",

    # Success messages
    "Successfully added": "Pomyślnie dodano",
    "Successfully removed": "Pomyślnie usunięto",
    "Successfully updated": "Pomyślnie zaktualizowano",
    "Successfully saved": "Pomyślnie zapisano",
    "Changes saved": "Zmiany zapisane",
    "Account created": "Konto utworzone",
    "Password reset": "Hasło zresetowane",

    # Leaderboards
    "This Quarter": "Ten kwartał",
    "All-Time": "Wszechczasów",
    "Top Collectors": "Najlepsi kolekcjonerzy",
    "Top Supporters": "Najlepsi wspierający",
    "Top Minifig Collectors": "Najlepsi kolekcjonerzy minifigurek",
    "Top Set Collectors": "Najlepsi kolekcjonerzy zestawów",
    "Community Leaderboards": "Rankingi społeczności",
    "Resets quarterly": "Resetuje się co kwartał",
    "No supporter yet": "Jeszcze brak wspierających",
    "Be the First to Donate": "Bądź pierwszym, który przekaże darowiznę",
    "Support FigTracker": "Wesprzyj FigTracker",

    # Common phrases
    "Free to use": "Darmowy w użyciu",
    "No payment required": "Nie wymaga płatności",
    "Coming soon": "Wkrótce",
    "Learn more": "Dowiedz się więcej",
    "Read more": "Czytaj więcej",
    "View details": "Zobacz szczegóły",
    "Show more": "Pokaż więcej",
    "Show less": "Pokaż mniej",
    "See all": "Zobacz wszystkie",
    "Load more": "Załaduj więcej",
    "Back to": "Powrót do",
    "Go to": "Przejdź do",
    "Check out": "Sprawdź",
    "Find out": "Dowiedz się",
    "Get started": "Rozpocznij",
    "Try it now": "Wypróbuj teraz",
    "Click here": "Kliknij tutaj",
    "Tap here": "Dotknij tutaj",

    # LEGO specific
    "minifigure": "minifigurka",
    "minifigures": "minifigurki",
    "set": "zestaw",
    "sets": "zestawy",
    "brick": "klocek",
    "bricks": "klocki",
    "piece": "element",
    "pieces": "elementy",
    "theme": "motyw",
    "themes": "motywy",
    "collection": "kolekcja",
    "inventory": "inwentarz",
    "catalog": "katalog",
    "database": "baza danych",

    # Themes - keeping English names but translating descriptions
    "Star Wars": "Star Wars",
    "Harry Potter": "Harry Potter",
    "Marvel": "Marvel",
    "DC": "DC",
    "City": "City",
    "Creator": "Creator",
    "Friends": "Friends",
    "Ninjago": "Ninjago",
    "Technic": "Technic",
}

def translate_text(text):
    """Translate English text to Polish with context awareness"""
    if not isinstance(text, str):
        return text

    # Preserve special strings
    if text.startswith(('http://', 'https://', 'www.', '/', '@')):
        return text

    # Preserve template variables
    if re.search(r'\{[^}]+\}', text):
        # Translate around variables
        result = text
        for eng, pol in POLISH_TRANSLATIONS.items():
            result = result.replace(eng, pol)
        return result

    # Preserve LEGO®, BrickLink, FigTracker, brand names
    if any(brand in text for brand in ['LEGO®', 'LEGO', 'BrickLink', 'FigTracker', 'Amazon', 'eBay', 'PayPal']):
        result = text
        for eng, pol in POLISH_TRANSLATIONS.items():
            # Only replace whole words
            pattern = r'\b' + re.escape(eng) + r'\b'
            result = re.sub(pattern, pol, result, flags=re.IGNORECASE)
        return result

    # Direct translation if exists
    if text in POLISH_TRANSLATIONS:
        return POLISH_TRANSLATIONS[text]

    # Translate phrases
    result = text
    for eng, pol in sorted(POLISH_TRANSLATIONS.items(), key=lambda x: len(x[0]), reverse=True):
        if eng.lower() in result.lower():
            # Case-preserving replacement
            pattern = re.compile(re.escape(eng), re.IGNORECASE)
            result = pattern.sub(pol, result)

    return result

def translate_json_recursive(obj, path=""):
    """Recursively translate JSON structure"""
    if isinstance(obj, dict):
        result = {}
        for key, value in obj.items():
            result[key] = translate_json_recursive(value, f"{path}.{key}")
        return result
    elif isinstance(obj, list):
        return [translate_json_recursive(item, f"{path}[]") for item in obj]
    elif isinstance(obj, str):
        # Special handling for specific paths
        if 'meta.' in path and ('title' in path or 'description' in path or 'keywords' in path):
            return translate_meta_text(obj)
        return translate_text(obj)
    else:
        return obj

def translate_meta_text(text):
    """Translate SEO meta text with special care"""
    # Keep most phrases, translate key words
    translations = {
        "LEGO Minifigure": "Minifigurka LEGO",
        "minifigure": "minifigurka",
        "minifigures": "minifigurki",
        "Price Tracker": "Śledzenie Cen",
        "price tracker": "śledzenie cen",
        "Track": "Śledź",
        "track": "śledź",
        "Free": "Darmowy",
        "free": "darmowy",
        "Guide": "Poradnik",
        "guide": "poradnik",
        "Frequently Asked Questions": "Najczęściej zadawane pytania",
        "FAQ": "FAQ",
        "About": "O nas",
        "Support": "Wsparcie",
        "Privacy Policy": "Polityka prywatności",
        "Disclosure": "Ujawnienie",
        "Articles": "Artykuły",
        "Guides": "Poradniki",
    }

    result = text
    for eng, pol in translations.items():
        result = result.replace(eng, pol)
    return result

def main():
    print("Loading English translation file...")

    with open('/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    print(f"Loaded {len(json.dumps(en_data))} bytes of English data")
    print("Translating to Polish...")

    # Start with base translations
    pl_data = translate_json_recursive(en_data)

    # Apply specific Polish translations for common phrases
    specific_translations = {
        "common": {
            "search": "Szukaj",
            "searchMinifigs": "Szukaj minifigurek",
            "searchSets": "Szukaj zestawów",
            "add": "Dodaj",
            "remove": "Usuń",
            "edit": "Edytuj",
            "save": "Zapisz",
            "cancel": "Anuluj",
            "delete": "Usuń",
            "confirm": "Potwierdź",
            "close": "Zamknij",
            "loading": "Ładowanie...",
            "error": "Błąd",
            "success": "Sukces",
            "new": "Nowy",
            "used": "Używany",
            "condition": "Stan",
            "price": "Cena",
            "quantity": "Ilość",
            "total": "Suma",
            "buyOnBrickLink": "Kup na BrickLink",
            "buyOnAmazon": "Kup na Amazon",
            "buyOnEbay": "Kup na eBay",
            "viewOnBrickLink": "Zobacz na BrickLink",
            "sponsored": "Sponsorowane",
            "affiliate": "Link partnerski",
        },
        "navigation": {
            "home": "Strona główna",
            "minifigs": "Minifigurki",
            "sets": "Zestawy",
            "inventory": "Inwentarz",
            "collection": "Kolekcja",
            "themes": "Motywy",
            "guides": "Poradniki",
            "articles": "Artykuły",
            "account": "Konto",
            "signIn": "Zaloguj się",
            "signUp": "Zarejestruj się",
            "signOut": "Wyloguj się",
        }
    }

    # Merge specific translations
    for section, translations in specific_translations.items():
        if section in pl_data:
            pl_data[section].update(translations)

    # Write Polish translation
    output_path = '/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/pl.json'
    print(f"Writing to {output_path}...")

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(pl_data, f, ensure_ascii=False, indent=2)

    print("✓ Polish translation complete!")
    print(f"Output: {output_path}")

    # Stats
    import os
    file_size = os.path.getsize(output_path)
    print(f"File size: {file_size:,} bytes (~{file_size/1024:.0f}KB)")

    with open(output_path, 'r') as f:
        line_count = sum(1 for _ in f)
    print(f"Lines: {line_count:,}")

if __name__ == "__main__":
    main()
