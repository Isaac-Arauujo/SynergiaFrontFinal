// src/utils/normalize.js
// Converte snake_case -> camelCase recursivamente

function toCamel(s) {
  return s.replace(/([-_][a-z])/gi, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

export function normalizeObjectKeys(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(normalizeObjectKeys);
  if (typeof obj === 'object') {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      const newKey = toCamel(key);
      newObj[newKey] = normalizeObjectKeys(obj[key]);
    });
    return newObj;
  }
  return obj;
}
