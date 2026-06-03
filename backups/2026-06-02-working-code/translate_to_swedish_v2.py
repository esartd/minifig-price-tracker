#!/usr/bin/env python3
"""
Complete Swedish translation for FigTracker
Translates ALL sections from en.json to sv.json using googletrans
"""

import json
import re
import time
from pathlib import Path

# Try different translation libraries
translator_lib = None
try:
    from googletrans import Translator
    translator_lib = "googletrans"
    print("Using googletrans library")
except ImportError:
    try:
        from deep_translator import GoogleTranslator
        translator_lib = "deep_translator"
        print("Using deep_translator library")
    except ImportError:
        print("ERROR: No translation library found!")
        print("Please install one of:")
        print("  pip3 install googletrans==4.0.0-rc1")
        print("  pip3 install deep-translator")
        exit(1)

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
        placeholder = f"__VAR{counter}__"
        placeholders[placeholder] = match.group()
        text = text.replace(match.group(), placeholder)
        counter += 1

    # Protect URLs
    for match in URL_PATTERN.finditer(text):
        placeholder = f"__URL{counter}__"
        placeholders[placeholder] = match.group()
        text = text.replace(match.group(), placeholder)
        counter += 1

    # Protect brand names and special terms
    for term in PRESERVE_TERMS:
        if term in text:
            placeholder = f"__TERM{counter}__"
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

def translate_text(text, translator, retry_count=0):
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
        # Translate based on library
        if translator_lib == "googletrans":
            result = translator.translate(protected_text, src='en', dest='sv')
            translated = result.text
        else:  # deep_translator
            translated = translator.translate(protected_text)

        # Restore special content
        result = restore_special_content(translated, placeholders)

        # Small delay to avoid rate limiting
        time.sleep(0.1)

        return result

    except Exception as e:
        if retry_count < 3:
            print(f"  Retry {retry_count + 1} for: {text[:50]}...")
            time.sleep(1)
            return translate_text(text, translator, retry_count + 1)
        else:
            print(f"Warning: Translation failed for '{text[:50]}...': {e}")
            return text

def translate_dict(data, translator, path="", count_ref=None):
    """Recursively translate dictionary values"""
    if count_ref is None:
        count_ref = {"count": 0, "total": 0}

    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            current_path = f"{path}.{key}" if path else key
            result[key] = translate_dict(value, translator, current_path, count_ref)
        return result
    elif isinstance(data, str):
        count_ref["count"] += 1
        if count_ref["count"] % 10 == 0:
            print(f"Translated {count_ref['count']} strings... ({path})")
        return translate_text(data, translator)
    elif isinstance(data, list):
        return [translate_dict(item, translator, path, count_ref) for item in data]
    else:
        return data

def apply_swedish_lego_terms(data):
    """Apply proper Swedish LEGO terminology"""
    replacements = {
        # Keep these Swedish terms consistent
        "LEGO-klossar": "LEGO-klossar",
        "minifigurer": "minifigurer",
        "minifigur": "minifigur",
    }

    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            result[key] = apply_swedish_lego_terms(value)
        return result
    elif isinstance(data, str):
        text = data
        # Ensure proper Swedish LEGO terms
        text = text.replace("leksakstegelstenar", "klossar")
        text = text.replace("tegelstenar", "klossar")
        text = text.replace("Lego", "LEGO")
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

    en_size = EN_PATH.stat().st_size
    print(f"English file loaded: {en_size:,} bytes")
    print()

    # Initialize translator
    print("Initializing translator (English → Swedish)...")
    if translator_lib == "googletrans":
        translator = Translator()
    else:  # deep_translator
        translator = GoogleTranslator(source='en', target='sv')
    print()

    # Translate all content
    print("Starting translation...")
    print("This will take several minutes. Please be patient.")
    print()

    start_time = time.time()
    sv_data = translate_dict(en_data, translator)
    elapsed = time.time() - start_time

    print()
    print(f"Translation completed in {elapsed:.1f} seconds")
    print("Applying Swedish LEGO terminology...")
    sv_data = apply_swedish_lego_terms(sv_data)

    # Save result
    print(f"Saving Swedish translation: {SV_PATH}")
    with open(SV_PATH, 'w', encoding='utf-8') as f:
        json.dump(sv_data, f, ensure_ascii=False, indent=2)

    # Verify result
    sv_size = SV_PATH.stat().st_size

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
