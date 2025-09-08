window.Analyzer = window.Analyzer || {};
Analyzer.pieChart = null;
Analyzer.barChart = null;

Analyzer.renderCharts = function(root) {
  var consumption = 0, production = 0;
  Analyzer.data.forEach(function(item) {
    if (item.producer) production += item.totalWh;
    else consumption += item.totalWh;
  });

  Analyzer.updatePie(root, consumption, production);
  Analyzer.updateBar(root);
};

Analyzer.updatePie = function(root, consumption, production) {
  var canvas = root.querySelector("#pieChart");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  if (Analyzer.pieChart) Analyzer.pieChart.destroy();

  Analyzer.pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Consumption", "Production"],
      datasets: [{
        data: [consumption, production],
        backgroundColor: ["rgba(217,132,74,0.9)", "rgba(76,175,80,0.9)"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#f0e9e2",
            font: { size: window.innerWidth < 600 ? 10 : 12 }
          }
        }
      }
    }
  });
};

Analyzer.updateBar = function(root) {
  var canvas = root.querySelector("#barChart");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  if (Analyzer.barChart) Analyzer.barChart.destroy();

  var sorted = [].concat(Analyzer.data).sort(function(a, b) { return b.totalWh - a.totalWh; });

  Analyzer.barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sorted.map(function(d) { return d.machine; }),
      datasets: [{
        label: "Wh/day",
        data: sorted.map(function(d) { return d.totalWh; }),
        backgroundColor: sorted.map(function(d) { return d.producer ? "rgba(76,175,80,0.85)" : "rgba(217,132,74,0.85)"; }),
        borderRadius: 6,
        barThickness: window.innerWidth < 600 ? 12 : 18
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#f0e9e2" } },
        y: { ticks: { color: "#f0e9e2" } }
      }
    }
  });
};
