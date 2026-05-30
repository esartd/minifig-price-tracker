#!/usr/bin/env python3
import json
import re

def load_translations():
    """Load Polish translations organized by priority"""
    # Multi-word phrases MUST be checked first
    phrases = {
        # Complete sentences and long phrases
        "Frequently Asked Questions": "Najczęściej zadawane pytania",
        "Email Address": "Adres e-mail",
        "Your name": "Twoje imię",
        "your@email.com": "twoj@email.com",
        "At least 6 characters": "Co najmniej 6 znaków",
        "Enter your password": "Wprowadź swoje hasło",
        "Already have an account": "Masz już konto",
        "Don't have an account": "Nie masz konta",
        "Welcome Back": "Witamy ponownie",
        "Create Account": "Utwórz konto",
        "Creating Account": "Tworzenie konta",
        "Sign In": "Zaloguj się",
        "Sign Up": "Zarejestruj się",
        "Sign Out": "Wyloguj się",
        "Forgot Password": "Nie pamiętam hasła",
        "Reset Password": "Resetuj hasło",
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
        "For Sale": "Na sprzedaż",
        "To Keep": "Do zachowania",
        "Items to Sell": "Przedmioty na sprzedaż",
        "Popular Themes": "Popularne motywy",
        "All Themes": "Wszystkie motywy",
        "Current Themes": "Aktualne motywy",
        "Date Added": "Data dodania",
        "High to Low": "Malejąco",
        "Low to High": "Rosnąco",
    }

    # Single words - only translate as standalone words
    words = {
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
        "Email": "E-mail",
        "Password": "Hasło",
        "Name": "Imię",
        "Yes": "Tak",
        "No": "Nie",
        "Confirm": "Potwierdź",
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
        "Help": "Pomoc",
        "Support": "Wsparcie",
        "Contact": "Kontakt",
        "About": "O nas",
        "FAQ": "FAQ",
        "Privacy": "Prywatność",
        "Error": "Błąd",
        "Success": "Sukces",
        "Warning": "Ostrzeżenie",
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
        "Items": "Przedmioty",
        "Newest": "Najnowsze",
        "Oldest": "Najstarsze",
        "Sponsored": "Sponsorowane",
        "Disclosure": "Ujawnienie",
        "Subscribe": "Subskrybuj",
        "Newsletter": "Newsletter",
        "Donate": "Wspomóż",
        "Menu": "Menu",
        "Dashboard": "Panel",
        "Admin": "Administrator",
        "Guide": "Przewodnik",
        "Article": "Artykuł",
        "Share": "Udostępnij",
        "Clear": "Wyczyść",
        "minifigure": "minifigurka",
        "minifigures": "minifigurki",
        "minifig": "minifigurka",
        "minifigs": "minifigurki",
        "set": "zestaw",
        "sets": "zestawy",
        "theme": "motyw",
        "themes": "motywy",
    }

    return phrases, words

def translate_string(text, phrases, words):
    """Smart translation with context awareness"""
    if not isinstance(text, str) or not text.strip():
        return text

    # Skip URLs, emails, brand names when standalone
    if text.startswith(('http://', 'https://', 'www.', '/', '@')):
        return text
    if text in ['LEGO', 'LEGO®', 'BrickLink', 'FigTracker', 'Amazon', 'eBay', 'PayPal']:
        return text

    # Check for exact phrase match first
    if text in phrases:
        return phrases[text]

    # For text with template variables, be careful
    if '{' in text and '}' in text:
        result = text
        # Only replace complete phrases around variables
        for eng, pol in phrases.items():
            if eng in result:
                result = result.replace(eng, pol)
        return result

    # For regular text, replace phrases first, then words
    result = text

    # Replace phrases (longest first to avoid partial matches)
    for eng, pol in sorted(phrases.items(), key=lambda x: -len(x[0])):
        if eng in result:
            result = result.replace(eng, pol)

    # Only translate standalone words (with word boundaries)
    for eng, pol in words.items():
        # Use word boundaries to avoid partial matches
        pattern = r'\b' + re.escape(eng) + r'\b'
        result = re.sub(pattern, pol, result, flags=re.IGNORECASE)

    return result

def translate_dict(obj, phrases, words, depth=0):
    """Recursively translate dictionary"""
    if isinstance(obj, dict):
        return {k: translate_dict(v, phrases, words, depth+1) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [translate_dict(item, phrases, words, depth+1) for item in obj]
    elif isinstance(obj, str):
        return translate_string(obj, phrases, words)
    else:
        return obj

print("Loading English file...")
with open('/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

print("Loading Polish translations...")
phrases, words = load_translations()
print(f"  - {len(phrases)} phrases")
print(f"  - {len(words)} words")

print("Translating...")
pl_data = translate_dict(en_data, phrases, words)

output_path = '/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/pl.json'
print(f"Writing to {output_path}...")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(pl_data, f, ensure_ascii=False, indent=2)

import os
size = os.path.getsize(output_path)
with open(output_path) as f:
    lines = sum(1 for _ in f)

print(f"\n✅ Complete!")
print(f"📊 {size:,} bytes (~{size/1024:.0f}KB)")
print(f"📄 {lines:,} lines")
