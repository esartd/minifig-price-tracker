#!/usr/bin/env python3
"""
Generate German, French, and Spanish translations for FigTracker
This script reads en.json and creates translated versions maintaining JSON structure
"""

import json
import sys

# Translation dictionaries for UI strings
# Theme descriptions will be translated separately due to length

translations = {
    "de": {  # German
        "common": {
            "search": "Suchen",
            "add": "Hinzufügen",
            "delete": "Löschen",
            "save": "Speichern",
            "cancel": "Abbrechen",
            "loading": "Lädt...",
            "error": "Ein Fehler ist aufgetreten",
            "close": "Schließen",
            "edit": "Bearbeiten",
            "view": "Ansehen",
            "back": "Zurück",
            "next": "Weiter",
            "previous": "Zurück",
            "submit": "Absenden",
            "confirm": "Bestätigen",
            "yes": "Ja",
            "no": "Nein"
        },
        "navigation": {
            "home": "Startseite",
            "search": "Suchen",
            "browse": "Durchsuchen",
            "yourLego": "Deine LEGO",
            "about": "Über uns",
            "signIn": "Anmelden",
            "signUp": "Registrieren",
            "signOut": "Abmelden",
            "account": "Konto",
            "themes": {
                "minifigures": "Minifiguren-Themen",
                "sets": "Set-Themen"
            },
            "menu": {
                "minifigsForSale": "Minifiguren zum Verkauf",
                "setsToKeep": "Sets zum Behalten"
            }
        },
        "themes": {
            "browse_title": "LEGO Minifiguren-Themen durchsuchen",
            "browse_sets": "LEGO Set-Themen durchsuchen",
            "theme_sets": "{theme} Sets",
            "count": "{count} Minifiguren",
            "countSets": "{count} Sets in diesem Thema",
            "series": "{count} Serien",
            "allThemes": "Alle Themen",
            "popularThemes": "Beliebte Themen",
            "descriptions": {}  # Will be populated
        },
        "account": {
            "title": "Kontoeinstellungen",
            "profile": "Profil",
            "email": "E-Mail",
            "password": "Passwort",
            "currency": "Währung",
            "language": "Sprache",
            "languageDescription": "Wählen Sie Ihre bevorzugte Sprache",
            "currencyDescription": "Wählen Sie Ihre bevorzugte Währung für Preise",
            "updateSuccess": "Einstellungen erfolgreich aktualisiert",
            "updateError": "Einstellungen konnten nicht aktualisiert werden",
            "name": "Name",
            "avatar": "Avatar",
            "changePassword": "Passwort ändern",
            "currentPassword": "Aktuelles Passwort",
            "newPassword": "Neues Passwort",
            "confirmPassword": "Passwort bestätigen",
            "deleteAccount": "Konto löschen"
        },
        "collection": {
            "title": "Meine Sammlung",
            "inventory": "Inventar",
            "addToCollection": "Zur Sammlung hinzufügen",
            "addToInventory": "Zum Inventar hinzufügen",
            "removeFromCollection": "Aus Sammlung entfernen",
            "moveToInventory": "Zum Inventar verschieben",
            "moveToCollection": "Zur Sammlung verschieben",
            "totalValue": "Gesamtwert",
            "totalItems": "Gesamtanzahl",
            "emptyState": "Deine Sammlung ist leer",
            "condition": "Zustand",
            "conditions": {
                "new": "Neu",
                "likeNew": "Wie neu",
                "good": "Gut",
                "fair": "Akzeptabel"
            }
        },
        "search": {
            "placeholder": "Suche nach LEGO Minifiguren...",
            "placeholderSets": "Suche nach LEGO Sets...",
            "notFound": "Nicht gefunden. Versuche andere Suchbegriffe.",
            "results": "{count} Ergebnisse gefunden",
            "searching": "Suche..."
        },
        "pricing": {
            "sixMonthAvg": "6-Mo. Durchschnitt",
            "currentAvg": "Aktueller Durchschnitt",
            "lowest": "Niedrigster",
            "highest": "Höchster",
            "suggestedPrice": "Empfohlener Preis",
            "priceHistory": "Preisverlauf",
            "noPricing": "Keine Preisdaten verfügbar",
            "refreshPricing": "Preise aktualisieren"
        },
        "errors": {
            "notFound": "Nicht gefunden",
            "unauthorized": "Nicht autorisiert",
            "serverError": "Serverfehler. Bitte versuche es erneut.",
            "networkError": "Netzwerkfehler. Überprüfe deine Verbindung.",
            "invalidInput": "Ungültige Eingabe",
            "requiredField": "Dieses Feld ist erforderlich"
        },
        "auth": {
            "signInTitle": "Bei deinem Konto anmelden",
            "signUpTitle": "Konto erstellen",
            "emailPlaceholder": "E-Mail eingeben",
            "passwordPlaceholder": "Passwort eingeben",
            "namePlaceholder": "Name eingeben",
            "forgotPassword": "Passwort vergessen?",
            "noAccount": "Noch kein Konto?",
            "hasAccount": "Bereits ein Konto?",
            "signInButton": "Anmelden",
            "signUpButton": "Registrieren",
            "signInWithGoogle": "Mit Google anmelden",
            "resetPassword": "Passwort zurücksetzen",
            "resetPasswordDesc": "Gib deine E-Mail ein, um Anweisungen zum Zurücksetzen zu erhalten",
            "sendResetLink": "Link zum Zurücksetzen senden"
        },
        "faq": {
            "title": "Häufig gestellte Fragen",
            "subtitle": "Finde Antworten auf häufige Fragen zu FigTracker"
        },
        "about": {
            "hero": {
                "title": "Kein Raten mehr. Jetzt verkaufen.",
                "subtitle": "Erhalte sofortige, genaue Preise für deine LEGO Minifiguren"
            },
            "features": {
                "realTimePricing": "Echtzeit-Preise",
                "realTimePricingDesc": "Live BrickLink-Marktdaten, täglich aktualisiert",
                "inventoryManagement": "Inventarverwaltung",
                "inventoryManagementDesc": "Verfolge deine Sammlung und Artikel zum Verkauf",
                "priceHistory": "Preisverlauf",
                "priceHistoryDesc": "Sehe Preistrends im Zeitverlauf, um zum richtigen Zeitpunkt zu verkaufen"
            }
        }
    },
    "fr": {  # French
        "common": {
            "search": "Rechercher",
            "add": "Ajouter",
            "delete": "Supprimer",
            "save": "Enregistrer",
            "cancel": "Annuler",
            "loading": "Chargement...",
            "error": "Une erreur s'est produite",
            "close": "Fermer",
            "edit": "Modifier",
            "view": "Voir",
            "back": "Retour",
            "next": "Suivant",
            "previous": "Précédent",
            "submit": "Soumettre",
            "confirm": "Confirmer",
            "yes": "Oui",
            "no": "Non"
        },
        "navigation": {
            "home": "Accueil",
            "search": "Rechercher",
            "browse": "Parcourir",
            "yourLego": "Vos LEGO",
            "about": "À propos",
            "signIn": "Se connecter",
            "signUp": "S'inscrire",
            "signOut": "Se déconnecter",
            "account": "Compte",
            "themes": {
                "minifigures": "Thèmes de minifigurines",
                "sets": "Thèmes de sets"
            },
            "menu": {
                "minifigsForSale": "Minifigurines à vendre",
                "setsToKeep": "Sets à conserver"
            }
        },
        "themes": {
            "browse_title": "Parcourir les thèmes de minifigurines LEGO",
            "browse_sets": "Parcourir les thèmes de sets LEGO",
            "theme_sets": "Sets {theme}",
            "count": "{count} minifigurines",
            "countSets": "{count} sets dans ce thème",
            "series": "{count} séries",
            "allThemes": "Tous les thèmes",
            "popularThemes": "Thèmes populaires",
            "descriptions": {}  # Will be populated
        },
        "account": {
            "title": "Paramètres du compte",
            "profile": "Profil",
            "email": "E-mail",
            "password": "Mot de passe",
            "currency": "Devise",
            "language": "Langue",
            "languageDescription": "Choisissez votre langue préférée",
            "currencyDescription": "Sélectionnez votre devise préférée pour les prix",
            "updateSuccess": "Paramètres mis à jour avec succès",
            "updateError": "Échec de la mise à jour des paramètres",
            "name": "Nom",
            "avatar": "Avatar",
            "changePassword": "Changer le mot de passe",
            "currentPassword": "Mot de passe actuel",
            "newPassword": "Nouveau mot de passe",
            "confirmPassword": "Confirmer le mot de passe",
            "deleteAccount": "Supprimer le compte"
        },
        "collection": {
            "title": "Ma collection",
            "inventory": "Inventaire",
            "addToCollection": "Ajouter à la collection",
            "addToInventory": "Ajouter à l'inventaire",
            "removeFromCollection": "Retirer de la collection",
            "moveToInventory": "Déplacer vers l'inventaire",
            "moveToCollection": "Déplacer vers la collection",
            "totalValue": "Valeur totale",
            "totalItems": "Total d'articles",
            "emptyState": "Votre collection est vide",
            "condition": "État",
            "conditions": {
                "new": "Neuf",
                "likeNew": "Comme neuf",
                "good": "Bon",
                "fair": "Acceptable"
            }
        },
        "search": {
            "placeholder": "Rechercher une minifigurine LEGO...",
            "placeholderSets": "Rechercher des sets LEGO...",
            "notFound": "Non trouvé. Essayez d'autres termes de recherche.",
            "results": "{count} résultats trouvés",
            "searching": "Recherche..."
        },
        "pricing": {
            "sixMonthAvg": "Moy. 6 mois",
            "currentAvg": "Moy. actuelle",
            "lowest": "Plus bas",
            "highest": "Plus haut",
            "suggestedPrice": "Prix suggéré",
            "priceHistory": "Historique des prix",
            "noPricing": "Aucune donnée de prix disponible",
            "refreshPricing": "Actualiser les prix"
        },
        "errors": {
            "notFound": "Non trouvé",
            "unauthorized": "Non autorisé",
            "serverError": "Erreur serveur. Veuillez réessayer.",
            "networkError": "Erreur réseau. Vérifiez votre connexion.",
            "invalidInput": "Entrée invalide",
            "requiredField": "Ce champ est requis"
        },
        "auth": {
            "signInTitle": "Connectez-vous à votre compte",
            "signUpTitle": "Créez votre compte",
            "emailPlaceholder": "Entrez votre e-mail",
            "passwordPlaceholder": "Entrez votre mot de passe",
            "namePlaceholder": "Entrez votre nom",
            "forgotPassword": "Mot de passe oublié?",
            "noAccount": "Vous n'avez pas de compte?",
            "hasAccount": "Vous avez déjà un compte?",
            "signInButton": "Se connecter",
            "signUpButton": "S'inscrire",
            "signInWithGoogle": "Se connecter avec Google",
            "resetPassword": "Réinitialiser le mot de passe",
            "resetPasswordDesc": "Entrez votre e-mail pour recevoir les instructions de réinitialisation",
            "sendResetLink": "Envoyer le lien de réinitialisation"
        },
        "faq": {
            "title": "Questions fréquemment posées",
            "subtitle": "Trouvez des réponses aux questions courantes sur FigTracker"
        },
        "about": {
            "hero": {
                "title": "Arrêtez de deviner. Commencez à vendre.",
                "subtitle": "Obtenez des prix instantanés et précis pour vos minifigurines LEGO"
            },
            "features": {
                "realTimePricing": "Prix en temps réel",
                "realTimePricingDesc": "Données en direct du marché BrickLink mises à jour quotidiennement",
                "inventoryManagement": "Gestion d'inventaire",
                "inventoryManagementDesc": "Suivez votre collection et les articles à vendre",
                "priceHistory": "Historique des prix",
                "priceHistoryDesc": "Visualisez les tendances de prix pour vendre au bon moment"
            }
        }
    },
    "es": {  # Spanish
        "common": {
            "search": "Buscar",
            "add": "Añadir",
            "delete": "Eliminar",
            "save": "Guardar",
            "cancel": "Cancelar",
            "loading": "Cargando...",
            "error": "Ha ocurrido un error",
            "close": "Cerrar",
            "edit": "Editar",
            "view": "Ver",
            "back": "Atrás",
            "next": "Siguiente",
            "previous": "Anterior",
            "submit": "Enviar",
            "confirm": "Confirmar",
            "yes": "Sí",
            "no": "No"
        },
        "navigation": {
            "home": "Inicio",
            "search": "Buscar",
            "browse": "Explorar",
            "yourLego": "Tus LEGO",
            "about": "Acerca de",
            "signIn": "Iniciar sesión",
            "signUp": "Registrarse",
            "signOut": "Cerrar sesión",
            "account": "Cuenta",
            "themes": {
                "minifigures": "Temas de minifiguras",
                "sets": "Temas de sets"
            },
            "menu": {
                "minifigsForSale": "Minifiguras en venta",
                "setsToKeep": "Sets para conservar"
            }
        },
        "themes": {
            "browse_title": "Explorar temas de minifiguras LEGO",
            "browse_sets": "Explorar temas de sets LEGO",
            "theme_sets": "Sets de {theme}",
            "count": "{count} minifiguras",
            "countSets": "{count} sets en este tema",
            "series": "{count} series",
            "allThemes": "Todos los temas",
            "popularThemes": "Temas populares",
            "descriptions": {}  # Will be populated
        },
        "account": {
            "title": "Configuración de la cuenta",
            "profile": "Perfil",
            "email": "Correo electrónico",
            "password": "Contraseña",
            "currency": "Moneda",
            "language": "Idioma",
            "languageDescription": "Elige tu idioma preferido",
            "currencyDescription": "Selecciona tu moneda preferida para los precios",
            "updateSuccess": "Configuración actualizada correctamente",
            "updateError": "Error al actualizar la configuración",
            "name": "Nombre",
            "avatar": "Avatar",
            "changePassword": "Cambiar contraseña",
            "currentPassword": "Contraseña actual",
            "newPassword": "Nueva contraseña",
            "confirmPassword": "Confirmar contraseña",
            "deleteAccount": "Eliminar cuenta"
        },
        "collection": {
            "title": "Mi colección",
            "inventory": "Inventario",
            "addToCollection": "Añadir a la colección",
            "addToInventory": "Añadir al inventario",
            "removeFromCollection": "Quitar de la colección",
            "moveToInventory": "Mover al inventario",
            "moveToCollection": "Mover a la colección",
            "totalValue": "Valor total",
            "totalItems": "Total de artículos",
            "emptyState": "Tu colección está vacía",
            "condition": "Estado",
            "conditions": {
                "new": "Nuevo",
                "likeNew": "Como nuevo",
                "good": "Bueno",
                "fair": "Aceptable"
            }
        },
        "search": {
            "placeholder": "Buscar minifiguras LEGO...",
            "placeholderSets": "Buscar sets LEGO...",
            "notFound": "No encontrado. Intenta con otros términos de búsqueda.",
            "results": "{count} resultados encontrados",
            "searching": "Buscando..."
        },
        "pricing": {
            "sixMonthAvg": "Prom. 6 meses",
            "currentAvg": "Prom. actual",
            "lowest": "Más bajo",
            "highest": "Más alto",
            "suggestedPrice": "Precio sugerido",
            "priceHistory": "Historial de precios",
            "noPricing": "No hay datos de precios disponibles",
            "refreshPricing": "Actualizar precios"
        },
        "errors": {
            "notFound": "No encontrado",
            "unauthorized": "No autorizado",
            "serverError": "Error del servidor. Por favor, inténtalo de nuevo.",
            "networkError": "Error de red. Verifica tu conexión.",
            "invalidInput": "Entrada inválida",
            "requiredField": "Este campo es obligatorio"
        },
        "auth": {
            "signInTitle": "Inicia sesión en tu cuenta",
            "signUpTitle": "Crea tu cuenta",
            "emailPlaceholder": "Ingresa tu correo electrónico",
            "passwordPlaceholder": "Ingresa tu contraseña",
            "namePlaceholder": "Ingresa tu nombre",
            "forgotPassword": "¿Olvidaste tu contraseña?",
            "noAccount": "¿No tienes una cuenta?",
            "hasAccount": "¿Ya tienes una cuenta?",
            "signInButton": "Iniciar sesión",
            "signUpButton": "Registrarse",
            "signInWithGoogle": "Iniciar sesión con Google",
            "resetPassword": "Restablecer contraseña",
            "resetPasswordDesc": "Ingresa tu correo electrónico para recibir instrucciones de restablecimiento",
            "sendResetLink": "Enviar enlace de restablecimiento"
        },
        "faq": {
            "title": "Preguntas frecuentes",
            "subtitle": "Encuentra respuestas a preguntas comunes sobre FigTracker"
        },
        "about": {
            "hero": {
                "title": "Deja de adivinar. Empieza a vender.",
                "subtitle": "Obtén precios instantáneos y precisos para tus minifiguras LEGO"
            },
            "features": {
                "realTimePricing": "Precios en tiempo real",
                "realTimePricingDesc": "Datos en vivo del mercado de BrickLink actualizados diariamente",
                "inventoryManagement": "Gestión de inventario",
                "inventoryManagementDesc": "Rastrea tu colección y artículos en venta",
                "priceHistory": "Historial de precios",
                "priceHistoryDesc": "Ve las tendencias de precios para vender en el momento adecuado"
            }
        }
    }
}

# Load English translations
with open('../locales/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Note: Theme descriptions are too large to include in this script
# They will be translated separately and merged

print("Generating translation files...")
print(f"Loaded {len(en_data['themes']['descriptions'])} theme descriptions from English")

for locale, trans_data in translations.items():
    # Copy theme descriptions from English (placeholder - will translate separately)
    trans_data['themes']['descriptions'] = en_data['themes']['descriptions']

    # Write translation file
    output_path = f'../locales/{locale}.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(trans_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Generated: locales/{locale}.json")

print("\n📝 Note: Theme descriptions are currently in English.")
print("They need to be translated separately due to their length (27,000+ words).")
print("Run the theme translation script next to complete the translations.")
