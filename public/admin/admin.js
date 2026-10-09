(function () {
  const ADMIN_USERNAME = 'MIL';
  const ADMIN_PASSWORD = 'MIL';
  const SESSION_KEY = 'mil-admin-session';
  const adminData = window.__MIL_ADMIN_DATA__ || {};
  const repositoryUrl = adminData.repositoryUrl || '';
  const repositorySlug = adminData.repositorySlug || '';
  const branch = adminData.branch || 'main';
  const content = adminData.content || {};

  const contentFolders = {
    news: 'src/content/news',
    publications: 'src/content/publications',
    people: 'src/content/people',
    research: 'src/content/research'
  };

  const mediaConfig = {
    publications: {
      folder: 'public/uploads/publications',
      publicPrefix: 'uploads/publications/'
    },
    people: {
      folder: 'public/uploads/people',
      publicPrefix: 'uploads/people/'
    }
  };

  const fieldConfig = {
    news: [
      { key: 'body', label: 'News Markdown', type: 'markdown', required: true, wide: true, rows: 18, body: true, help: 'Write the complete update directly in Markdown. For a paper link, copy its relative URL from “Publication URL reference” in the upper-right panel and place it inside [paper title](URL). Use a complete https:// URL for conferences and other external websites.' },
      { key: 'date', label: 'Date', type: 'date', required: true, default: today },
      { key: 'dateLabel', label: 'Display date label (optional)', type: 'text', help: 'Use this only when the source gives a month rather than an exact day, for example “Sep 2026”.' },
      { key: 'category', label: 'Category', type: 'select', required: true, default: 'General', options: ['Publication', 'Award', 'Event', 'Opportunity', 'General'] },
      { key: 'draft', label: 'Draft', type: 'checkbox', default: false }
    ],
    publications: [
      { key: 'bibtex', label: '1. Paste BibTeX first', type: 'textarea', wide: true, rows: 11, block: true, importer: true, help: 'Paste one complete BibTeX entry, then let the form identify its title, authors, venue, year, DOI, links, abstract and keywords.' },
      { key: 'title', label: 'Paper title', type: 'text', required: true, primary: true, wide: true },
      { key: 'authors', label: 'Authors', type: 'text', required: true, wide: true },
      { key: 'venue', label: 'Journal or conference', type: 'text', wide: true },
      { key: 'year', label: 'Year', type: 'number', required: true, default: currentYear },
      { key: 'category', label: 'Category', type: 'select', required: true, default: 'Conference', options: ['Journal', 'Conference', 'Workshop', 'Preprint', 'Dataset', 'Other'] },
      { key: 'image', label: 'Publication image', type: 'media', wide: true, help: 'Choose an image already committed in the Publication upload folder.' },
      { key: 'abstract', label: 'Abstract', type: 'textarea', wide: true, rows: 6 },
      { key: 'award', label: 'Award', type: 'text', wide: true },
      { key: 'doi', label: 'DOI', type: 'text' },
      { key: 'paperUrl', label: 'Paper URL', type: 'url' },
      { key: 'pdf', label: 'PDF URL', type: 'text' },
      { key: 'arxiv', label: 'arXiv URL', type: 'url' },
      { key: 'project', label: 'Project URL', type: 'url' },
      { key: 'code', label: 'Code URL', type: 'url' },
      { key: 'dataset', label: 'Dataset URL', type: 'url' },
      { key: 'video', label: 'Video URL', type: 'url' },
      { key: 'keywords', label: 'Keywords', type: 'tags', wide: true, help: 'Separate keywords with commas.' },
      { key: 'featured', label: 'Featured', type: 'checkbox', default: false },
      { key: 'draft', label: 'Draft', type: 'checkbox', default: false }
    ],
    people: [
      { key: 'name', label: 'Full name', type: 'text', required: true, primary: true, wide: true },
      { key: 'category', label: 'Category', type: 'select', required: true, default: 'PhD Students', options: ['Faculty', 'Postdoctoral Researchers', 'PhD Students', 'Research Assistants', 'Visiting Scholars', 'MSc Students', 'Undergraduate Students', 'Alumni'] },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'bio', label: 'Biography', type: 'textarea', wide: true, rows: 5 },
      { key: 'image', label: 'Portrait image', type: 'media', wide: true, help: 'Choose an existing portrait or one committed through the upload step.' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'scholar', label: 'Google Scholar URL', type: 'url' },
      { key: 'website', label: 'Website URL', type: 'url' },
      { key: 'github', label: 'GitHub URL', type: 'url' },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { key: 'order', label: 'Display order', type: 'number', required: true, default: 100 },
      { key: 'current', label: 'Current member', type: 'checkbox', default: true },
      { key: 'draft', label: 'Draft', type: 'checkbox', default: false }
    ],
    research: [
      { key: 'title', label: 'Full research title', type: 'text', required: true, primary: true, wide: true },
      { key: 'shortTitle', label: 'Short title', type: 'text', required: true },
      { key: 'summary', label: 'Summary', type: 'textarea', required: true, wide: true, rows: 4 },
      { key: 'accent', label: 'Accent', type: 'select', required: true, default: 'blue', options: ['cyan', 'violet', 'mint', 'blue'] },
      { key: 'order', label: 'Display order', type: 'number', required: true, default: 100 },
      { key: 'featured', label: 'Featured', type: 'checkbox', default: true },
      { key: 'draft', label: 'Draft', type: 'checkbox', default: false },
      { key: 'body', label: 'Research description (Markdown)', type: 'textarea', wide: true, rows: 10, body: true }
    ]
  };

  const mediaByType = {
    publications: [...(adminData.initialMedia?.publications || [])],
    people: [...(adminData.initialMedia?.people || [])]
  };
  const otherFilesByType = { publications: [], people: [] };
  const mediaVersionByType = { publications: 'main', people: 'main' };
  const imagePattern = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

  const state = {
    contentType: '',
    operation: '',
    entry: null,
    copied: false,
    slugManuallyEdited: false
  };

  const loginView = document.querySelector('[data-login-view]');
  const adminView = document.querySelector('[data-admin-view]');
  const loginForm = document.querySelector('[data-login-form]');
  const loginError = document.querySelector('[data-login-error]');
  const selectionForm = document.querySelector('[data-selection-form]');
  const contentTypeSelect = selectionForm?.querySelector('[name="contentType"]');
  const operationSelect = selectionForm?.querySelector('[name="operation"]');
  const entryField = document.querySelector('[data-entry-field]');
  const entrySelect = entryField?.querySelector('[name="entryId"]');
  const selectionStatus = document.querySelector('[data-selection-status]');
  const mediaStep = document.querySelector('[data-media-step]');
  const newsReference = document.querySelector('[data-news-reference]');
  const mediaLocked = document.querySelector('[data-media-locked]');
  const mediaControls = document.querySelector('[data-media-controls]');
  const mediaPath = document.querySelector('[data-media-path]');
  const mediaList = document.querySelector('[data-media-list]');
  const mediaStatus = document.querySelector('[data-media-status]');
  const uploadLink = document.querySelector('[data-upload-link]');
  const refreshMediaButton = document.querySelector('[data-refresh-media]');
  const editorStep = document.querySelector('[data-editor-step]');
  const editorStepNumber = document.querySelector('[data-editor-step-number]');
  const editorTitle = document.querySelector('[data-editor-title]');
  const editorLocked = document.querySelector('[data-editor-locked]');
  const contentEditor = document.querySelector('[data-content-editor]');
  const contentForm = document.querySelector('[data-content-form]');
  const contentFields = document.querySelector('[data-content-fields]');
  const slugField = document.querySelector('[data-slug-field]');
  const slugInput = contentForm?.querySelector('[name="slug"]');
  const contentPath = document.querySelector('[data-content-path]');
  const copyButton = document.querySelector('[data-copy-content]');
  const openGithubButton = document.querySelector('[data-open-github]');
  const contentStatus = document.querySelector('[data-content-status]');
  const deletePanel = document.querySelector('[data-delete-panel]');
  const deletePath = document.querySelector('[data-delete-path]');
  const deleteLink = document.querySelector('[data-delete-link]');
  const workflow = document.querySelector('[data-workflow]');
  const selectionStep = document.querySelector('[data-selection-step]');
  const quickActionButtons = Array.from(document.querySelectorAll('[data-quick-content][data-quick-operation]'));

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function currentYear() {
    return new Date().getFullYear();
  }

  function showAdmin() {
    loginView.hidden = true;
    adminView.hidden = false;
  }

  function showLogin() {
    adminView.hidden = true;
    loginView.hidden = false;
  }

  if (sessionStorage.getItem(SESSION_KEY) === 'active') showAdmin();
  else showLogin();

  loginForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const username = String(formData.get('username') || '');
    const password = String(formData.get('password') || '');
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'active');
      loginError.hidden = true;
      loginForm.reset();
      showAdmin();
      return;
    }
    loginError.hidden = false;
  });

  document.querySelector('[data-logout]')?.addEventListener('click', function () {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  function cleanSlug(value) {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function getDefault(field) {
    return typeof field.default === 'function' ? field.default() : (field.default ?? '');
  }

  function getSelectedEntry() {
    const entries = content[state.contentType] || [];
    return entries.find((entry) => entry.id === entrySelect?.value) || null;
  }

  function populateEntryOptions(type) {
    if (!entrySelect) return;
    entrySelect.replaceChildren(new Option('Please select', ''));
    (content[type] || []).forEach(function (entry) {
      entrySelect.add(new Option(`${entry.title} — ${entry.meta}`, entry.id));
    });
  }

  function setStepLocked(step, locked, messageElement, message) {
    step?.setAttribute('aria-disabled', String(locked));
    if (messageElement) {
      messageElement.hidden = !locked;
      if (message) messageElement.textContent = message;
    }
  }

  function resetCopyState(message) {
    const wasCopied = state.copied;
    state.copied = false;
    if (openGithubButton) openGithubButton.disabled = true;
    if (wasCopied && contentStatus) {
      contentStatus.textContent = message || 'The content changed. Copy the complete file again before opening GitHub.';
    }
  }

  function makeField(field, value) {
    if (field.type === 'markdown') return makeMarkdownField(field, value);

    const fieldElement = document.createElement(field.importer ? 'div' : 'label');
    fieldElement.className = field.wide ? 'form-field field-wide' : 'form-field';
    if (field.importer) fieldElement.classList.add('bibtex-field');

    if (field.type === 'checkbox') {
      fieldElement.classList.add('checkbox-field');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = field.key;
      input.checked = Boolean(value);
      const labelText = document.createElement('span');
      labelText.textContent = field.label;
      fieldElement.append(input, labelText);
      return fieldElement;
    }

    const labelText = document.createElement(field.importer ? 'label' : 'span');
    labelText.textContent = `${field.label}${field.required ? ' *' : ''}`;
    fieldElement.append(labelText);

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = field.rows || 4;
    } else if (field.type === 'select' || field.type === 'media') {
      input = document.createElement('select');
      if (field.type === 'media') {
        input.add(new Option('No image', ''));
        const paths = mediaByType[state.contentType] || [];
        paths.forEach((path) => input.add(new Option(path, path)));
        if (value && !paths.includes(String(value))) input.add(new Option(String(value), String(value)));
      } else {
        (field.options || []).forEach((option) => input.add(new Option(option, option)));
      }
    } else {
      input = document.createElement('input');
      input.type = field.type === 'tags' ? 'text' : field.type;
      if (field.type === 'number') input.step = '1';
    }

    input.name = field.key;
    input.required = Boolean(field.required);
    input.value = Array.isArray(value) ? value.join(', ') : String(value ?? '');
    if (field.importer) {
      input.id = 'publication-bibtex-input';
      labelText.htmlFor = input.id;
    }
    fieldElement.append(input);

    if (field.help) {
      const help = document.createElement('small');
      help.textContent = field.help;
      fieldElement.append(help);
    }

    if (field.importer) {
      const tools = document.createElement('div');
      tools.className = 'bibtex-tools';
      const importButton = document.createElement('button');
      importButton.className = 'outline-button';
      importButton.type = 'button';
      importButton.textContent = 'Read BibTeX & fill fields';
      importButton.addEventListener('click', applyBibtexToForm);

      const overwriteLabel = document.createElement('label');
      overwriteLabel.className = 'bibtex-overwrite';
      const overwrite = document.createElement('input');
      overwrite.type = 'checkbox';
      overwrite.setAttribute('data-bibtex-overwrite', '');
      const overwriteText = document.createElement('span');
      overwriteText.textContent = 'Overwrite fields that already have values';
      overwriteLabel.append(overwrite, overwriteText);
      tools.append(importButton, overwriteLabel);

      const status = document.createElement('p');
      status.className = 'bibtex-status';
      status.setAttribute('data-bibtex-status', '');
      status.setAttribute('aria-live', 'polite');
      fieldElement.append(tools, status);
    }
    return fieldElement;
  }

  function makeMarkdownField(field, value) {
    const fieldElement = document.createElement('div');
    fieldElement.className = 'form-field field-wide markdown-field';

    const labelText = document.createElement('label');
    const editorId = `${field.key}-markdown-editor`;
    labelText.htmlFor = editorId;
    labelText.textContent = `${field.label}${field.required ? ' *' : ''}`;

    const help = document.createElement('small');
    help.textContent = field.help || '';

    const editor = document.createElement('textarea');
    editor.id = editorId;
    editor.name = field.key;
    editor.rows = field.rows || 18;
    editor.required = Boolean(field.required);
    editor.value = String(value ?? '');
    editor.placeholder = 'Write the complete news update in Markdown…';
    editor.spellcheck = true;
    editor.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const guide = document.createElement('div');
    guide.className = 'markdown-guide';
    const guideTitle = document.createElement('strong');
    guideTitle.textContent = 'Markdown reference';
    const examples = document.createElement('pre');
    examples.textContent = [
      'Basic syntax',
      '------------',
      '**bold text**',
      '*italic text*',
      '[paper title](publications/publication-slug/)',
      '[conference name](https://conference.example.org/)',
      '- bullet point',
      '1. numbered item',
      '',
      'Leave one blank line between paragraphs.',
      '',
      'Complete News example',
      '---------------------',
      'A paper, [FairMT: Fairness for Heterogeneous Multi-Task Learning](publications/fairmt/), has been **accepted** to [NeurIPS 2026](https://neurips.cc/).',
      '',
      'Congrats to **Guanyu** and all co-authors!'
    ].join('\n');
    guide.append(guideTitle, examples);

    fieldElement.append(labelText, help, editor, guide);
    return fieldElement;
  }

  function applyBibtexToForm() {
    const bibtexInput = contentForm?.querySelector('[name="bibtex"]');
    const overwriteInput = contentForm?.querySelector('[data-bibtex-overwrite]');
    const status = contentForm?.querySelector('[data-bibtex-status]');
    if (!bibtexInput || !status) return;

    status.classList.remove('is-error', 'is-success');
    try {
      if (!window.MILBibTeX) throw new Error('The BibTeX reader did not load. Refresh the page and try again.');
      const parsed = window.MILBibTeX.toPublication(bibtexInput.value);
      const config = fieldConfig.publications;
      const overwrite = Boolean(overwriteInput?.checked);
      const applied = [];
      const preserved = [];

      Object.entries(parsed.values).forEach(function ([key, value]) {
        const field = config.find((item) => item.key === key);
        const control = contentForm.elements[key];
        if (!field || !control || value === '') return;

        const currentValue = control.type === 'checkbox' ? control.checked : String(control.value || '').trim();
        const defaultValue = getDefault(field);
        const hasOnlyCreateDefault = state.operation === 'create' && String(currentValue) === String(defaultValue);
        if (!overwrite && currentValue !== '' && !hasOnlyCreateDefault) {
          preserved.push(field.label);
          return;
        }

        if (control.type === 'checkbox') control.checked = Boolean(value);
        else control.value = String(value);
        control.dispatchEvent(new Event('input', { bubbles: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
        applied.push(field.label);
      });

      const entryName = `@${parsed.entry.type}{${parsed.entry.citationKey || 'entry'}}`;
      if (!applied.length) {
        status.textContent = `${entryName} was read, but no empty matching fields were available. Select overwrite to replace existing values.`;
        return;
      }
      const preservedText = preserved.length ? ` Preserved ${preserved.length} field${preserved.length === 1 ? '' : 's'} that already had values.` : '';
      status.textContent = `${entryName} recognised. Filled ${applied.length} field${applied.length === 1 ? '' : 's'}: ${applied.join(', ')}.${preservedText}`;
      status.classList.add('is-success');
    } catch (error) {
      status.textContent = `Could not read BibTeX: ${error.message}`;
      status.classList.add('is-error');
    }
  }

  function renderContentForm() {
    if (!contentFields || !contentForm || !slugInput || !slugField) return;
    const config = fieldConfig[state.contentType] || [];
    const source = state.entry?.data || {};
    contentFields.replaceChildren();
    state.slugManuallyEdited = false;

    config.forEach(function (field) {
      const value = field.body
        ? (state.entry?.body || '')
        : (Object.prototype.hasOwnProperty.call(source, field.key) ? source[field.key] : getDefault(field));
      const element = makeField(field, value);
      contentFields.append(element);

      if (field.primary) {
        const primaryInput = element.querySelector(`[name="${field.key}"]`);
        primaryInput?.addEventListener('input', function () {
          if (state.operation === 'create' && !state.slugManuallyEdited) {
            slugInput.value = cleanSlug(primaryInput.value);
            updateContentPath();
          }
        });
      }
    });

    if (state.contentType === 'people') {
      const categoryControl = contentForm.elements.category;
      categoryControl?.addEventListener('change', syncPeopleCategoryFields);
      syncPeopleCategoryFields();
    }

    if (state.operation === 'create') {
      slugField.hidden = false;
      slugInput.required = true;
      if (state.contentType === 'news') {
        const dateInput = contentForm.elements.date;
        const syncNewsSlug = function () {
          if (!state.slugManuallyEdited) {
            slugInput.value = cleanSlug(`news-${dateInput?.value || today()}`);
            updateContentPath();
          }
        };
        syncNewsSlug();
        dateInput?.addEventListener('input', syncNewsSlug);
      } else {
        const primaryField = config.find((field) => field.primary);
        const primaryValue = primaryField ? contentForm.elements[primaryField.key]?.value : '';
        slugInput.value = cleanSlug(primaryValue || '');
      }
    } else {
      slugField.hidden = true;
      slugInput.required = false;
      slugInput.value = state.entry?.id?.replace(/\.md$/, '') || '';
    }

    resetCopyState();
    if (contentStatus) contentStatus.textContent = 'Complete the fields, then copy the full file before opening GitHub.';
    updateContentPath();
  }

  function syncPeopleCategoryFields() {
    if (state.contentType !== 'people' || !contentForm) return;
    const categoryControl = contentForm.elements.category;
    const imageControl = contentForm.elements.image;
    const currentControl = contentForm.elements.current;
    const isAlumni = categoryControl?.value === 'Alumni';
    const imageField = imageControl?.closest('.form-field');

    if (imageField) imageField.hidden = isAlumni;
    if (imageControl) {
      imageControl.disabled = isAlumni;
      if (isAlumni) imageControl.value = '';
    }
    if (isAlumni && currentControl) currentControl.checked = false;
  }

  function updateContentPath() {
    if (!contentPath) return;
    if (state.operation === 'create') {
      const fallback = state.contentType === 'news' ? `news-${today()}` : 'generated-content';
      const slug = cleanSlug(slugInput?.value || fallback) || fallback;
      contentPath.textContent = `${contentFolders[state.contentType] || ''}/${slug}.md`;
    } else {
      contentPath.textContent = state.entry?.path || '';
    }
  }

  function renderMediaList() {
    if (!mediaList || !mediaConfig[state.contentType]) return;
    mediaList.replaceChildren();
    const config = mediaConfig[state.contentType];
    const imagePaths = (mediaByType[state.contentType] || [])
      .filter((path) => path.startsWith(config.publicPrefix))
      .sort();
    const otherPaths = (otherFilesByType[state.contentType] || []).sort();
    const files = [
      ...imagePaths.map((path) => ({ path, isImage: true })),
      ...otherPaths.map((path) => ({ path, isImage: false }))
    ];

    if (!files.length) {
      const empty = document.createElement('p');
      empty.className = 'media-empty';
      empty.textContent = 'No uploaded files found in this folder yet.';
      mediaList.append(empty);
      return;
    }

    files.forEach(function ({ path, isImage }) {
      const row = document.createElement('div');
      row.className = `media-row${isImage ? '' : ' media-row-unsupported'}`;

      let preview;
      if (isImage) {
        preview = document.createElement('a');
        preview.className = 'media-thumbnail';
        preview.href = rawMediaUrl(path);
        preview.target = '_blank';
        preview.rel = 'noreferrer';
        preview.title = 'Open full-size image';
        const image = document.createElement('img');
        image.src = rawMediaUrl(path);
        image.alt = '';
        image.loading = 'lazy';
        const fallback = document.createElement('span');
        fallback.textContent = 'IMAGE';
        fallback.hidden = true;
        image.addEventListener('error', function () {
          image.hidden = true;
          fallback.hidden = false;
        });
        preview.append(image, fallback);
      } else {
        preview = document.createElement('div');
        preview.className = 'media-thumbnail media-file-thumbnail';
        const extension = path.split('.').pop() || 'FILE';
        preview.textContent = extension.slice(0, 5).toUpperCase();
      }

      const details = document.createElement('div');
      details.className = 'media-details';
      const fileName = document.createElement('strong');
      fileName.textContent = path.split('/').pop() || path;
      const name = document.createElement('code');
      name.textContent = path;
      details.append(fileName, name);
      if (!isImage) {
        const warning = document.createElement('small');
        warning.textContent = 'This file cannot be used in an image field. Export it as JPG, PNG or WebP first.';
        details.append(warning);
      }

      const actions = document.createElement('div');
      actions.className = 'media-actions';
      if (isImage) {
        const useButton = document.createElement('button');
        useButton.type = 'button';
        useButton.textContent = 'Use image';
        useButton.addEventListener('click', function () {
          const imageSelect = contentForm?.querySelector('[name="image"]');
          if (!imageSelect) return;
          if (!Array.from(imageSelect.options).some((option) => option.value === path)) {
            imageSelect.add(new Option(path, path));
          }
          imageSelect.value = path;
          imageSelect.dispatchEvent(new Event('input', { bubbles: true }));
          contentStatus.textContent = `Selected ${path}. Copy the full file again after finishing the form.`;
          imageSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        actions.append(useButton);
      }
      const deleteAnchor = document.createElement('a');
      deleteAnchor.href = `${repositoryUrl}/delete/${branch}/public/${path}`;
      deleteAnchor.target = '_blank';
      deleteAnchor.rel = 'noreferrer';
      deleteAnchor.textContent = 'Delete on GitHub';
      actions.append(deleteAnchor);
      row.append(preview, details, actions);
      mediaList.append(row);
    });
  }

  function rawMediaUrl(path) {
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    const version = encodeURIComponent(mediaVersionByType[state.contentType] || 'main');
    return `https://raw.githubusercontent.com/${repositorySlug}/${encodeURIComponent(branch)}/public/${encodedPath}?v=${version}`;
  }

  function updateMediaSelect() {
    const select = contentForm?.querySelector('[name="image"]');
    if (!select) return;
    const selected = select.value;
    const paths = mediaByType[state.contentType] || [];
    select.replaceChildren(new Option('No image', ''));
    paths.forEach((path) => select.add(new Option(path, path)));
    if (selected && !paths.includes(selected)) select.add(new Option(selected, selected));
    select.value = selected;
  }

  function configureMediaStep(ready) {
    const config = mediaConfig[state.contentType];
    if (newsReference) newsReference.hidden = state.contentType !== 'news';
    if (state.contentType && !config) {
      mediaStep.hidden = true;
      if (editorStepNumber) editorStepNumber.textContent = '02';
      return;
    }

    mediaStep.hidden = false;
    if (editorStepNumber) editorStepNumber.textContent = '03';
    if (!config || !ready) {
      mediaControls.hidden = true;
      setStepLocked(mediaStep, true, mediaLocked, state.contentType
        ? 'Finish the first step before managing images.'
        : 'Please select the first step before managing images.');
      return;
    }

    setStepLocked(mediaStep, false, mediaLocked);
    mediaControls.hidden = false;
    mediaPath.textContent = config.folder;
    uploadLink.href = `${repositoryUrl}/upload/${branch}/${config.folder}`;
    mediaStatus.textContent = 'Supported images: JPG, PNG, WebP, GIF, AVIF and SVG. PPTX and PDF files are shown after refresh but cannot be selected as images.';
    renderMediaList();
  }

  function configureEditorStep(ready) {
    if (!ready) {
      contentEditor.hidden = true;
      deletePanel.hidden = true;
      setStepLocked(editorStep, true, editorLocked, state.contentType
        ? 'Complete every selection in the first step before continuing.'
        : 'Please select the first step before editing content.');
      return;
    }

    setStepLocked(editorStep, false, editorLocked);
    if (state.operation === 'delete') {
      contentEditor.hidden = true;
      deletePanel.hidden = false;
      editorTitle.textContent = 'Delete the selected entry';
      deletePath.textContent = state.entry.path;
      deleteLink.href = `${repositoryUrl}/delete/${branch}/${state.entry.path}`;
      return;
    }

    deletePanel.hidden = true;
    contentEditor.hidden = false;
    editorTitle.textContent = state.operation === 'create' ? 'Create the content file' : 'Edit the content file';
    renderContentForm();
  }

  function syncWorkflow() {
    state.contentType = contentTypeSelect?.value || '';
    state.operation = operationSelect?.value || '';
    state.entry = getSelectedEntry();

    const needsEntry = state.operation === 'edit' || state.operation === 'delete';
    const ready = Boolean(state.contentType && state.operation && (!needsEntry || state.entry));

    if (!state.contentType) selectionStatus.textContent = 'Please select a content type first.';
    else if (!state.operation) selectionStatus.textContent = 'Now select whether to create, edit or delete.';
    else if (needsEntry && !state.entry) selectionStatus.textContent = 'Please select an existing entry.';
    else selectionStatus.textContent = 'First step complete. Continue below.';

    configureMediaStep(ready);
    configureEditorStep(ready);
  }

  contentTypeSelect?.addEventListener('change', function () {
    operationSelect.disabled = !contentTypeSelect.value;
    operationSelect.value = '';
    entryField.hidden = true;
    entrySelect.required = false;
    populateEntryOptions(contentTypeSelect.value);
    syncWorkflow();
  });

  operationSelect?.addEventListener('change', function () {
    const needsEntry = operationSelect.value === 'edit' || operationSelect.value === 'delete';
    entryField.hidden = !needsEntry;
    entrySelect.required = needsEntry;
    entrySelect.value = '';
    syncWorkflow();
  });

  entrySelect?.addEventListener('change', function () {
    syncWorkflow();
    if (entrySelect.value) editorStep?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  quickActionButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (!contentTypeSelect || !operationSelect || !workflow || !selectionStep) return;
      const contentType = button.dataset.quickContent || '';
      const operation = button.dataset.quickOperation || '';
      const needsEntry = operation === 'edit' || operation === 'delete';

      workflow.hidden = false;
      workflow.dataset.operation = operation;
      selectionStep.hidden = !needsEntry;
      contentTypeSelect.value = contentType;
      contentTypeSelect.dispatchEvent(new Event('change'));
      operationSelect.value = operation;
      operationSelect.dispatchEvent(new Event('change'));

      const target = needsEntry ? selectionStep : workflow;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (needsEntry) window.setTimeout(() => entrySelect?.focus(), 350);
    });
  });

  slugInput?.addEventListener('input', function () {
    state.slugManuallyEdited = true;
    const clean = cleanSlug(slugInput.value);
    if (clean !== slugInput.value) slugInput.value = clean;
    updateContentPath();
  });

  contentForm?.addEventListener('input', function () {
    resetCopyState();
  });

  function yamlString(value) {
    return JSON.stringify(String(value ?? ''));
  }

  function fieldValue(field) {
    const element = contentForm?.elements[field.key];
    if (!element) return '';
    if (field.type === 'checkbox') return element.checked;
    if (field.type === 'number') return Number(element.value);
    if (field.type === 'tags') {
      return String(element.value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return String(element.value || '');
  }

  function serialiseContent() {
    const config = fieldConfig[state.contentType] || [];
    const lines = ['---'];
    let body = '';

    config.forEach(function (field) {
      const value = fieldValue(field);
      if (field.body) {
        body = String(value);
        return;
      }
      if (field.type === 'checkbox' || field.type === 'number') {
        lines.push(`${field.key}: ${value}`);
      } else if (field.type === 'tags') {
        lines.push(`${field.key}: [${value.map(yamlString).join(', ')}]`);
      } else if (field.block && String(value).includes('\n')) {
        lines.push(`${field.key}: |-`);
        String(value).split('\n').forEach((line) => lines.push(`  ${line}`));
      } else {
        lines.push(`${field.key}: ${yamlString(value)}`);
      }
    });

    lines.push('---');
    if (config.some((field) => field.body)) lines.push('', body.trimEnd());
    return `${lines.join('\n').trimEnd()}\n`;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      return copied;
    }
  }

  document.querySelectorAll('[data-copy-publication-url]').forEach(function (button) {
    button.addEventListener('click', async function () {
      const relativeUrl = button.dataset.copyPublicationUrl || '';
      const status = document.querySelector('[data-publication-copy-status]');
      const copied = relativeUrl ? await copyText(relativeUrl) : false;
      if (status) status.textContent = copied
        ? `Copied ${relativeUrl}`
        : 'The browser blocked copying. Select the URL directly from the list.';
      if (copied) {
        const originalLabel = button.textContent;
        button.textContent = 'Copied';
        window.setTimeout(() => { button.textContent = originalLabel; }, 1200);
      }
    });
  });

  copyButton?.addEventListener('click', async function () {
    if (!contentForm.reportValidity()) {
      contentStatus.textContent = 'Please complete every required field before copying.';
      return;
    }

    if (state.operation === 'create') {
      const slug = cleanSlug(slugInput.value);
      if (!slug) {
        slugInput.setCustomValidity(state.contentType === 'news'
          ? 'Enter a short English file name for this news item.'
          : 'Enter a title or a short English file name.');
        slugInput.reportValidity();
        return;
      }
      slugInput.setCustomValidity('');
      slugInput.value = slug;
      updateContentPath();
    }

    const copied = await copyText(serialiseContent());
    state.copied = copied;
    openGithubButton.disabled = !copied;
    contentStatus.textContent = copied
      ? 'Copied. Now click “Open GitHub editor”, paste into the large file editing area, then click “Commit changes”.'
      : 'Copy was blocked by the browser. Allow clipboard access and try again.';
  });

  openGithubButton?.addEventListener('click', function () {
    if (!state.copied) {
      contentStatus.textContent = 'Copy the complete file content first.';
      return;
    }

    const url = state.operation === 'create'
      ? `${repositoryUrl}/new/${branch}/${contentFolders[state.contentType]}?filename=${encodeURIComponent(`${cleanSlug(slugInput.value)}.md`)}`
      : state.entry?.url;

    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
    contentStatus.textContent = 'GitHub opened. Paste into the large file editing area, then click “Commit changes”. Do not paste into the commit message box.';
  });

  refreshMediaButton?.addEventListener('click', async function () {
    const config = mediaConfig[state.contentType];
    if (!config) return;
    refreshMediaButton.disabled = true;
    mediaStatus.textContent = `Reading the latest ${branch} commit and files from GitHub…`;

    try {
      const refreshKey = Date.now();
      const requestOptions = {
        cache: 'no-store',
        headers: { Accept: 'application/vnd.github+json' }
      };
      const commitResponse = await fetch(
        `https://api.github.com/repos/${repositorySlug}/commits/${encodeURIComponent(branch)}?refresh=${refreshKey}`,
        requestOptions
      );
      if (!commitResponse.ok) throw new Error(`GitHub commit request returned ${commitResponse.status}`);
      const commit = await commitResponse.json();
      const commitSha = commit.sha;
      const treeSha = commit.commit?.tree?.sha;
      if (!commitSha || !treeSha) throw new Error('GitHub did not return the latest commit tree');

      const treeResponse = await fetch(
        `https://api.github.com/repos/${repositorySlug}/git/trees/${treeSha}?recursive=1&refresh=${refreshKey}`,
        requestOptions
      );
      if (!treeResponse.ok) throw new Error(`GitHub tree request returned ${treeResponse.status}`);
      const result = await treeResponse.json();
      const folderFiles = (result.tree || [])
        .filter((item) => item.type === 'blob' && item.path.startsWith(`${config.folder}/`))
        .map((item) => item.path.replace(/^public\//, ''));
      const uploaded = folderFiles.filter((path) => imagePattern.test(path));
      const otherFiles = folderFiles.filter((path) => !imagePattern.test(path));
      const preserved = (mediaByType[state.contentType] || []).filter((path) => !path.startsWith(config.publicPrefix));
      mediaByType[state.contentType] = [...new Set([...preserved, ...uploaded])].sort();
      otherFilesByType[state.contentType] = [...new Set(otherFiles)].sort();
      mediaVersionByType[state.contentType] = commitSha;
      renderMediaList();
      updateMediaSelect();
      const otherSummary = otherFiles.length
        ? ` ${otherFiles.length} other file${otherFiles.length === 1 ? '' : 's'} shown below cannot be selected as images.`
        : '';
      mediaStatus.textContent = `Refreshed from ${branch} @ ${commitSha.slice(0, 7)}: ${uploaded.length} image${uploaded.length === 1 ? '' : 's'}.${otherSummary}`;
    } catch (error) {
      mediaStatus.textContent = `Could not refresh the GitHub image list. ${error.message}. You can retry after confirming the image commit.`;
    } finally {
      refreshMediaButton.disabled = false;
    }
  });

  document.querySelectorAll('[data-load-entry]').forEach(function (button) {
    button.addEventListener('click', function () {
      contentTypeSelect.value = button.dataset.loadType;
      contentTypeSelect.dispatchEvent(new Event('change'));
      operationSelect.value = 'edit';
      operationSelect.dispatchEvent(new Event('change'));
      entrySelect.value = button.dataset.loadEntry;
      entrySelect.dispatchEvent(new Event('change'));
      document.querySelector('.workflow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  syncWorkflow();
})();
