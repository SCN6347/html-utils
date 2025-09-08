window.Analyzer = window.Analyzer || {};

Analyzer.renderAll = function(root) {
  Analyzer.renderTable(root);
  Analyzer.renderSummary(root);
  Analyzer.renderCharts(root);
};

window.initAnalyzer = function(container) {
  var root = container || document;
  Analyzer.initEvents(root);
  Analyzer.renderAll(root);
};
