let total = { guides: 0, designs: 0, secrets: 0 };

// chiefcharms.js

const charmData = [
  { level: 1, guides: 5, designs: 5, secrets: 0 },
  { level: 2, guides: 40, designs: 15, secrets: 0 },
  { level: 3, guides: 60, designs: 40, secrets: 0 },
  { level: 4, guides: 80, designs: 100, secrets: 0 },
  { level: 5, guides: 100, designs: 200, secrets: 0 },
  { level: 6, guides: 120, designs: 300, secrets: 0 },
  { level: 7, guides: 140, designs: 400, secrets: 0 },
  { level: 8, guides: 200, designs: 400, secrets: 0 },
  { level: 9, guides: 300, designs: 400, secrets: 0 },
  { level: 10, guides: 420, designs: 420, secrets: 0 },
  { level: 11, guides: 560, designs: 420, secrets: 0 },
  { level: 12, guides: 580, designs: 450, secrets: 15 },
  { level: 13, guides: 580, designs: 450, secrets: 30 },
  { level: 14, guides: 600, designs: 500, secrets: 45 },
  { level: 15, guides: 600, designs: 500, secrets: 70 },
  { level: 16, guides: 650, designs: 550, secrets: 100 },
];

const categories = ["Helmet", "Chestplate", "Ring", "Watch", "Pants", "Staff"];
let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
  if (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  return key;
}

function createCharmRow(categoryIndex, slotIndex) {
  const fromSel = document.createElement('select');
  const toSel = document.createElement('select');
  const result = document.createElement('span');

  fromSel.id = `from-${categoryIndex}-${slotIndex}`;
  toSel.id = `to-${categoryIndex}-${slotIndex}`;
  result.id = `result-${categoryIndex}-${slotIndex}`;

  for (let i = 1; i <= 16; i++) {
    fromSel.appendChild(new Option(i, i));
    toSel.appendChild(new Option(i, i));
  }

  const savedFrom = parseInt(localStorage.getItem(fromSel.id)) || 1;
  const savedTo = parseInt(localStorage.getItem(toSel.id)) || 1;
  fromSel.value = savedFrom;
  toSel.value = savedTo;

  fromSel.addEventListener('change', calculate);
  toSel.addEventListener('change', calculate);

  const wrapper = document.createElement('div');
  wrapper.className = 'charm-slot';
  wrapper.appendChild(fromSel);
  wrapper.appendChild(toSel);
  wrapper.appendChild(result);

  return wrapper;
}

function createCategoryBlock(name, categoryIndex) {
  const wrapper = document.createElement('div');
  wrapper.className = 'category-block';

  const title = document.createElement('h2');
  title.textContent = t(name);
  wrapper.appendChild(title);

  const controls = document.createElement('div');
  controls.className = 'bulk-set';
  controls.innerHTML = `
    <span>${t('Set All Slots')}</span>
    <select id="bulk-from-${categoryIndex}">${Array.from({length: 16}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}</select>
    <select id="bulk-to-${categoryIndex}">${Array.from({length: 16}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}</select>
    <button data-i18n="set_all" onclick="setAll(${categoryIndex})">Set All</button>
  `;
  wrapper.appendChild(controls);

  for (let i = 0; i < 3; i++) {
    const row = createCharmRow(categoryIndex, i);
    wrapper.appendChild(row);
  }

  return wrapper;
}

function setAll(categoryIndex) {
  const fromVal = document.getElementById(`bulk-from-${categoryIndex}`).value;
  const toVal = document.getElementById(`bulk-to-${categoryIndex}`).value;
  for (let i = 0; i < 3; i++) {
    document.getElementById(`from-${categoryIndex}-${i}`).value = fromVal;
    document.getElementById(`to-${categoryIndex}-${i}`).value = toVal;
  }
  calculate();
}

function calculate() {
  let totalG = 0, totalD = 0, totalS = 0;
  for (let c = 0; c < categories.length; c++) {
    for (let s = 0; s < 3; s++) {
      const fromEl = document.getElementById(`from-${c}-${s}`);
      const toEl = document.getElementById(`to-${c}-${s}`);
      if (!fromEl || !toEl) continue;
      const from = parseInt(fromEl.value);
      const to = parseInt(toEl.value);

      localStorage.setItem(fromEl.id, from);
      localStorage.setItem(toEl.id, to);

      let g = 0, d = 0, sct = 0;
      for (let lvl = from; lvl <= to; lvl++) {
        const data = charmData[lvl - 1];
        g += data.guides;
        d += data.designs;
        sct += data.secrets;
      }
      totalG += g;
      totalD += d;
      totalS += sct;
      document.getElementById(`result-${c}-${s}`).textContent = `${g}/${d}/${sct}`;
    }
  }
  total = { guides: totalG, designs: totalD, secrets: totalS };
  document.getElementById('summary').textContent = `${t('Total')}: ${totalG} ${t('Charm Guides')}, ${totalD} ${t('Charm Designs')}, ${totalS} ${t('Jewel Secrets')}`;
}

function init() {
  const container = document.getElementById('charm-container');
  categories.forEach((cat, idx) => {
    container.appendChild(createCategoryBlock(cat, idx));
  });

  document.getElementById('resetAll').addEventListener('click', () => {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('from-') || k.startsWith('to-')) {
        localStorage.removeItem(k);
      }
    });
    location.reload();
  });

  calculate();
}

document.addEventListener('DOMContentLoaded', init);

// Calcolo se upgrade è possibile
document.getElementById("compareResources").addEventListener("click", function() {
  const ownedGuides = parseInt(document.getElementById("owned-guides").value) || 0;
  const ownedDesigns = parseInt(document.getElementById("owned-designs").value) || 0;
  const ownedSecrets = parseInt(document.getElementById("owned-secrets").value) || 0;

  const neededGuides = total.guides;
  const neededDesigns = total.designs;
  const neededSecrets = total.secrets;

  const diffGuides = ownedGuides - neededGuides;
  const diffDesigns = ownedDesigns - neededDesigns;
  const diffSecrets = ownedSecrets - neededSecrets;

  const resultDiv = document.getElementById("resource-result");
  resultDiv.innerHTML = `
    <p style="color:${diffGuides >= 0 ? 'green' : 'red'}">
      ${t('guides')}: ${ownedGuides} / ${neededGuides} 
      (${diffGuides >= 0 ? '✔ ' + t('enough') : `${-diffGuides} ` + t('missing')})
    </p>
    <p style="color:${diffDesigns >= 0 ? 'green' : 'red'}">
      ${t('designs')}: ${ownedDesigns} / ${neededDesigns} 
      (${diffDesigns >= 0 ? '✔ ' + t('enough') : `${-diffDesigns} ` + t('missing')})
    </p>
    <p style="color:${diffSecrets >= 0 ? 'green' : 'red'}">
      ${t('secrets')}: ${ownedSecrets} / ${neededSecrets} 
      (${diffSecrets >= 0 ? '✔ ' + t('enough') : `${-diffSecrets} ` + t('missing')})
    </p>
  `;
});
