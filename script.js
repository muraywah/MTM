/* MTM prototype interactions — vanilla JavaScript only */
const sheet = document.querySelector('#sheet');
const overlay = document.querySelector('#overlay');
const sheetContent = document.querySelector('#sheetContent');
const toast = document.querySelector('#toast');
const toastMessage = document.querySelector('#toastMessage');
let activeBundle = { name: '5GB Anytime Data', price: 1500, validity: '7 days' };

const money = value => `₦${Number(value).toLocaleString('en-NG')}`;

function openSheet(content) {
  sheetContent.innerHTML = content;
  overlay.classList.add('show');
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
}
function closeSheet() {
  overlay.classList.remove('show');
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
}
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3600);
}
function selectPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page.id === pageId));
  document.querySelectorAll('[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === pageId));
  document.querySelectorAll('.side-link[data-page]').forEach(button => button.classList.toggle('selected', button.dataset.page === pageId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function buyDataSheet() {
  openSheet(`
    <h2>Buy data</h2><p class="sheet-intro">Choose a bundle that works for you.</p>
    <div class="segmented"><button class="selected">Recommended</button><button>Daily</button><button>Weekly</button><button>Monthly</button></div>
    <button class="option selected" data-choice="1.5GB"><span class="radio"></span><span><b>1.5GB Anytime</b><small>Valid for 7 days</small></span><strong>₦750</strong></button>
    <button class="option" data-choice="5GB"><span class="radio"></span><span><b>5GB Anytime</b><small>Valid for 7 days</small></span><strong>₦1,500</strong></button>
    <button class="option" data-choice="10GB"><span class="radio"></span><span><b>10GB SmartFlex</b><small>Valid for 30 days · +2GB weekend bonus</small></span><strong>₦2,500</strong></button>
    <button class="full-btn" id="dataContinue">Continue — ₦750</button>
  `);
  let selection = { name: '1.5GB Anytime', price: 750, validity: '7 days' };
  sheetContent.querySelectorAll('.option').forEach(option => option.addEventListener('click', () => {
    sheetContent.querySelectorAll('.option').forEach(item => item.classList.remove('selected'));
    option.classList.add('selected');
    const map = { '1.5GB': ['1.5GB Anytime', 750, '7 days'], '5GB': ['5GB Anytime', 1500, '7 days'], '10GB': ['10GB SmartFlex', 2500, '30 days'] };
    const item = map[option.dataset.choice]; selection = { name: item[0], price: item[1], validity: item[2] };
    document.querySelector('#dataContinue').textContent = `Continue — ${money(selection.price)}`;
  }));
  sheetContent.querySelector('#dataContinue').addEventListener('click', () => reviewPurchase(selection));
}
function buyAirtimeSheet() {
  openSheet(`
    <h2>Buy airtime</h2><p class="sheet-intro">Recharge your MTM line or a saved number.</p>
    <div class="segmented"><button class="selected">My number</button><button>Another number</button></div>
    <label class="field" for="airtimeAmount">Amount</label><input id="airtimeAmount" inputmode="numeric" value="1000" aria-label="Airtime amount">
    <div class="quick-amounts"><button class="option" data-amount="500"><span class="radio"></span><span><b>₦500</b><small>Quick recharge</small></span></button><button class="option selected" data-amount="1000"><span class="radio"></span><span><b>₦1,000</b><small>Quick recharge</small></span></button></div>
    <button class="full-btn" id="airtimeContinue">Continue — ₦1,000</button><p class="sheet-note">Payment will be made from your saved payment method.</p>
  `);
  const input = document.querySelector('#airtimeAmount'); const button = document.querySelector('#airtimeContinue');
  const update = () => button.textContent = `Continue — ${money(input.value || 0)}`;
  input.addEventListener('input', update);
  sheetContent.querySelectorAll('[data-amount]').forEach(option => option.addEventListener('click', () => { input.value = option.dataset.amount; sheetContent.querySelectorAll('[data-amount]').forEach(x => x.classList.remove('selected')); option.classList.add('selected'); update(); }));
  button.addEventListener('click', () => reviewPurchase({ name: 'Airtime recharge', price: Number(input.value || 0), validity: 'Instant' }));
}
function reviewPurchase(item) {
  if (!item.price) return showToast('Enter an amount to continue');
  openSheet(`<h2>Review purchase</h2><p class="sheet-intro">Please check the details before confirming.</p><button class="option"><span>◉</span><span><b>${item.name}</b><small>${item.validity} · Your MTM line</small></span><strong>${money(item.price)}</strong></button><button class="option"><span>◉</span><span><b>Saved payment method</b><small>MTM Wallet ·•••• 3004</small></span><strong>›</strong></button><button class="full-btn" id="confirmPurchase">Confirm & pay ${money(item.price)}</button><p class="sheet-note">By confirming, you agree to MTM's applicable service terms.</p>`);
  document.querySelector('#confirmPurchase').addEventListener('click', () => { closeSheet(); showToast(`${item.name} purchased successfully`); });
}
function transferSheet() {
  openSheet(`<h2>Transfer</h2><p class="sheet-intro">Share airtime or data with someone on MTM.</p><div class="segmented"><button class="selected">Airtime</button><button>Data</button></div><label class="field" for="recipient">Recipient's MTM number</label><input id="recipient" inputmode="tel" placeholder="0801 234 5678"><label class="field" for="transferAmount">Amount</label><input id="transferAmount" inputmode="numeric" placeholder="Enter amount"><div class="saved"><p class="sheet-intro">Saved beneficiaries</p><button class="option recipient" data-number="08011223344"><span class="radio"></span><span><b>Ada Bello</b><small>0801 122 3344</small></span></button></div><button class="full-btn" id="reviewTransfer">Review transfer</button>`);
  document.querySelector('.recipient').addEventListener('click', e => { document.querySelector('#recipient').value = e.currentTarget.dataset.number; });
  document.querySelector('#reviewTransfer').addEventListener('click', () => { const target = document.querySelector('#recipient').value; const amount = document.querySelector('#transferAmount').value; if (!target || !amount) return showToast('Enter a recipient and amount'); openSheet(`<h2>Transfer complete</h2><p class="sheet-intro">Your transfer to ${target} is ready to confirm.</p><button class="full-btn" id="confirmTransfer">Confirm ${money(amount)} transfer</button>`); document.querySelector('#confirmTransfer').addEventListener('click', () => { closeSheet(); showToast('Your airtime transfer was successful'); }); });
}
function simpleService(title, copy, action = 'Done') { openSheet(`<h2>${title}</h2><p class="sheet-intro">${copy}</p><button class="full-btn" id="simpleAction">${action}</button>`); document.querySelector('#simpleAction').addEventListener('click', () => { closeSheet(); showToast(`${title}: request received`); }); }

document.addEventListener('click', event => {
  const pageButton = event.target.closest('[data-page]'); if (pageButton) { selectPage(pageButton.dataset.page); return; }
  const bundle = event.target.closest('[data-bundle]'); if (bundle) { const data = { '5GB': ['5GB Anytime Data', 1500, '7 days'], '10GB': ['10GB SmartFlex', 2500, '30 days'], Night: ['2GB Night streaming', 250, '11PM–5AM'] }[bundle.dataset.bundle]; activeBundle = { name:data[0],price:data[1],validity:data[2] }; reviewPurchase(activeBundle); return; }
  const actionElement = event.target.closest('[data-action]'); if (!actionElement) return;
  const action = actionElement.dataset.action;
  const actions = {
    'buy-data': buyDataSheet, 'buy-airtime': buyAirtimeSheet, transfer: transferSheet,
    notifications: () => simpleService('Notifications', 'You have one new offer: enjoy +2GB with a 10GB weekend bundle.', 'Mark all as read'),
    profile: () => simpleService('Z’ello Murewa', 'Profile, security and notification settings are all in one place.', 'Open profile settings'),
    services: () => selectPage('more'), transactions: () => simpleService('Transaction history', 'Your full transaction history is available in the production experience. The latest transactions are shown on your dashboard.', 'Export statement'),
    roaming: () => simpleService('Roaming', 'Choose your destination to view available travel passes and activate roaming.', 'Choose destination'),
    rewards: () => simpleService('MTM Rewards', 'You have 1,240 points. You are 260 points away from your next reward.', 'Explore rewards'),
    support: () => openSheet(`<h2>Need help?</h2><p class="sheet-intro">Choose how you would like to get support.</p><div class="support-options"><button data-chat>Live chat<span>Typical reply in under 3 minutes</span></button><button data-chat>Report a network issue<span>Run a quick diagnostic for your location</span></button><button data-chat>Call MTM Care<span>Speak to our customer care team</span></button></div>`),
    chat: () => simpleService('Live chat', 'Our digital assistant is ready to help. A care agent will join when needed.', 'Start chat'),
    balance: () => buyDataSheet(), broadband: () => simpleService('Broadband services', 'View and manage your MTM Home Broadband plan.', 'Manage broadband'),
    sim: () => simpleService('SIM services', 'Replace, activate, or secure your SIM. Some actions may require identity verification.', 'View SIM options'),
    device: () => simpleService('Device management', 'Check devices linked to your MTM account and manage eSIMs.', 'Manage devices'),
    family: () => simpleService('Family & friends', 'Add people you care about and manage shared services.', 'Manage family'),
    voucher: () => simpleService('Recharge voucher', 'Enter your 12-digit MTM voucher code to recharge your line.', 'Enter voucher code'),
    cash: () => simpleService('Airtime to cash', 'Convert eligible airtime to cash safely. Service fees apply.', 'Check eligibility'),
    bills: () => simpleService('Bills & utilities', 'Pay electricity, TV, and other bills from one secure place.', 'Choose a biller'),
    entertainment: () => simpleService('Entertainment', 'Discover music, video, and sports packages made for your data plan.', 'Explore packages')
  };
  if (actions[action]) actions[action]();
});

document.querySelector('.sheet-close').addEventListener('click', closeSheet);
overlay.addEventListener('click', closeSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
document.querySelectorAll('.faq').forEach(button => button.addEventListener('click', () => button.classList.toggle('open')));

// Animate the visible wallet amount after the dashboard settles.
const balance = document.querySelector('#airtimeBalance');
setTimeout(() => { let current = 0, target = 1000000; const tick = () => { current += Math.ceil((target - current) / 8); balance.textContent = `₦ ${current.toLocaleString('en-NG')}.00`; if (current < target) requestAnimationFrame(tick); }; tick(); }, 250);