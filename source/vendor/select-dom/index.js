// source/vendor/select-dom/index.js
// The minified code for the `select-dom` library.

/**
 * Package Information
 *
 * @name: select-dom
 * @author: Federico Brigante
 * @version: 7.1.0
 * @license: MIT
 * @github: https://github.com/fregante/select-dom
 * @source: https://cdn.jsdelivr.net/npm/select-dom
 */
function isQueryable(e){return"function"==typeof e.querySelectorAll}function select(e,t){var l;if(2!==arguments.length||t)return null!==(l=(null!=t?t:document).querySelector(String(e)))&&void 0!==l?l:void 0}function selectLast(e,t){if(2===arguments.length&&!t)return;const l=(null!=t?t:document).querySelectorAll(String(e));return l[l.length-1]}function selectExists(e,t){return!(2===arguments.length&&!t)&&Boolean((null!=t?t:document).querySelector(String(e)))}function selectAll(e,t){if(2===arguments.length&&!t)return[];if(!t||isQueryable(t)){return[...(null!=t?t:document).querySelectorAll(String(e))]}const l=new Set;for(const n of t)for(const t of n.querySelectorAll(String(e)))l.add(t);return[...l]}select.last=selectLast,select.exists=selectExists,select.all=selectAll;export default select;
