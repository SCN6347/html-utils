window.Analyzer = window.Analyzer || {};
Analyzer.data = [];

Analyzer.addEntry = function(item) {
  Analyzer.data.push(item);
};

Analyzer.removeEntry = function(index) {
  Analyzer.data.splice(index, 1);
};
