#!/usr/bin/env node
/**
 * Export and import the translatable text of article bodies.
 *
 * Article bodies are arrays of typed blocks — headings, paragraphs, lists,
 * callouts, images. Only some fields are prose; the rest is structure (block
 * ids, heading levels, image URLs, layout hints) that must survive untouched.
 *
 * Hand-editing that JSON per language would be six articles times three
 * languages of opportunity to drop a field. So: export pulls out just the
 * strings, keyed by block id and field, and import puts them back into a deep
 * copy of the original structure. Anything a translation omits keeps its
 * English text rather than vanishing.
 *
 *   node scripts/article-blocks-io.mjs export <slug>            > en.json
 *   node scripts/article-blocks-io.mjs import <slug> <locale> <file>
 *   node scripts/article-blocks-io.mjs status
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync, writeFileSync } from 'fs';

const prisma = new PrismaClient();

/** Fields that hold prose. Everything else is structure and is never touched. */
const TEXT_FIELDS = ['text', 'title', 'caption', 'label', 'heading', 'content'];

function collect(blocks) {
  const out = {};
  blocks.forEach((block) => {
    for (const field of TEXT_FIELDS) {
      if (typeof block[field] === 'string' && block[field].trim()) {
        out[`${block.id}.${field}`] = block[field];
      }
    }
    if (Array.isArray(block.items)) {
      block.items.forEach((item, i) => {
        if (typeof item === 'string' && item.trim()) {
          out[`${block.id}.items.${i}`] = item;
        } else if (item && typeof item === 'object') {
          for (const field of TEXT_FIELDS) {
            if (typeof item[field] === 'string' && item[field].trim()) {
              out[`${block.id}.items.${i}.${field}`] = item[field];
            }
          }
        }
      });
    }
  });
  return out;
}

function apply(blocks, strings) {
  return blocks.map((block) => {
    const next = { ...block };
    for (const field of TEXT_FIELDS) {
      const key = `${block.id}.${field}`;
      if (key in strings) next[field] = strings[key];
    }
    if (Array.isArray(block.items)) {
      next.items = block.items.map((item, i) => {
        if (typeof item === 'string') {
          const key = `${block.id}.items.${i}`;
          return key in strings ? strings[key] : item;
        }
        if (item && typeof item === 'object') {
          const copy = { ...item };
          for (const field of TEXT_FIELDS) {
            const key = `${block.id}.items.${i}.${field}`;
            if (key in strings) copy[field] = strings[key];
          }
          return copy;
        }
        return item;
      });
    }
    return next;
  });
}

async function getArticle(slug) {
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, slug: true, contentBlocks: true, translations: true },
  });
  if (!article) throw new Error(`no article with slug "${slug}"`);
  return article;
}

async function cmdExport(slug) {
  const article = await getArticle(slug);
  const blocks = JSON.parse(article.contentBlocks);
  const strings = collect(blocks);
  process.stdout.write(JSON.stringify(strings, null, 2) + '\n');
  process.stderr.write(`${Object.keys(strings).length} strings, ${blocks.length} blocks\n`);
}

async function cmdImport(slug, locale, file) {
  const article = await getArticle(slug);
  const englishBlocks = JSON.parse(article.contentBlocks);
  const strings = JSON.parse(readFileSync(file, 'utf8'));

  const englishStrings = collect(englishBlocks);
  const missing = Object.keys(englishStrings).filter((k) => !(k in strings));
  const unknown = Object.keys(strings).filter((k) => !(k in englishStrings));

  const translatedBlocks = apply(englishBlocks, strings);

  const translations = JSON.parse(article.translations);
  const entry = translations.find((t) => t.locale === locale);
  if (!entry) throw new Error(`no "${locale}" entry on ${slug}; add title/description first`);
  entry.blocks = translatedBlocks;

  await prisma.article.update({
    where: { id: article.id },
    data: { translations: JSON.stringify(translations) },
  });

  console.log(`${slug} [${locale}]: ${Object.keys(strings).length} strings applied to ${translatedBlocks.length} blocks`);
  if (missing.length) console.log(`  ${missing.length} left in English: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '…' : ''}`);
  if (unknown.length) console.log(`  ${unknown.length} unknown keys ignored: ${unknown.slice(0, 5).join(', ')}`);
}

async function cmdStatus() {
  const rows = await prisma.article.findMany({ select: { slug: true, translations: true, contentBlocks: true } });
  const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'ja'];
  console.log('translated bodies by locale (· = English fallback)\n');
  console.log('  ' + 'article'.padEnd(38) + locales.join('  '));
  for (const row of rows) {
    const t = JSON.parse(row.translations);
    const marks = locales.map((l) => {
      if (l === 'en') return ' ✓';
      const e = t.find((x) => x.locale === l);
      return e && Array.isArray(e.blocks) && e.blocks.length ? ' ✓' : ' ·';
    });
    console.log('  ' + row.slug.padEnd(38) + marks.join('  '));
  }
}

const [cmd, ...args] = process.argv.slice(2);
const run =
  cmd === 'export' ? cmdExport(args[0])
  : cmd === 'import' ? cmdImport(args[0], args[1], args[2])
  : cmd === 'status' ? cmdStatus()
  : Promise.reject(new Error('usage: export <slug> | import <slug> <locale> <file> | status'));

run.catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
