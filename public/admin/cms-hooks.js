(function () {
  function parseBibTeX(raw) {
    if (!raw || typeof raw !== 'string') return {};
    const start = raw.indexOf('{');
    if (start < 0) return {};
    let cursor = raw.indexOf(',', start);
    if (cursor < 0) return {};
    cursor += 1;
    const fields = {};

    while (cursor < raw.length) {
      while (/[,\s]/.test(raw[cursor] || '')) cursor += 1;
      if (raw[cursor] === '}') break;
      const keyStart = cursor;
      while (cursor < raw.length && /[A-Za-z0-9_-]/.test(raw[cursor])) cursor += 1;
      const key = raw.slice(keyStart, cursor).trim().toLowerCase();
      while (/\s/.test(raw[cursor] || '')) cursor += 1;
      if (raw[cursor] !== '=') { cursor += 1; continue; }
      cursor += 1;
      while (/\s/.test(raw[cursor] || '')) cursor += 1;

      let value = '';
      if (raw[cursor] === '{') {
        cursor += 1;
        let depth = 1;
        const valueStart = cursor;
        while (cursor < raw.length && depth > 0) {
          if (raw[cursor] === '{') depth += 1;
          if (raw[cursor] === '}') depth -= 1;
          cursor += 1;
        }
        value = raw.slice(valueStart, cursor - 1);
      } else if (raw[cursor] === '"') {
        cursor += 1;
        const valueStart = cursor;
        while (cursor < raw.length && (raw[cursor] !== '"' || raw[cursor - 1] === '\\')) cursor += 1;
        value = raw.slice(valueStart, cursor);
        cursor += 1;
      } else {
        const valueStart = cursor;
        while (cursor < raw.length && raw[cursor] !== ',' && raw[cursor] !== '}') cursor += 1;
        value = raw.slice(valueStart, cursor);
      }

      if (key) fields[key] = value.replace(/[{}]/g, '').replace(/\\&/g, '&').replace(/\s+/g, ' ').trim();
    }

    const entryType = raw.slice(1, start).trim().toLowerCase();
    return {
      title: fields.title,
      authors: fields.author ? fields.author.split(/\s+and\s+/i).join(', ') : undefined,
      venue: fields.journal || fields.booktitle,
      year: fields.year ? Number.parseInt(fields.year, 10) : undefined,
      doi: fields.doi ? fields.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '') : undefined,
      paperUrl: fields.url,
      arxiv: fields.eprint ? `https://arxiv.org/abs/${fields.eprint}` : undefined,
      category: entryType === 'article' ? 'Journal' : entryType === 'inproceedings' ? 'Conference' : fields.eprint ? 'Preprint' : undefined
    };
  }

  const BibTeXControl = createClass({
    handleChange: function (event) { this.props.onChange(event.target.value); },
    render: function () {
      const value = this.props.value || '';
      const parsed = parseBibTeX(value);
      const summary = parsed.title
        ? `Detected: ${parsed.title}${parsed.year ? ` (${parsed.year})` : ''}. Empty publication fields will be completed when you save.`
        : 'Paste one complete BibTeX entry. Title, authors, venue, year, DOI and arXiv fields are imported on save when their fields are empty.';
      return h('div', { className: this.props.classNameWrapper },
        h('textarea', {
          id: this.props.forID,
          value: value,
          onChange: this.handleChange,
          rows: 14,
          placeholder: '@article{key,\n  title = {...},\n  author = {...}\n}',
          style: { width: '100%', padding: '12px', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', border: '1px solid #b8cbd7' }
        }),
        h('p', { style: { margin: '8px 0 0', color: parsed.title ? '#146f97' : '#627b8c', fontSize: '13px' } }, summary)
      );
    }
  });

  CMS.registerWidget('bibtex-import', BibTeXControl);
  CMS.registerEventListener({
    name: 'preSave',
    handler: function ({ entry }) {
      let data = entry.get('data');
      const isPublication = entry.get('collection') === 'publications' || data.has('bibtex');
      if (!isPublication) return data;
      const raw = data.get('bibtex');
      if (raw) {
        const parsed = parseBibTeX(raw);
        Object.keys(parsed).forEach(function (key) {
          if ((data.get(key) === undefined || data.get(key) === null || data.get(key) === '') && parsed[key] !== undefined) {
            data = data.set(key, parsed[key]);
          }
        });
      }
      if (!data.get('title') || !data.get('authors') || !data.get('year')) {
        throw new Error('A publication needs a title, authors and year. Enter them manually or paste a BibTeX entry containing these fields.');
      }
      return data;
    }
  });
})();
