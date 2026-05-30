#!/usr/bin/env python3
"""
Generate complete Polish translation for FigTracker - Version 2
Improved handling of partial translations and context
"""

import json
import re

def load_comprehensive_translations():
    """Load comprehensive Polish translation mappings"""
    return {
        # Complete phrases - must be checked first (longest to shortest)
        "Frequently Asked Questions": "Najczęściej zadawane pytania",
        "Email Address": "Adres e-mail",
        "Sign In": "Zaloguj się",
        "Sign Up": "Zarejestruj się",
        "Sign Out": "Wyloguj się",
        "Log In": "Zaloguj się",
        "Log Out": "Wyloguj się",
        "Forgot Password": "Nie pamiętam hasła",
        "Reset Password": "Resetuj hasło",
        "Change Password": "Zmień hasło",
        "Create Account": "Utwórz konto",
        "Already have an account": "Masz już konto",
        "Don't have an account": "Nie masz konta",
        "Welcome Back": "Witamy ponownie",
        "Your Collection": "Twoja kolekcja",
        "Your Inventory": "Twój inwentarz",
        "Add to Collection": "Dodaj do kolekcji",
        "Add to Inventory": "Dodaj do inwentarza",
        "Add to keep": "Dodaj (zachować)",
        "Add to sell": "Dodaj (sprzedać)",
        "Remove from Collection": "Usuń z kolekcji",
        "Remove from Inventory": "Usuń z inwentarza",
        "Move to Collection": "Przenieś do kolekcji",
        "Move to Inventory": "Przenieś do inwentarza",
        "Total Value": "Całkowita wartość",
        "Total Items": "Wszystkich przedmiotów",
        "Avg Value": "Średnia wartość",
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
        "Read Guide": "Przeczytaj przewodnik",
        "Contact Support": "Skontaktuj się z pomocą",
        "Support Us": "Wesprzyj nas",
        "Free to use": "Darmowe",
        "No payment required": "Nie wymaga płatności",
        "Coming soon": "Wkrótce",
        "Last Updated": "Ostatnia aktualizacja",
        "Loading price": "Ładowanie ceny",
        "Refreshing now": "Odświeżanie",
        "No sellers available": "Brak sprzedawców",
        "No minifigs yet": "Brak minifigurek",
        "No sets yet": "Brak zestawów",
        "Your collection is empty": "Twoja kolekcja jest pusta",
        "Start adding to your personal collection": "Rozpocznij dodawanie do swojej kolekcji",
        "Start adding to your inventory": "Rozpocznij dodawanie do inwentarza",
        "Search for minifigs": "Szukaj minifigurek",
        "Search minifigs": "Szukaj minifigurek",
        "Search sets": "Szukaj zestawów",
        "Add Minifigs": "Dodaj minifigurki",
        "Add Sets": "Dodaj zestawy",
        "Browse Sets": "Przeglądaj zestawy",
        "All rights reserved": "Wszelkie prawa zastrzeżone",
        "Created by": "Stworzone przez",
        "We earn a commission from qualifying purchases": "Otrzymujemy prowizję od kwalifikujących się zakupów",
        "Community Leaderboards": "Rankingi społeczności",
        "This Quarter": "Ten kwartał",
        "All-Time": "Wszechczasów",
        "Top Minifig Collectors": "Najlepsi kolekcjonerzy minifigurek",
        "Top Set Collectors": "Najlepsi kolekcjonerzy zestawów",
        "Top Supporters": "Najlepsi wspierający",
        "No supporter yet": "Jeszcze brak wspierających",
        "Be the First to Donate": "Bądź pierwszym ofiarodawcą",
        "Support FigTracker": "Wesprzyj FigTracker",
        "Account Settings": "Ustawienia konta",
        "Subscribe Free": "Subskrybuj za darmo",
        "No spam": "Bez spamu",
        "Unsubscribe anytime": "Wypisz się w każdej chwili",
        "We respect your privacy": "Szanujemy Twoją prywatność",
        "Privacy Policy": "Polityka prywatności",
        "Terms of Service": "Regulamin",
        "For Sale": "Na sprzedaż",
        "To Keep": "Do zachowania",
        "Items to Sell": "Przedmioty na sprzedaż",
        "Popular Themes": "Popularne motywy",
        "All Themes": "Wszystkie motywy",
        "Current Themes": "Aktualne motywy",
        "Browse Themes": "Przeglądaj motywy",
        "Explore themes": "Odkryj motywy",
        "Date Added": "Data dodania",
        "High to Low": "Malejąco",
        "Low to High": "Rosnąco",
        "Newest to Oldest": "Od najnowszych",
        "Oldest to Newest": "Od najstarszych",

        # Single words - checked after phrases
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
        "Register": "Zarejestruj",
        "Email": "E-mail",
        "Password": "Hasło",
        "Name": "Imię",
        "Username": "Nazwa użytkownika",
        "Phone": "Telefon",
        "Address": "Adres",
        "City": "Miasto",
        "Country": "Kraj",
        "State": "Stan",
        "Yes": "Tak",
        "No": "Nie",
        "Okay": "OK",
        "Confirm": "Potwierdź",
        "Required": "Wymagane",
        "Optional": "Opcjonalne",
        "All": "Wszystkie",
        "None": "Brak",
        "Other": "Inne",
        "More": "Więcej",
        "Less": "Mniej",
        "New": "Nowy",
        "Used": "Używany",
        "Price": "Cena",
        "Quantity": "Ilość",
        "Total": "Suma",
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
        "Home": "Strona główna",
        "Minifigs": "Minifigurki",
        "Minifigures": "Minifigurki",
        "Sets": "Zestawy",
        "Inventory": "Inwentarz",
        "Collection": "Kolekcja",
        "Wishlist": "Lista życzeń",
        "Themes": "Motywy",
        "Guides": "Przewodniki",
        "Articles": "Artykuły",
        "Leaderboards": "Rankingi",
        "Sale": "Wyprzedaż",
        "Keep": "Zachować",
        "Pricing": "Wycena",
        "Condition": "Stan",
        "Updating": "Aktualizacja",
        "Refreshing": "Odświeżanie",
        "Items": "Przedmioty",
        "Newest": "Najnowsze",
        "Oldest": "Najstarsze",
        "Sponsored": "Sponsorowane",
        "Disclosure": "Ujawnienie",
        "Subscribe": "Subskrybuj",
        "Subscribing": "Subskrybowanie",
        "Unsubscribe": "Wypisz się",
        "Newsletter": "Newsletter",
        "Donate": "Wspomóż",
        "Menu": "Menu",
        "Dashboard": "Panel",
        "Admin": "Administrator",
        "Guide": "Przewodnik",
        "Article": "Artykuł",
        "Share": "Udostępnij",
        "Clear": "Wyczyść",

        # LEGO-specific terms
        "minifigure": "minifigurka",
        "minifigures": "minifigurki",
        "minifig": "minifigurka",
        "minifigs": "minifigurki",
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
    }

