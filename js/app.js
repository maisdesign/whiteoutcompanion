window.onload = () => {
  const container = document.querySelector(".container");
  const map = document.getElementById("map");
  const title = document.getElementById("title");
  const controls = document.getElementById("controls");
  const buffSummary = document.getElementById("buff-summary");
  const facilitySummary = document.getElementById("facility-summary");

  title.textContent = t("title");

  loadFacilityData();

  facilityData.forEach(fac => {
    const marker = createMarker(fac);
    map.appendChild(marker);
  });

  const exportBtn = document.createElement("button");
  exportBtn.textContent = t("exportCsv");
  exportBtn.onclick = exportToCSV;
  controls.appendChild(exportBtn);

  renderBuffSummary(buffSummary);
  renderFacilitySummary(facilitySummary);
};

function exportToCSV() {
  const csvRows = [
    ["Type", "Level", "X", "Y", "Alliance"]
  ];
  facilityData.forEach(f => {
    csvRows.push([f.type, f.level, f.x, f.y, f.alliance || ""]);
  });
  const blob = new Blob([csvRows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "facility_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function renderBuffSummary(container) {
  container.innerHTML = "<h2>" + t("buffSummary") + "</h2>";
  const table = document.createElement("table");
  const header = document.createElement("tr");
  header.innerHTML = "<th>Alliance</th><th>Total Buff</th>";
  table.appendChild(header);

  const buffMap = {};
  facilityData.forEach(f => {
    if (f.alliance) {
      const val = buffValues[f.type]?.[f.level] || 0;
      if (!buffMap[f.alliance]) buffMap[f.alliance] = 0;
      buffMap[f.alliance] += val;
    }
  });

  Object.entries(buffMap).forEach(([alliance, value]) => {
    const row = document.createElement("tr");
    row.innerHTML = "<td>" + alliance + "</td><td>" + value + "</td>";
    table.appendChild(row);
  });

  container.appendChild(table);
}

function renderFacilitySummary(container) {
  container.innerHTML = "<h2>" + t("facilitySummary") + "</h2>";
  const groups = {};

  facilityData.forEach(f => {
    if (!groups[f.alliance]) groups[f.alliance] = [];
    groups[f.alliance].push(f);
  });

  Object.keys(groups).forEach(alliance => {
    const section = document.createElement("div");
    section.className = "accordion";

    const header = document.createElement("button");
    header.className = "accordion-header";
    header.textContent = alliance || "Unassigned";
    header.onclick = () => {
      content.style.display = content.style.display === "none" ? "block" : "none";
    };

    const content = document.createElement("div");
    content.className = "accordion-content";
    content.style.display = "none";

    groups[alliance].forEach(f => {
      const p = document.createElement("p");
      p.textContent = f.type + " " + f.level + " (" + f.x + "," + f.y + ")";
      content.appendChild(p);
    });

    section.appendChild(header);
    section.appendChild(content);
    container.appendChild(section);
  });
}
