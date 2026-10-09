(function (global) {
  const ignoredEntryTypes = new Set(['comment', 'preamble', 'string']);

  function readBalanced(text, start, opening, closing) {
    let depth = 1;
    let escaped = false;
    let value = '';
    for (let index = start + 1; index < text.length; index += 1) {
      const character = text[index];
      if (escaped) {
        value += character;
        escaped = false;
        continue;
      }
      if (character === '\\') {
        value += character;
        escaped = true;
        continue;
      }
      if (character === opening) depth += 1;
      if (character === closing) {
        depth -= 1;
        if (depth === 0) return { value, end: index + 1 };
      }
      value += character;
    }
    throw new Error('BibTeX has an unclosed bracket or brace.');
  }

  function readQuoted(text, start) {
    let escaped = false;
    let braceDepth = 0;
    let value = '';
    for (let index = start + 1; index < text.length; index += 1) {
      const character = text[index];
      if (escaped) {
        value += character;
        escaped = false;
        continue;
      }
      if (character === '\\') {
        value += character;
        escaped = true;
        continue;
      }
      if (character === '{') braceDepth += 1;
      else if (character === '}' && braceDepth > 0) braceDepth -= 1;
      else if (character === '"' && braceDepth === 0) return { value, end: index + 1 };
      value += character;
    }
    throw new Error('BibTeX has an unclosed quoted value.');
  }

  function readValuePart(text, start) {
    const character = text[start];
    if (character === '{') return readBalanced(text, start, '{', '}');
    if (character === '"') return readQuoted(text, start);

    let end = start;
    while (end < text.length && !/[#,}\s]/.test(text[end])) end += 1;
    return { value: text.slice(start, end), end };
  }

  function parseFields(text) {
    const fields = {};
    let index = 0;

    while (index < text.length) {
      while (index < text.length && /[\s,]/.test(text[index])) index += 1;
      if (index >= text.length) break;

      const nameStart = index;
      while (index < text.length && /[A-Za-z0-9_:-]/.test(text[index])) index += 1;
      const name = text.slice(nameStart, index).trim().toLowerCase();
      if (!name) throw new Error('BibTeX contains a field without a name.');
      while (index < text.length && /\s/.test(text[index])) index += 1;
      if (text[index] !== '=') throw new Error(`BibTeX field “${name}” is missing “=”.`);
      index += 1;

      const parts = [];
      while (index < text.length) {
        while (index < text.length && /\s/.test(text[index])) index += 1;
        if (index >= text.length) break;
        const part = readValuePart(text, index);
        if (part.end === index) throw new Error(`BibTeX field “${name}” has an invalid value.`);
        parts.push(part.value);
        index = part.end;
        while (index < text.length && /\s/.test(text[index])) index += 1;
        if (text[index] !== '#') break;
        index += 1;
      }

      fields[name] = parts.join('');
      while (index < text.length && text[index] !== ',') index += 1;
      if (text[index] === ',') index += 1;
    }
    return fields;
  }

  function parse(text) {
    const source = String(text || '').trim();
    if (!source) throw new Error('Paste a BibTeX entry first.');

    const entryPattern = /@([A-Za-z]+)\s*([\{(])/g;
    let match;
    while ((match = entryPattern.exec(source))) {
      const type = match[1].toLowerCase();
      const opening = match[2];
      const closing = opening === '{' ? '}' : ')';
      const openingIndex = entryPattern.lastIndex - 1;
      const entry = readBalanced(source, openingIndex, opening, closing).value;
      if (ignoredEntryTypes.has(type)) continue;

      let commaIndex = -1;
      let braceDepth = 0;
      let quoted = false;
      let escaped = false;
      for (let index = 0; index < entry.length; index += 1) {
        const character = entry[index];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (character === '\\') {
          escaped = true;
          continue;
        }
        if (character === '"') quoted = !quoted;
        if (!quoted) {
          if (character === '{') braceDepth += 1;
          else if (character === '}' && braceDepth > 0) braceDepth -= 1;
          else if (character === ',' && braceDepth === 0) {
            commaIndex = index;
            break;
          }
        }
      }
      if (commaIndex < 0) throw new Error('BibTeX entry is missing its citation key separator.');

      return {
        type,
        citationKey: entry.slice(0, commaIndex).trim(),
        fields: parseFields(entry.slice(commaIndex + 1))
      };
    }
    throw new Error('No supported BibTeX entry was found.');
  }

  function decodeAccent(symbol, letter) {
    const combiningMarks = {
      '"': '\u0308',
      "'": '\u0301',
      '`': '\u0300',
      '^': '\u0302',
      '~': '\u0303',
      '=': '\u0304',
      '.': '\u0307',
      'c': '\u0327',
      'v': '\u030C',
      'u': '\u0306'
    };
    return `${letter}${combiningMarks[symbol] || ''}`.normalize('NFC');
  }

  function normaliseLatex(value) {
    let text = String(value || '');
    text = text
      .replace(/\{\\(["'`^~=\.cvu])\{?([A-Za-z])\}?\}/g, (_, symbol, letter) => decodeAccent(symbol, letter))
      .replace(/\\(["'`^~=\.cvu])\{?([A-Za-z])\}?/g, (_, symbol, letter) => decodeAccent(symbol, letter))
      .replace(/\\(?:textit|textbf|emph|mathrm|mathbf|operatorname)\s*\{([^{}]*)\}/g, '$1')
      .replace(/\\(?:LaTeX|TeX)\b/g, (command) => command.slice(1))
      .replace(/\\([&%_$#{}])/g, '$1')
      .replace(/[{}]/g, '')
      .replace(/~/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text;
  }

  function splitAuthors(value) {
    return String(value || '')
      .split(/\s+and\s+/i)
      .map((author) => normaliseLatex(author))
      .filter(Boolean)
      .map((author) => {
        const parts = author.split(',').map((part) => part.trim()).filter(Boolean);
        if (parts.length === 2) return `${parts[1]} ${parts[0]}`.trim();
        if (parts.length >= 3) return `${parts[2]} ${parts[0]}, ${parts[1]}`.trim();
        return author;
      })
      .join(', ');
  }

  function inferCategory(type, venue, fields) {
    if (/workshop/i.test(venue)) return 'Workshop';
    if (type === 'article') return 'Journal';
    if (['conference', 'inproceedings', 'proceedings'].includes(type)) return 'Conference';
    if (['unpublished', 'techreport'].includes(type)) return 'Preprint';
    if (type === 'dataset' || fields.howpublished?.toLowerCase().includes('dataset')) return 'Dataset';
    if (type === 'misc' && (fields.eprint || fields.archiveprefix)) return 'Preprint';
    return 'Other';
  }

  function arxivUrl(fields) {
    const eprint = normaliseLatex(fields.eprint || '').replace(/^arxiv:/i, '').trim();
    if (eprint && (!fields.archiveprefix || /arxiv/i.test(fields.archiveprefix))) {
      return `https://arxiv.org/abs/${eprint}`;
    }
    const url = normaliseLatex(fields.url || '');
    return /arxiv\.org\/(?:abs|pdf)\//i.test(url) ? url.replace(/\.pdf$/i, '') : '';
  }

  function toPublication(text) {
    const entry = parse(text);
    const fields = entry.fields;
    const venue = normaliseLatex(fields.journal || fields.booktitle || fields.series || fields.publisher || fields.school || fields.institution || '');
    const doi = normaliseLatex(fields.doi || '').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
    const url = normaliseLatex(fields.url || '');
    const yearMatch = normaliseLatex(fields.year || '').match(/\d{4}/);
    const keywords = normaliseLatex(fields.keywords || '')
      .split(/[,;]/)
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .join(', ');

    const values = {
      title: normaliseLatex(fields.title || ''),
      authors: splitAuthors(fields.author || ''),
      venue,
      year: yearMatch ? Number(yearMatch[0]) : '',
      category: inferCategory(entry.type, venue, fields),
      abstract: normaliseLatex(fields.abstract || ''),
      doi,
      paperUrl: url || (doi ? `https://doi.org/${doi}` : ''),
      pdf: normaliseLatex(fields.pdf || ''),
      arxiv: arxivUrl(fields),
      project: normaliseLatex(fields.project || ''),
      code: normaliseLatex(fields.code || ''),
      dataset: normaliseLatex(fields.dataset || ''),
      video: normaliseLatex(fields.video || ''),
      keywords
    };

    return { entry, values: Object.fromEntries(Object.entries(values).filter(([, value]) => value !== '')) };
  }

  global.MILBibTeX = { parse, toPublication };
})(typeof window === 'undefined' ? globalThis : window);
