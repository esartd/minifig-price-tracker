const fs = require('fs');
const path = require('path');

// OAuth translations for all 10 languages
const translations = {
  de: {
    signup: {
      continueWithGoogle: "Mit Google anmelden",
      signupWithEmail: "Mit E-Mail anmelden"
    },
    signin: {
      continueWithGoogle: "Mit Google fortfahren",
      continueWithEmail: "Mit E-Mail fortfahren"
    }
  },
  es: {
    signup: {
      continueWithGoogle: "Registrarse con Google",
      signupWithEmail: "Registrarse con correo"
    },
    signin: {
      continueWithGoogle: "Continuar con Google",
      continueWithEmail: "Continuar con correo"
    }
  },
  fr: {
    signup: {
      continueWithGoogle: "S'inscrire avec Google",
      signupWithEmail: "S'inscrire avec e-mail"
    },
    signin: {
      continueWithGoogle: "Continuer avec Google",
      continueWithEmail: "Continuer avec e-mail"
    }
  },
  it: {
    signup: {
      continueWithGoogle: "Registrati con Google",
      signupWithEmail: "Registrati con email"
    },
    signin: {
      continueWithGoogle: "Continua con Google",
      continueWithEmail: "Continua con email"
    }
  },
  ja: {
    signup: {
      continueWithGoogle: "Googleで登録",
      signupWithEmail: "メールで登録"
    },
    signin: {
      continueWithGoogle: "Googleで続ける",
      continueWithEmail: "メールで続ける"
    }
  },
  nl: {
    signup: {
      continueWithGoogle: "Aanmelden met Google",
      signupWithEmail: "Aanmelden met e-mail"
    },
    signin: {
      continueWithGoogle: "Doorgaan met Google",
      continueWithEmail: "Doorgaan met e-mail"
    }
  },
  pl: {
    signup: {
      continueWithGoogle: "Zarejestruj się przez Google",
      signupWithEmail: "Zarejestruj się przez e-mail"
    },
    signin: {
      continueWithGoogle: "Kontynuuj z Google",
      continueWithEmail: "Kontynuuj z e-mailem"
    }
  },
  pt: {
    signup: {
      continueWithGoogle: "Cadastrar com Google",
      signupWithEmail: "Cadastrar com e-mail"
    },
    signin: {
      continueWithGoogle: "Continuar com Google",
      continueWithEmail: "Continuar com e-mail"
    }
  },
  sv: {
    signup: {
      continueWithGoogle: "Registrera dig med Google",
      signupWithEmail: "Registrera dig med e-post"
    },
    signin: {
      continueWithGoogle: "Fortsätt med Google",
      continueWithEmail: "Fortsätt med e-post"
    }
  }
};

// Process each language file
Object.keys(translations).forEach(lang => {
  const filePath = path.join(__dirname, '../translations-backup', `${lang}.json`);

  try {
    // Read existing translations
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    // Add OAuth translations if auth section exists
    if (data.auth) {
      if (data.auth.signup) {
        data.auth.signup.continueWithGoogle = translations[lang].signup.continueWithGoogle;
        data.auth.signup.signupWithEmail = translations[lang].signup.signupWithEmail;
      }
      if (data.auth.signin) {
        data.auth.signin.continueWithGoogle = translations[lang].signin.continueWithGoogle;
        data.auth.signin.continueWithEmail = translations[lang].signin.continueWithEmail;
      }

      // Write back to file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Updated ${lang}.json`);
    } else {
      console.log(`⚠️  Skipped ${lang}.json (no auth section)`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${lang}.json:`, error.message);
  }
});

console.log('\n✅ OAuth translations added to all language files!');
