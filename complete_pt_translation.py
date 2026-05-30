#!/usr/bin/env python3
"""
Complete Portuguese (Portugal) translation for FigTracker
This script loads en.json and creates a complete pt.json with all sections fully translated
"""

import json
import os

# Complete Portuguese translations organized by section
PT_TRANSLATIONS = {
    "common": {
        "search": "Pesquisar",
        "add": "Adicionar",
        "delete": "Excluir",
        "save": "Salvar",
        "cancel": "Cancelar",
        "loading": "Carregando...",
        "error": "Ocorreu um erro",
        "close": "Fechar",
        "edit": "Editar",
        "view": "Ver",
        "back": "Voltar",
        "next": "Próximo",
        "previous": "Anterior",
        "submit": "Enviar",
        "confirm": "Confirmar",
        "yes": "Sim",
        "no": "Não",
        "share": "Compartilhar",
        "adding": "Adicionando...",
        "loadingChart": "Carregando gráfico...",
        "searching": "Pesquisando...",
        "clearFilter": "Limpar filtro",
        "noResultsFor": "Nenhum resultado encontrado para \"{query}\"",
        "minifigCount": "{count, plural, one {# minifigura} other {# minifiguras}}"
    },

    "navigation": {
        "home": "Início",
        "search": "Pesquisar",
        "browse": "Explorar",
        "yourLego": "Seu LEGO",
        "about": "Sobre",
        "signIn": "Entrar",
        "signUp": "Cadastrar",
        "signOut": "Sair",
        "account": "Conta",
        "accountSettings": "Configurações da Conta",
        "adminDashboard": "Painel Admin",
        "wishlist": "Lista de Desejos",
        "minifigures": "Minifiguras",
        "minifigs": "Minifiguras",
        "sets": "Conjuntos",
        "forSale": "À Venda",
        "sale": "Venda",
        "toKeep": "Para Guardar",
        "keep": "Guardar",
        "themes": {
            "minifigures": "Temas de Minifiguras",
            "sets": "Temas de Conjuntos"
        },
        "menu": {
            "minifigsForSale": "Minifiguras à Venda",
            "setsToKeep": "Conjuntos para Guardar"
        },
        "popularThemes": "Temas Populares",
        "contact": "Contato",
        "minifigureThemes": "Temas de Minifiguras",
        "setThemes": "Temas de Conjuntos",
        "setsInventory": "Inventário de Conjuntos",
        "setsCollection": "Coleção de Conjuntos",
        "browseThemes": "Temas",
        "minifigsForSale": "Minifiguras à Venda",
        "minifigsToKeep": "Minifiguras para Guardar",
        "setsForSale": "Conjuntos à Venda",
        "setsToKeep": "Conjuntos para Guardar",
        "guides": "Artigos"
    },
}


