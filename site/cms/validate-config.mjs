/**
 * Validates Decap CMS field definitions before writing config.yml.
 * Catches schema errors (e.g. list.field missing `name`) at build time.
 */

/** @param {unknown} field */
function validateField(field, path) {
  /** @type {string[]} */
  const errors = [];
  if (!field || typeof field !== 'object') return errors;

  const f = /** @type {Record<string, unknown>} */ (field);
  const label = String(f.label ?? f.name ?? path);

  if (f.widget === 'list') {
    if (f.field) {
      const inner = /** @type {Record<string, unknown>} */ (f.field);
      if (!inner.name) {
        errors.push(`'${path || label}' list field must have inner field.name`);
      }
      errors.push(...validateField(inner, `${path || label}.field`));
    }
    if (Array.isArray(f.fields)) {
      for (const child of f.fields) {
        errors.push(...validateField(child, `${path || label}.fields`));
      }
    }
    if (!f.field && !f.fields) {
      errors.push(`'${path || label}' list must define field or fields`);
    }
  }

  if (f.widget === 'object' && Array.isArray(f.fields)) {
    for (const child of f.fields) {
      errors.push(...validateField(child, `${path || label}`));
    }
  }

  if (f.widget && f.widget !== 'list' && f.widget !== 'object' && !f.name) {
    errors.push(`'${path || label}' must have required property 'name'`);
  }

  return errors;
}

/** @param {unknown[]} collections */
export function validateCollections(collections) {
  /** @type {string[]} */
  const errors = [];

  for (const collection of collections) {
    const c = /** @type {Record<string, unknown>} */ (collection);
    const prefix = String(c.name ?? c.label ?? 'collection');

    if (Array.isArray(c.fields)) {
      for (const field of c.fields) {
        errors.push(...validateField(field, `${prefix}`));
      }
    }

    if (Array.isArray(c.files)) {
      for (const file of c.files) {
        const entry = /** @type {Record<string, unknown>} */ (file);
        const filePath = `${prefix}.${entry.name ?? entry.label}`;
        if (Array.isArray(entry.fields)) {
          for (const field of entry.fields) {
            errors.push(...validateField(field, filePath));
          }
        }
      }
    }
  }

  return errors;
}
