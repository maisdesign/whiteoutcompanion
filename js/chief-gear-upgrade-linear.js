// chief-gear-upgrade-linear.js
let gearLevels = [];

const tierMap = {
  "Green": "Green (Uncommon)",
  "Blue": "Blue (Rare)",
  "Purple": "Purple (Epic)",
  "Purple T1": "Epic T1",
  "Gold": "Gold (Legendary)",
  "Gold T1": "Legendary T1",
  "Gold T2": "Legendary T2",
  "Red": "Mythic",
  "Red T1": "Mythic T1",
  "Red T2": "Mythic T2",
  "Red T3": "Mythic T3"
};

async function loadGearData() {
  const res = await fetch("js/chiefGearLevels_linear.json");
  gearLevels = await res.json();
  populateLevelSelectors();
}

function populateLevelSelectors() {
  document.querySelectorAll(".gear-card").forEach((card) => {
    const from = card.querySelector(".from");
    const to = card.querySelector(".to");
    gearLevels.forEach((lvl, i) => {
      const label = `${tierMap[lvl.tier] || lvl.tier} ☆${lvl.stars}`;
      from.appendChild(new Option(label, i + 1));
      to.appendChild(new Option(label, i + 1));
    });
  });
}

function calculateTotalUpgrade() {
  const total = {
    hardenedAlloy: 0,
    polishingSolution: 0,
    designPlans: 0,
    lunarAmber: 0,
    power: 0,
    statTotal: 0,
  };

  document.querySelectorAll(".gear-card").forEach((card) => {
    const from = parseInt(card.querySelector(".from").value);
    const to = parseInt(card.querySelector(".to").value);
    if (from >= to || isNaN(from) || isNaN(to)) return;

    for (let i = from; i < to; i++) {
      const lvl = gearLevels[i];
      total.hardenedAlloy += lvl.hardenedAlloy;
      total.polishingSolution += lvl.polishingSolution;
      total.designPlans += lvl.designPlans;
      total.lunarAmber += lvl.lunarAmber;
      total.power += lvl.power;
      total.statTotal = lvl.statTotal;
    }
  });

  document.getElementById("results").innerHTML = `
    <h2>Total Upgrade Cost</h2>
    <ul>
      <li><strong>Hardened Alloy:</strong> ${total.hardenedAlloy}</li>
      <li><strong>Polishing Solution:</strong> ${total.polishingSolution}</li>
      <li><strong>Design Plans:</strong> ${total.designPlans}</li>
      <li><strong>Lunar Amber:</strong> ${total.lunarAmber}</li>
      <li><strong>Power Gained:</strong> ${total.power.toLocaleString()}</li>
      <li><strong>Final Stat Total:</strong> ${total.statTotal.toFixed(2)}%</li>
    </ul>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  loadGearData();
  document.getElementById("calculateBtn").addEventListener("click", calculateTotalUpgrade);
});