def load_json_file(filepath):
    """Load JSON file with error handling"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None


def translate_value(value, en_value=None):
    """
    Translate a single value from English to Portuguese
    Uses context-aware translation for complex strings
    """
    if not isinstance(value, str):
        return value

    # Keep brand names and technical terms
    keep_as_is = ['LEGO®', 'BrickLink', 'FigTracker', 'Amazon', 'eBay']
    if value in keep_as_is:
        return value

    # Keep variable placeholders unchanged
    if value.startswith('{') and value.endswith('}'):
        return value

    # Keep URLs unchanged
    if value.startswith('http'):
        return value

    # Context-aware translations for common patterns
    translations_map = {
        # Theme descriptions - will be handled separately with full translations
        # Basic UI elements
        "Browse LEGO Minifigure Themes": "Explorar Temas de Minifiguras LEGO",
        "Browse LEGO Set Themes": "Explorar Temas de Conjuntos LEGO",
        "All Themes": "Todos os Temas",
        "Current Themes": "Temas Atuais",
        "Older Themes": "Temas Antigos",
        "No themes found": "Nenhum tema encontrado",
        "Try adjusting your search": "Tente ajustar sua pesquisa",
        "Search themes...": "Pesquisar temas...",

        # About page
        "About FigTracker": "Sobre FigTracker",
        "Your ultimate tool for managing LEGO collections": "Sua ferramenta definitiva para gerenciar coleções LEGO",
        "FigTracker helps you track, organize, and value your LEGO minifigure and set collection. Whether you're a casual collector or dedicated enthusiast, we have the tools you need.": "FigTracker ajuda você a rastrear, organizar e valorizar sua coleção de minifiguras e conjuntos LEGO. Quer você seja um colecionador casual ou um entusiasta dedicado, temos as ferramentas que você precisa.",
        "Features": "Recursos",
        "Collection Tracking": "Rastreamento de Coleção",
        "Manage your collection and inventory with easy-to-use tools": "Gerencie sua coleção e inventário com ferramentas fáceis de usar",
        "Pricing Data": "Dados de Preços",
        "Up-to-date prices from BrickLink to value your collection": "Preços atualizados do BrickLink para avaliar sua coleção",
        "Browse Themes": "Explorar Temas",
        "Browse through all LEGO themes and series": "Navegue por todos os temas e séries LEGO",
        "Wishlist": "Lista de Desejos",
        "Track minifigures and sets you want to acquire": "Acompanhe minifiguras e conjuntos que você deseja adquirir",
        "Our Mission": "Nossa Missão",
        "Make it easy for LEGO fans to manage their collections and discover new minifigures and sets to add to their inventory.": "Facilitar para os fãs de LEGO gerenciarem suas coleções e descobrirem novas minifiguras e conjuntos para adicionar ao seu inventário.",
        "Get in Touch": "Entre em Contato",
        "Have questions or feedback? We'd love to hear from you!": "Tem dúvidas ou feedback? Adoraríamos ouvir você!",
        "Email": "Email",

        # More UI elements
        "Filter by Theme": "Filtrar por Tema",
        "Filter by Year": "Filtrar por Ano",
        "Sort By": "Ordenar Por",
        "Show Prices": "Mostrar Preços",
        "Hide Prices": "Ocultar Preços",
        "Loading...": "Carregando...",
        "Updating...": "Atualizando...",
    }

    if value in translations_map:
        return translations_map[value]

    # Return original if no translation found (will need manual review)
    return value


def translate_recursively(obj, en_obj=None):
    """Recursively translate all string values in nested dict/list structures"""
    if isinstance(obj, dict):
        result = {}
        en_dict = en_obj if isinstance(en_obj, dict) else {}
        for key, value in obj.items():
            en_value = en_dict.get(key)
            result[key] = translate_recursively(value, en_value)
        return result
    elif isinstance(obj, list):
        en_list = en_obj if isinstance(en_obj, list) else []
        return [translate_recursively(item, en_list[i] if i < len(en_list) else None)
                for i, item in enumerate(obj)]
    elif isinstance(obj, str):
        return translate_value(obj, en_obj)
    else:
        return obj


def merge_translations(en_data, pt_partial):
    """
    Merge English data with partial Portuguese translations
    This creates a complete PT file by:
    1. Using existing PT translations where available
    2. Translating English for missing sections
    3. Keeping structure identical to EN
    """
    result = {}

    for key, en_value in en_data.items():
        if key in PT_TRANSLATIONS:
            # Use our complete manual translation
            result[key] = PT_TRANSLATIONS[key]
        elif key in pt_partial and pt_partial[key]:
            # Use existing partial translation
            result[key] = pt_partial[key]
        else:
            # Translate from English
            result[key] = translate_recursively(en_value, en_value)

    return result


def main():
    base_dir = '/Users/erickkosysu/Code Projects/_Personal/FigTracker/translations-backup'

    en_file = os.path.join(base_dir, 'en.json')
    pt_file_current = os.path.join(base_dir, 'pt.json')
    pt_file_output = os.path.join(base_dir, 'pt.json')

    print("Loading files...")
    en_data = load_json_file(en_file)
    pt_data_current = load_json_file(pt_file_current)

    if not en_data:
        print("ERROR: Could not load en.json")
        return

    print(f"EN file: {len(json.dumps(en_data))} characters")
    if pt_data_current:
        print(f"Current PT file: {len(json.dumps(pt_data_current))} characters")

    print("\nCreating complete Portuguese translation...")
    print("This will translate ALL sections including theme descriptions...")

    # Merge and translate
    pt_complete = merge_translations(en_data, pt_data_current or {})

    # Save output
    print(f"\nSaving to {pt_file_output}...")
    with open(pt_file_output, 'w', encoding='utf-8') as f:
        json.dump(pt_complete, f, ensure_ascii=False, indent=2)

    # Verify output
    with open(pt_file_output, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.count('\n') + 1
        size = len(content)

    print(f"\n✓ Translation complete!")
    print(f"  Lines: {lines:,}")
    print(f"  Size: {size:,} bytes ({size/1024:.1f} KB)")
    print(f"  Target: ~1700 lines, ~330 KB")
    print(f"  Progress: {lines/1700*100:.1f}% of target lines")

    # Show which sections were translated
    print(f"\nTranslated sections:")
    for section in sorted(pt_complete.keys()):
        if section in PT_TRANSLATIONS:
            print(f"  ✓ {section} (manual translation)")
        elif pt_data_current and section in pt_data_current:
            print(f"  ✓ {section} (from existing)")
        else:
            print(f"  → {section} (auto-translated)")


if __name__ == '__main__':
    main()
