window.Analyzer = window.Analyzer || {};

Analyzer.initEvents = function(root) {
  var addBtn = root.querySelector("#addBtn");
  var resetBtn = root.querySelector("#resetBtn");

  if (addBtn) {
    addBtn.onclick = function() {
      var machine = root.querySelector("#machineInput").value.trim();
      var watt = parseFloat(root.querySelector("#wattInput").value);
      var hours = parseFloat(root.querySelector("#hoursInput").value);
      var avgWh = parseFloat(root.querySelector("#avgInput").value);
      var producer = root.querySelector("#producerInput").checked;

      if (!machine) {
        Analyzer.showMessage(root, "error", "Enter Machine / Source");
        return;
      }

      var totalWh = !isNaN(avgWh) && avgWh > 0
        ? avgWh
        : Math.round((watt || 0) * (hours || 0));

      Analyzer.addEntry({
        machine: machine,
        watt: isNaN(watt) ? 0 : watt,
        hours: isNaN(hours) ? 0 : hours,
        avgWh: isNaN(avgWh) ? 0 : avgWh,
        producer: producer,
        totalWh: totalWh
      });

      Analyzer.showMessage(root, "success", "Added " + machine);
      Analyzer.renderAll(root);
    };
  }

  if (resetBtn) {
    resetBtn.onclick = function() {
      if (confirm("Clear all analyzer data?")) {
        Analyzer.data = [];
        Analyzer.showMessage(root, "info", "Data cleared.");
        Analyzer.renderAll(root);
      }
    };
  }

  var resizeTimer;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      Analyzer.renderAll(root);
    }, 150);
  });
};
