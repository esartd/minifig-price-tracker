/**
 * Add the feedback widget's strings to all ten locale files.
 *
 * Written out per language rather than machine-translated. September 2026
 * found 439 strings across it/ja/nl/pl/pt/sv that were not translations at all
 * -- a word-level find-and-replace over English text, producing "something
 * that's net in the database". That is exactly what this avoids.
 *
 * Two things to keep right, both of which the checker will flag:
 *  - The brand declines. Polish takes a locative -u on a -k stem, so it is
 *    "w IntoBricku". Not that it appears here -- these strings avoid the brand
 *    name entirely, which is the simplest way to stay correct.
 *  - Re-record the baseline afterwards (npm run accept:translations), or every
 *    one of these 22 keys stays flagged forever and the tool gets ignored.
 *
 *   npx tsx scripts/add-feedback-translations.ts          # dry run
 *   npx tsx scripts/add-feedback-translations.ts --apply
 */

import fs from 'fs';
import path from 'path';

const APPLY = process.argv.includes('--apply');
const DIR = 'translations-backup';

type Block = {
  open: string;
  close: string;
  title: string;
  subtitle: string;
  typeLabel: string;
  types: { bug: string; feature: string; other: string };
  messageLabel: string;
  placeholders: { bug: string; other: string };
  emailLabel: string;
  emailHelper: string;
  submit: string;
  sending: string;
  success: { title: string; body: string; done: string };
  errors: { empty: string; verify: string; tooMany: string; generic: string };
};

