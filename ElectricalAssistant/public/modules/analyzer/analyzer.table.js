window.Analyzer = window.Analyzer || {};

Analyzer.renderTable = function(root) {
  var tbody = root.querySelector("#resultsTable tbody");
  tbody.innerHTML = "";

  if (!Analyzer.data.length) {
    tbody.innerHTML = '<tr><td colspan="7">No entries yet. Add a machine or source above.</td></tr>';
    return;
  }

  Analyzer.data.forEach(function(item, index) {
    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true" data-field="machine" data-index="${index}">${item.machine}</td>
      <td contenteditable="true" data-field="watt" data-index="${index}">${item.watt}</td>
      <td contenteditable="true" data-field="hours" data-index="${index}">${item.hours}</td>
      <td contenteditable="true" data-field="avgWh" data-index="${index}">${item.avgWh || "-"}</td>
      <td contenteditable="true" data-field="producer" data-index="${index}">${item.producer ? "Production" : "Consumption"}</td>
      <td>${item.totalWh}</td>
      <td><button class="delete-btn" data-index="${index}">🗑️</button></td>
    `;
    tbody.appendChild(tr);
  });

  Analyzer.attachRowHandlers(root);
  Analyzer.attachInlineEditHandlers(root);
};

Analyzer.attachRowHandlers = function(root) {
  var tbody = root.querySelector("#resultsTable tbody");
  tbody.querySelectorAll(".delete-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var idx = parseInt(btn.dataset.index, 10);
      Analyzer.removeEntry(idx);
      Analyzer.showMessage(root, "info", "Row removed.");
      Analyzer.renderAll(root);
    });
  });
};

Analyzer.attachInlineEditHandlers = function(root) {
  var tbody = root.querySelector("#resultsTable tbody");
  tbody.querySelectorAll("td[contenteditable=true]").forEach(function(cell) {
    var originalText = "";

    cell.addEventListener("focus", function() {
      originalText = cell.textContent.trim();
    });

    cell.addEventListener("keydown", function(e) {
      if (e.key === "Enter") { e.preventDefault(); cell.blur(); }
      if (e.key === "Escape") { e.preventDefault(); cell.textContent = originalText; cell.blur(); }
    });

    cell.addEventListener("blur", function() {
      var newText = cell.textContent.trim();
      if (newText === originalText) return;

      var idx = parseInt(cell.dataset.index, 10);
      var field = cell.dataset.field;
      var value = newText;

      if (field === "watt" || field === "hours" || field === "avgWh") {
        value = parseFloat(value);
        if (isNaN(value)) value = 0;
        Analyzer.data[idx][field] = value;
      } else if (field === "producer") {
        Analyzer.data[idx].producer = value.toLowerCase().startsWith("p");
      } else {
        Analyzer.data[idx][field] = value;
      }

      var item = Analyzer.data[idx];
      item.totalWh = item.avgWh > 0 ? item.avgWh : Math.round((item.watt || 0) * (item.hours || 0));

      Analyzer.showMessage(root, "success", "Updated " + field + " for " + item.machine);
      Analyzer.renderAll(root);
    });
  });
};
