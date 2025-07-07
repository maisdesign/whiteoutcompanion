// chief-gear-upgrade.js
let gearLevels = [];

async function loadGearData() {
  const res = await fetch("js/chief_gear_stats_full.json");
  gearLevels = await res.json();
  populateAllSelectors();
}

function populateAllSelectors() {
  const tiers = [...new Set(gearLevels.map(e => e.tier))];
  const stars = [0, 1, 2, 3, 4];
  document.querySelectorAll('.gear-card').forEach(card => {
    card.querySelectorAll('.tier').forEach(select => {
      tiers.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        select.appendChild(opt);
      });
    });
    card.querySelectorAll('.star').forEach(select => {
      stars.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        select.appendChild(opt);
      });
    });
  });
}

function findGearIndex(tier, stars) {
  return gearLevels.findIndex(e => e.tier === tier && e.stars == stars);
}

function calculateUpgradeCost(fromTier, fromStars, toTier, toStars) {
  const fromIndex = findGearIndex(fromTier, fromStars);
  const toIndex = findGearIndex(toTier, toStars);
  if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null;
  const total = { hardenedAlloy: 0, polishingSolution: 0, designPlans: 0, lunarAmber: 0, power: 0, statTotal: 0 };
  for (let i = fromIndex + 1; i <= toIndex; i++) {
    const lvl = gearLevels[i];
    total.hardenedAlloy += lvl.hardenedAlloy;
    total.polishingSolution += lvl.polishingSolution;
    total.designPlans += lvl.designPlans;
    total.lunarAmber += lvl.lunarAmber;
    total.power += lvl.power;
    total.statTotal = lvl.statTotal; // override con l'ultima stat
  }
  return total;
}

function calculateAllUpgrades() {
  const result = { hardenedAlloy: 0, polishingSolution: 0, designPlans: 0, lunarAmber: 0, power: 0, statTotal: 0 };
  document.querySelectorAll('.gear-card').forEach(card => {
    const fromTier = card.querySelector('.tier.from').value;
    const fromStars = parseInt(card.querySelector('.star.from').value);
    const toTier = card.querySelector('.tier.to').value;
    const toStars = parseInt(card.querySelector('.star.to').value);
    const cost = calculateUpgradeCost(fromTier, fromStars, toTier, toStars);
    if (cost) {
      result.hardenedAlloy += cost.hardenedAlloy;
      result.polishingSolution += cost.polishingSolution;
      result.designPlans += cost.designPlans;
      result.lunarAmber += cost.lunarAmber;
      result.power += cost.power;
      result.statTotal += cost.statTotal;
    }
  });

  document.getElementById("results").innerHTML = `
    <h2>Total Upgrade Cost</h2>
    <ul>
      <li><strong>Hardened Alloy:</strong> ${result.hardenedAlloy}</li>
      <li><strong>Polishing Solution:</strong> ${result.polishingSolution}</li>
      <li><strong>Design Plans:</strong> ${result.designPlans}</li>
      <li><strong>Lunar Amber:</strong> ${result.lunarAmber}</li>
      <li><strong>Power Gained:</strong> ${result.power.toLocaleString()}</li>
      <li><strong>Final Stat Total:</strong> ${result.statTotal.toFixed(2)}%</li>
    </ul>
  `;
}

window.addEventListener("DOMContentLoaded", loadGearData);
