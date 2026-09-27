/* Equal shares only. Integer minor units; saved participant order is 1..count. */
(function (root) {
  'use strict';
  function parseAmount(text, currency) {
    const value = String(text).trim();
    if (!['KRW', 'USD'].includes(currency)) throw new Error('currency');
    const pattern = currency === 'KRW' ? /^\d{1,9}$/ : /^\d{1,7}(?:\.\d{1,2})?$/;
    if (!pattern.test(value)) throw new Error('amount');
    const [whole, fraction = ''] = value.split('.');
    const units = currency === 'KRW' ? BigInt(whole) : BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
    if (units < 1n || units > 999999999n) throw new Error('amount');
    return units;
  }
  function split(units, countText) {
    if (typeof units !== 'bigint' || units < 1n || units > 999999999n) throw new Error('amount');
    if (!/^(?:[1-9]|1[0-2])$/.test(String(countText))) throw new Error('count');
    const count = BigInt(countText), base = units / count, remainder = units % count;
    return Array.from({ length: Number(count) }, (_, i) => base + (BigInt(i) < remainder ? 1n : 0n));
  }
  function format(units, currency) {
    const group = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (currency === 'KRW') return group(units) + ' KRW';
    if (currency === 'USD') return '$' + group(units / 100n) + '.' + (units % 100n).toString().padStart(2, '0') + ' USD';
    throw new Error('currency');
  }
  const api = Object.freeze({ parseAmount, split, format });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OweDoneSplitDemo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
