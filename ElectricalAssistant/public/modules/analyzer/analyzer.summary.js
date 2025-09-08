window.Analyzer = window.Analyzer || {};
Analyzer.lastNet = null;

Analyzer.renderSummary = function(root) {
  var summary = root.querySelector("#summary");
  var consumption = 0, production = 0;

  Analyzer.data.forEach(function(item) {
    if (item.producer) production += item.totalWh;
    else consumption += item.totalWh;
  });

  var net = production - consumption;
  var netClass = net >= 0 ? "net-positive" : "net-negative";
  var netIcon = net >= 0 ? "🔺" : "🔻";

  summary.innerHTML = `
    <ul class="summary-list">
      <li class="consumption"><strong>Total Consumption:</strong> ${consumption} Wh/day</li>
      <li class="production"><strong>Total Production:</strong> ${production} Wh/day</li>
      <li class="${netClass}"><strong>Net:</strong> ${netIcon} ${net} Wh/day</li>
    </ul>
  `;

  if (net !== Analyzer.lastNet) {
    var li = summary.querySelector("li." + netClass);
    li.classList.add("net-animate");
    li.addEventListener("animationend", function() {
      li.classList.remove("net-animate");
    }, { once: true });
  }
  Analyzer.lastNet = net;
};
