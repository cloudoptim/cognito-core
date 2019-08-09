// isEmpty util
const isEmpty = (v) => Object.keys(v).length === 0;

// Pick keys from object, ignore if key is not available or undefined
const pick = (obj, keys) => keys.reduce((r, key) => key in obj ? { ...r, [key]: obj[key] } : r, {})

module.exports = {
  pick,
  isEmpty,
};
