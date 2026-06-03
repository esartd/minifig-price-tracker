#!/usr/bin/env python3
"""
Complete Japanese translation for FigTracker
Translates all missing content from en.json to ja.json
Uses deep-translator library for translation
"""

import json
import os
import sys
from time import sleep
from deep_translator import GoogleTranslator

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
TRANSLATIONS_DIR = os.path.join(PROJECT_ROOT, 'translations-backup')
EN_PATH = os.path.join(TRANSLATIONS_DIR, 'en.json')
JA_PATH = os.path.join(TRANSLATIONS_DIR, 'ja.json')

# Terms to preserve (case-sensitive)
PRESERVE_TERMS = [
    'LEGO®', 'LEGO', 'BrickLink', 'FigTracker',
    'Star Wars', 'Marvel', 'DC', 'Harry Potter',
    'Spider-Man', 'Batman', 'Superman',
    'Nintendo', 'Disney', 'Pixar',
    'Tom Nook', 'Isabelle', 'Johnny Thunder',
    'Dr. Inferno', 'Ogel', 'Sam Sinister'
]

# Variable patterns to preserve
VARIABLE_PATTERNS = ['{', '}', 'plural', 'one', 'other', '#']

def should_preserve(text):
    """Check if text should be preserved (URLs, variables, etc.)"""
    if not text or not isinstance(text, str):
        return False

    # Preserve URLs
    if text.startswith('http://') or text.startswith('https://'):
        return True

    # Preserve if it's mostly variables
    if text.count('{') > 0 and text.count('}') > 0:
        # Check if it's mostly variable
        var_content = text.count('{') + text.count('}')
        if var_content / len(text) > 0.3:
            return False  # We'll handle variables specially

    return False

def translate_text(text, translator):
    """Translate text to Japanese with term preservation"""
    if not text or not isinstance(text, str):
        return text

    if should_preserve(text):
        return text

    # Temporarily replace preserved terms with placeholders
    protected = {}
    temp_text = text

    for i, term in enumerate(PRESERVE_TERMS):
        if term in temp_text:
            placeholder = f"__PRESERVE{i}__"
            protected[placeholder] = term
            temp_text = temp_text.replace(term, placeholder)

    # Temporarily replace variables with placeholders
    var_protected = {}
    import re
    var_pattern = re.compile(r'\{[^}]+\}')
    for i, match in enumerate(var_pattern.finditer(temp_text)):
        placeholder = f"__VAR{i}__"
        var_protected[placeholder] = match.group()
        temp_text = temp_text.replace(match.group(), placeholder)

    try:
        # Translate
        translated = translator.translate(temp_text)

        # Restore variables
        for placeholder, original in var_protected.items():
            translated = translated.replace(placeholder, original)

        # Restore preserved terms
        for placeholder, original in protected.items():
            translated = translated.replace(placeholder, original)

        return translated
    except Exception as e:
        print(f"Translation error for '{text[:50]}...': {e}")
        return text

def translate_dict(en_dict, ja_dict, translator, path=""):
    """Recursively translate dictionary structure"""
    result = {}

    for key, value in en_dict.items():
        current_path = f"{path}.{key}" if path else key

        # Check if translation exists in ja_dict
        if key in ja_dict:
            if isinstance(value, dict):
                # Recursively translate nested dict
                result[key] = translate_dict(value, ja_dict[key], translator, current_path)
            else:
                # Keep existing translation
                result[key] = ja_dict[key]
                print(f"✓ Keeping existing: {current_path}")
        else:
            # Translate new content
            if isinstance(value, dict):
                print(f"⚠ Translating new section: {current_path}")
                result[key] = translate_dict(value, {}, translator, current_path)
            else:
                print(f"→ Translating: {current_path}")
                result[key] = translate_text(value, translator)
                sleep(0.5)  # Rate limiting for free API

    return result

def main():
    print("FigTracker Japanese Translation Completion")
    print("=" * 60)

    # Load English source
    print(f"\nLoading source: {EN_PATH}")
    with open(EN_PATH, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    en_size = os.path.getsize(EN_PATH)
    print(f"Source size: {en_size / 1024:.1f}KB")

    # Load existing Japanese
    print(f"\nLoading existing: {JA_PATH}")
    with open(JA_PATH, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    ja_size = os.path.getsize(JA_PATH)
    print(f"Existing size: {ja_size / 1024:.1f}KB")

    # Initialize translator
    print("\nInitializing translator...")
    translator = GoogleTranslator(source='en', target='ja')

    # Translate
    print("\nStarting translation...")
    print("This will take several minutes due to rate limiting...\n")

    completed_data = translate_dict(en_data, ja_data, translator)

    # Save completed translation
    print(f"\nSaving to: {JA_PATH}")
    with open(JA_PATH, 'w', encoding='utf-8') as f:
        json.dump(completed_data, f, ensure_ascii=False, indent=2)

    # Show results
    new_size = os.path.getsize(JA_PATH)
    print(f"\n{'=' * 60}")
    print("Translation completed!")
    print(f"Original size: {ja_size / 1024:.1f}KB")
    print(f"New size: {new_size / 1024:.1f}KB")
    print(f"Growth: +{(new_size - ja_size) / 1024:.1f}KB")
    print(f"Target was: ~{en_size / 1024:.1f}KB")
    print(f"Completion: {(new_size / en_size) * 100:.1f}%")

    return 0

if __name__ == '__main__':
    sys.exit(main())
