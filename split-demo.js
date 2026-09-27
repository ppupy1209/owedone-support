/* Local calculator: no requests, storage, analytics or form submission. */
'use strict';
for (const panel of document.querySelectorAll('[data-calculator]')) {
  const ko = panel.lang === 'ko';
  const amount = panel.querySelector('[data-amount]');
  const count = panel.querySelector('[data-count]');
  const currency = panel.querySelector('[data-currency]');
  const error = panel.querySelector('[data-error]');
  const result = panel.querySelector('[data-result]');
  const rows = panel.querySelector('tbody');
  const total = panel.querySelector('[data-total]');
  const summary = panel.querySelector('[data-summary]');
  function clear() {
    result.hidden = true; error.textContent = ''; summary.textContent = '';
    amount.removeAttribute('aria-invalid'); count.removeAttribute('aria-invalid');
  }
  function calculate(userAction = false) {
    clear();
    let units, shares;
    try { units = OweDoneSplitDemo.parseAmount(amount.value, currency.value); }
    catch (_) {
      error.textContent = ko ? '금액을 확인하세요. 원화는 1~999999999 정수, 달러는 0.01~9999999.99이며 소수점 둘째 자리까지 입력할 수 있습니다. 쉼표·기호는 빼 주세요.' : 'Check the amount: KRW accepts whole numbers from 1 to 999999999; USD accepts 0.01 to 9999999.99 with up to two decimal places. Omit commas and symbols.';
      amount.setAttribute('aria-invalid', 'true'); if (userAction) amount.focus(); return;
    }
    try { shares = OweDoneSplitDemo.split(units, count.value); }
    catch (_) {
      error.textContent = ko ? '인원은 1~12의 정수로 입력해 주세요.' : 'Enter a whole number of people from 1 to 12.';
      count.setAttribute('aria-invalid', 'true'); if (userAction) count.focus(); return;
    }
    rows.replaceChildren();
    shares.forEach((share, i) => {
      const row = document.createElement('tr'), person = document.createElement('th'), value = document.createElement('td');
      person.scope = 'row'; person.textContent = ko ? `참여자 ${i + 1}` : `Person ${i + 1}`;
      value.textContent = OweDoneSplitDemo.format(share, currency.value);
      row.append(person, value); rows.append(row);
    });
    total.textContent = OweDoneSplitDemo.format(units, currency.value);
    const remainder = units % BigInt(shares.length);
    summary.textContent = ko ? `합계 ${total.textContent}, ${shares.length}명. 나머지 ${remainder}개 최소 단위는 앞 순서부터 한 단위씩 배분됩니다.` : `Total ${total.textContent}, ${shares.length} people. The ${remainder} remaining minor units go one each to the first people in order.`;
    result.hidden = false;
  }
  panel.querySelector('button').addEventListener('click', () => calculate(true));
  amount.addEventListener('input', clear); count.addEventListener('input', clear);
  currency.addEventListener('change', () => { amount.value = currency.value === 'KRW' ? '10000' : '10.00'; calculate(); });
  calculate();
}