def should_skip_translation(text):
    """Check if text should be skipped entirely"""
    if not isinstance(text, str):
        return True

    # Skip URLs
    if text.startswith(('http://', 'https://', 'www.', '/')):
        return True

    # Skip email addresses
    if '@' in text and '.' in text:
        return True

    # Skip pure template variables
    if re.match(r'^{[^}]+}$', text):
        return True

    # Skip brand names when standalone
    if text in ['LEGO', 'LEGO®', 'BrickLink', 'FigTracker', 'Amazon', 'eBay', 'PayPal', 'Netflix', 'Disney']:
        return True

    return False

def translate_string(text, translations):
    """Translate a single string with proper context handling"""
    if should_skip_translation(text):
        return text

    # Preserve HTML tags
    has_html = bool(re.search(r'<[^>]+>', text))
    if has_html:
        # Extract and translate text between tags
        def translate_html_content(match):
            content = match.group(1)
            return f"<{match.group(0)[1:-1]}>{translate_string(content, translations)}</"
        # This is complex, so we'll do simple replacement instead
        result = text
        for eng, pol in sorted(translations.items(), key=lambda x: len(x[0]), reverse=True):
            if eng in result and not eng[0].islower():  # Only replace capitalized phrases in HTML
                result = result.replace(eng, pol)
        return result

    # Check for exact match first
    if text in translations:
        return translations[text]

    # Check for template variables
    if '{' in text and '}' in text:
        result = text
        # Translate around variables
        for eng, pol in sorted(translations.items(), key=lambda x: len(x[0]), reverse=True):
            # Use word boundaries when possible
            if ' ' in eng or eng[0].isupper():
                result = result.replace(eng, pol)
        return result

    # Regular translation with word boundaries
    result = text
    for eng, pol in sorted(translations.items(), key=lambda x: len(x[0]), reverse=True):
        if eng.lower() in result.lower():
            # Case-insensitive replacement with word boundaries
            pattern = r'\b' + re.escape(eng) + r'\b'
            result = re.sub(pattern, pol, result, flags=re.IGNORECASE)

    return result

def translate_dict(obj, translations, path=""):
    """Recursively translate dictionary"""
    if isinstance(obj, dict):
        result = {}
        for key, value in obj.items():
            result[key] = translate_dict(value, translations, f"{path}.{key}")
        return result
    elif isinstance(obj, list):
        return [translate_dict(item, translations, f"{path}[]") for item in obj]
    elif isinstance(obj, str):
        return translate_string(obj, translations)
    else:
        return obj

def main():
    print("Loading English translation file...")

    en_path = '/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json'
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    print(f"Loaded English data: {len(json.dumps(en_data)):,} bytes")

    # Load translations
    translations = load_comprehensive_translations()
    print(f"Loaded {len(translations):,} translation mappings")

    print("Translating to Polish...")
    pl_data = translate_dict(en_data, translations)

    # Write output
    output_path = '/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/pl.json'
    print(f"Writing to {output_path}...")

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(pl_data, f, ensure_ascii=False, indent=2)

    print("✅ Polish translation complete!")

    # Stats
    import os
    file_size = os.path.getsize(output_path)
    with open(output_path, 'r') as f:
        line_count = sum(1 for _ in f)

    print(f"📊 Stats:")
    print(f"   - File size: {file_size:,} bytes (~{file_size/1024:.0f}KB)")
    print(f"   - Lines: {line_count:,}")
    print(f"   - Output: {output_path}")

if __name__ == "__main__":
    main()