const FEEDBACK: Record<string, Block> = {
  en: {
    open: 'Send feedback',
    close: 'Close',
    title: 'Send feedback',
    subtitle: 'Found a bug or want something added? Tell us — it goes straight to the person who builds this.',
    typeLabel: 'What is this about?',
    types: { bug: 'Something is broken', feature: 'I have an idea', other: 'Something else' },
    messageLabel: 'Tell us more',
    placeholders: {
      bug: 'What were you doing, and what happened instead?',
      other: 'What would you like to see?',
    },
    emailLabel: 'Your email (optional)',
    emailHelper: 'Only so we can follow up if we need more detail.',
    submit: 'Send feedback',
    sending: 'Sending…',
    success: {
      title: 'Thank you',
      body: 'Your feedback has been recorded. Every message is read.',
      done: 'Done',
    },
    errors: {
      empty: 'Please tell us what happened.',
      verify: 'Please complete the verification check.',
      tooMany: 'Too many submissions. Please try again later.',
      generic: 'Something went wrong. Please try again.',
    },
  },
  de: {
    open: 'Feedback senden',
    close: 'Schließen',
    title: 'Feedback senden',
    subtitle: 'Einen Fehler gefunden oder einen Wunsch? Schreib es uns — es geht direkt an die Person, die das hier baut.',
    typeLabel: 'Worum geht es?',
    types: { bug: 'Etwas funktioniert nicht', feature: 'Ich habe eine Idee', other: 'Etwas anderes' },
    messageLabel: 'Erzähl uns mehr',
    placeholders: {
      bug: 'Was hast du gemacht, und was ist stattdessen passiert?',
      other: 'Was würdest du dir wünschen?',
    },
    emailLabel: 'Deine E-Mail-Adresse (optional)',
    emailHelper: 'Nur damit wir nachfragen können, falls uns Details fehlen.',
    submit: 'Feedback senden',
    sending: 'Wird gesendet…',
    success: {
      title: 'Danke',
      body: 'Dein Feedback ist angekommen. Jede Nachricht wird gelesen.',
      done: 'Fertig',
    },
    errors: {
      empty: 'Bitte beschreibe, was passiert ist.',
      verify: 'Bitte schließe die Sicherheitsprüfung ab.',
      tooMany: 'Zu viele Einsendungen. Bitte versuche es später erneut.',
      generic: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    },
  },
  fr: {
    open: 'Envoyer un retour',
    close: 'Fermer',
    title: 'Envoyer un retour',
    subtitle: "Un bug ou une idée ? Dites-le-nous — le message arrive directement à la personne qui développe le site.",
    typeLabel: 'De quoi s’agit-il ?',
    types: { bug: 'Quelque chose ne marche pas', feature: 'J’ai une idée', other: 'Autre chose' },
    messageLabel: 'Dites-nous en plus',
    placeholders: {
      bug: 'Que faisiez-vous, et que s’est-il passé à la place ?',
      other: 'Qu’aimeriez-vous voir ?',
    },
    emailLabel: 'Votre e-mail (facultatif)',
    emailHelper: 'Uniquement pour revenir vers vous si un détail manque.',
    submit: 'Envoyer',
    sending: 'Envoi…',
    success: {
      title: 'Merci',
      body: 'Votre retour a bien été enregistré. Chaque message est lu.',
      done: 'Terminé',
    },
    errors: {
      empty: 'Merci de décrire ce qui s’est passé.',
      verify: 'Merci de compléter la vérification.',
      tooMany: 'Trop d’envois. Réessayez plus tard.',
      generic: 'Une erreur est survenue. Merci de réessayer.',
    },
  },
  es: {
    open: 'Enviar comentarios',
    close: 'Cerrar',
    title: 'Enviar comentarios',
    subtitle: '¿Has encontrado un fallo o quieres pedir algo? Cuéntanoslo: llega directamente a quien desarrolla el sitio.',
    typeLabel: '¿De qué se trata?',
    types: { bug: 'Algo no funciona', feature: 'Tengo una idea', other: 'Otra cosa' },
    messageLabel: 'Cuéntanos más',
    placeholders: {
      bug: '¿Qué estabas haciendo y qué ocurrió en su lugar?',
      other: '¿Qué te gustaría ver?',
    },
    emailLabel: 'Tu correo (opcional)',
    emailHelper: 'Solo para escribirte si nos faltan detalles.',
    submit: 'Enviar',
    sending: 'Enviando…',
    success: {
      title: 'Gracias',
      body: 'Hemos recibido tus comentarios. Leemos todos los mensajes.',
      done: 'Listo',
    },
    errors: {
      empty: 'Cuéntanos qué ha pasado.',
      verify: 'Completa la verificación, por favor.',
      tooMany: 'Demasiados envíos. Inténtalo más tarde.',
      generic: 'Algo ha salido mal. Inténtalo de nuevo.',
    },
  },
  it: {
    open: 'Invia un feedback',
    close: 'Chiudi',
    title: 'Invia un feedback',
    subtitle: 'Hai trovato un problema o vuoi proporre qualcosa? Scrivicelo: arriva direttamente a chi sviluppa il sito.',
    typeLabel: 'Di cosa si tratta?',
    types: { bug: 'Qualcosa non funziona', feature: 'Ho un’idea', other: 'Altro' },
    messageLabel: 'Raccontaci di più',
    placeholders: {
      bug: 'Cosa stavi facendo e cosa è successo invece?',
      other: 'Cosa ti piacerebbe vedere?',
    },
    emailLabel: 'La tua email (facoltativa)',
    emailHelper: 'Serve solo per ricontattarti se mancano dettagli.',
    submit: 'Invia',
    sending: 'Invio in corso…',
    success: {
      title: 'Grazie',
      body: 'Il tuo feedback è stato registrato. Leggiamo ogni messaggio.',
      done: 'Fatto',
    },
    errors: {
      empty: 'Raccontaci cosa è successo.',
      verify: 'Completa la verifica di sicurezza.',
      tooMany: 'Troppi invii. Riprova più tardi.',
      generic: 'Qualcosa è andato storto. Riprova.',
    },
  },
  nl: {
    open: 'Feedback sturen',
    close: 'Sluiten',
    title: 'Feedback sturen',
    subtitle: 'Een fout gevonden of een wens? Laat het weten — het komt rechtstreeks bij degene die dit bouwt.',
    typeLabel: 'Waar gaat het over?',
    types: { bug: 'Er werkt iets niet', feature: 'Ik heb een idee', other: 'Iets anders' },
    messageLabel: 'Vertel meer',
    placeholders: {
      bug: 'Wat was je aan het doen, en wat gebeurde er in plaats daarvan?',
      other: 'Wat zou je graag willen zien?',
    },
    emailLabel: 'Je e-mailadres (optioneel)',
    emailHelper: 'Alleen om contact op te nemen als we meer details nodig hebben.',
    submit: 'Versturen',
    sending: 'Versturen…',
    success: {
      title: 'Bedankt',
      body: 'Je feedback is genoteerd. Elk bericht wordt gelezen.',
      done: 'Klaar',
    },
    errors: {
      empty: 'Vertel ons wat er gebeurd is.',
      verify: 'Rond de beveiligingscontrole af.',
      tooMany: 'Te veel inzendingen. Probeer het later opnieuw.',
      generic: 'Er ging iets mis. Probeer het opnieuw.',
    },
  },
  pl: {
    open: 'Wyślij opinię',
    close: 'Zamknij',
    title: 'Wyślij opinię',
    subtitle: 'Znalazłeś błąd albo chcesz coś zaproponować? Napisz — trafi prosto do osoby, która tworzy tę stronę.',
    typeLabel: 'Czego dotyczy zgłoszenie?',
    types: { bug: 'Coś nie działa', feature: 'Mam pomysł', other: 'Coś innego' },
    messageLabel: 'Opisz to dokładniej',
    placeholders: {
      bug: 'Co robiłeś i co się stało zamiast tego?',
      other: 'Co chciałbyś zobaczyć?',
    },
    emailLabel: 'Twój e-mail (opcjonalnie)',
    emailHelper: 'Tylko po to, żeby dopytać, jeśli zabraknie nam szczegółów.',
    submit: 'Wyślij',
    sending: 'Wysyłanie…',
    success: {
      title: 'Dziękujemy',
      body: 'Twoja opinia została zapisana. Czytamy każdą wiadomość.',
      done: 'Gotowe',
    },
    errors: {
      empty: 'Napisz, co się stało.',
      verify: 'Ukończ weryfikację bezpieczeństwa.',
      tooMany: 'Zbyt wiele zgłoszeń. Spróbuj później.',
      generic: 'Coś poszło nie tak. Spróbuj ponownie.',
    },
  },
  pt: {
    open: 'Enviar comentários',
    close: 'Fechar',
    title: 'Enviar comentários',
    subtitle: 'Encontrou um erro ou quer sugerir algo? Conte para a gente — vai direto para quem desenvolve o site.',
    typeLabel: 'Sobre o que é?',
    types: { bug: 'Algo não está funcionando', feature: 'Tenho uma ideia', other: 'Outro assunto' },
    messageLabel: 'Conte mais',
    placeholders: {
      bug: 'O que você estava fazendo e o que aconteceu no lugar?',
      other: 'O que você gostaria de ver?',
    },
    emailLabel: 'Seu e-mail (opcional)',
    emailHelper: 'Só para retornarmos caso faltem detalhes.',
    submit: 'Enviar',
    sending: 'Enviando…',
    success: {
      title: 'Obrigado',
      body: 'Seus comentários foram registrados. Lemos todas as mensagens.',
      done: 'Pronto',
    },
    errors: {
      empty: 'Conte o que aconteceu.',
      verify: 'Conclua a verificação de segurança.',
      tooMany: 'Envios demais. Tente novamente mais tarde.',
      generic: 'Algo deu errado. Tente novamente.',
    },
  },
  sv: {
    open: 'Skicka feedback',
    close: 'Stäng',
    title: 'Skicka feedback',
    subtitle: 'Hittat ett fel eller önskar du något? Skriv till oss — det går direkt till personen som bygger det här.',
    typeLabel: 'Vad gäller det?',
    types: { bug: 'Något fungerar inte', feature: 'Jag har en idé', other: 'Något annat' },
    messageLabel: 'Berätta mer',
    placeholders: {
      bug: 'Vad gjorde du, och vad hände i stället?',
      other: 'Vad skulle du vilja se?',
    },
    emailLabel: 'Din e-postadress (frivilligt)',
    emailHelper: 'Bara så att vi kan höra av oss om något saknas.',
    submit: 'Skicka',
    sending: 'Skickar…',
    success: {
      title: 'Tack',
      body: 'Din feedback är registrerad. Varje meddelande läses.',
      done: 'Klart',
    },
    errors: {
      empty: 'Berätta vad som hände.',
      verify: 'Slutför säkerhetskontrollen.',
      tooMany: 'För många inskick. Försök igen senare.',
      generic: 'Något gick fel. Försök igen.',
    },
  },
  ja: {
    open: 'フィードバックを送る',
    close: '閉じる',
    title: 'フィードバックを送る',
    subtitle: '不具合を見つけた、あるいはご要望がありますか。お知らせください。このサイトを作っている本人に直接届きます。',
    typeLabel: 'どのような内容ですか',
    types: { bug: '不具合がある', feature: '提案がある', other: 'その他' },
    messageLabel: '詳しく教えてください',
    placeholders: {
      bug: '何をしていて、どうなりましたか。',
      other: 'どのような機能をご希望ですか。',
    },
    emailLabel: 'メールアドレス（任意）',
    emailHelper: '詳細を確認したい場合のご連絡にのみ使用します。',
    submit: '送信',
    sending: '送信中…',
    success: {
      title: 'ありがとうございます',
      body: 'フィードバックを受け付けました。すべてのメッセージに目を通しています。',
      done: '完了',
    },
    errors: {
      empty: '何が起きたかをご記入ください。',
      verify: '確認チェックを完了してください。',
      tooMany: '送信回数が多すぎます。しばらくしてからお試しください。',
      generic: 'エラーが発生しました。もう一度お試しください。',
    },
  },
};

function main() {
  console.log(APPLY ? '\nADDING FEEDBACK TRANSLATIONS\n' : '\nDRY RUN (pass --apply to write)\n');

  for (const [locale, block] of Object.entries(FEEDBACK)) {
    const file = path.join(DIR, `${locale}.json`);
    if (!fs.existsSync(file)) {
      console.log(`  ${locale}: file missing — skipped`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const existed = !!data.feedback;
    data.feedback = block;

    console.log(`  ${locale}: ${existed ? 'replaced' : 'added'} feedback (22 strings)`);

    if (APPLY) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
    }
  }

  console.log(APPLY ? '\nDone. Now run: npm run check:translations\n' : '\nNothing written.\n');
}

main();
