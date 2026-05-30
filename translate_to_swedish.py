#!/usr/bin/env python3
"""
Complete Swedish translation for FigTracker
Translates ALL sections from en.json to sv.json
"""

import json
import re
from pathlib import Path
from deep_translator import GoogleTranslator

# Constants
EN_PATH = Path("/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/en.json")
SV_PATH = Path("/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup/sv.json")

# Terms to preserve
PRESERVE_TERMS = [
    "LEGO®",
    "LEGO",
    "BrickLink",
    "FigTracker",
    "eBay",
    "Amazon",
    "USD",
    "EUR",
    "GBP",
    "DKK",
    "SEK",
]

# Variable patterns to preserve (e.g., {count}, {theme}, etc.)
VARIABLE_PATTERN = re.compile(r'\{[^}]+\}')
URL_PATTERN = re.compile(r'https?://[^\s]+')

def protect_special_content(text):
    """Replace special content with placeholders before translation"""
    if not isinstance(text, str):
        return text, {}

    placeholders = {}
    counter = 0

    # Protect variables like {count}, {theme}, etc.
    for match in VARIABLE_PATTERN.finditer(text):
        placeholder = f"__VAR_{counter}__"
        placeholders[placeholder] = match.group()
        text = text.replace(match.group(), placeholder)
        counter += 1

    # Protect URLs
    for match in URL_PATTERN.finditer(text):
        placeholder = f"__URL_{counter}__"
        placeholders[placeholder] = match.group()
        text = text.replace(match.group(), placeholder)
        counter += 1

    # Protect brand names and special terms
    for term in PRESERVE_TERMS:
        if term in text:
            placeholder = f"__TERM_{counter}__"
            placeholders[placeholder] = term
            text = text.replace(term, placeholder)
            counter += 1

    return text, placeholders

def restore_special_content(text, placeholders):
    """Restore protected content after translation"""
    if not isinstance(text, str):
        return text

    for placeholder, original in placeholders.items():
        text = text.replace(placeholder, original)

    return text

def translate_text(text, translator):
    """Translate a single text string"""
    if not text or not isinstance(text, str):
        return text

    # Skip if text is just a variable or URL
    if text.startswith("{") and text.endswith("}"):
        return text
    if text.startswith("http"):
        return text

    # Protect special content
    protected_text, placeholders = protect_special_content(text)

    try:
        # Translate
        translated = translator.translate(protected_text)

        # Restore special content
        result = restore_special_content(translated, placeholders)

        return result
    except Exception as e:
        print(f"Warning: Translation failed for '{text[:50]}...': {e}")
        return text

def translate_dict(data, translator, path=""):
    """Recursively translate dictionary values"""
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            current_path = f"{path}.{key}" if path else key
            print(f"Translating: {current_path}")
            result[key] = translate_dict(value, translator, current_path)
        return result
    elif isinstance(data, str):
        return translate_text(data, translator)
    elif isinstance(data, list):
        return [translate_dict(item, translator, path) for item in data]
    else:
        return data

def apply_swedish_lego_terms(data):
    """Apply proper Swedish LEGO terminology"""
    replacements = {
        # LEGO-specific terms
        "LEGO bricks": "LEGO-klossar",
        "bricks": "klossar",
        "minifigures": "minifigurer",
        "minifigure": "minifigur",
        "sets": "set",
        "set": "set",
        "pieces": "bitar",
        "piece": "bit",
        "collection": "samling",
        "inventory": "inventering",
        "wishlist": "önskelista",
    }

    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            result[key] = apply_swedish_lego_terms(value)
        return result
    elif isinstance(data, str):
        text = data
        for en_term, sv_term in replacements.items():
            # Case-insensitive replacement but preserve capitalization pattern
            text = re.sub(
                rf'\b{re.escape(en_term)}\b',
                sv_term,
                text,
                flags=re.IGNORECASE
            )
        return text
    elif isinstance(data, list):
        return [apply_swedish_lego_terms(item) for item in data]
    else:
        return data

def main():
    print("=" * 60)
    print("FigTracker Swedish Translation Generator")
    print("=" * 60)
    print()

    # Load English source
    print(f"Loading English source: {EN_PATH}")
    with open(EN_PATH, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    print(f"English file loaded: {len(json.dumps(en_data))} characters")
    print()

    # Initialize translator
    print("Initializing Google Translator (English → Swedish)...")
    translator = GoogleTranslator(source='en', target='sv')
    print()

    # Translate all content
    print("Starting translation...")
    print("This will take several minutes. Please be patient.")
    print()

    sv_data = translate_dict(en_data, translator)

    print()
    print("Translation complete. Applying Swedish LEGO terminology...")
    sv_data = apply_swedish_lego_terms(sv_data)

    # Save result
    print(f"Saving Swedish translation: {SV_PATH}")
    with open(SV_PATH, 'w', encoding='utf-8') as f:
        json.dump(sv_data, f, ensure_ascii=False, indent=2)

    # Verify result
    sv_size = SV_PATH.stat().st_size
    en_size = EN_PATH.stat().st_size

    print()
    print("=" * 60)
    print("Translation Complete!")
    print("=" * 60)
    print(f"English file: {en_size:,} bytes")
    print(f"Swedish file: {sv_size:,} bytes")
    print(f"Completion: {(sv_size / en_size) * 100:.1f}%")

    # Count lines
    with open(SV_PATH, 'r', encoding='utf-8') as f:
        sv_lines = len(f.readlines())

    with open(EN_PATH, 'r', encoding='utf-8') as f:
        en_lines = len(f.readlines())

    print(f"English lines: {en_lines}")
    print(f"Swedish lines: {sv_lines}")
    print()
    print(f"Swedish translation saved to: {SV_PATH}")
    print("=" * 60)

if __name__ == "__main__":
    main()
