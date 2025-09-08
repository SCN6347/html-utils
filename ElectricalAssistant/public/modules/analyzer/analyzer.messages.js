window.Analyzer = window.Analyzer || {};

Analyzer.showMessage = function(root, type, text) {
  var existing = root.querySelector(".message");
  if (existing) existing.remove();

  var msg = document.createElement("div");
  msg.className = "message " + type;
  msg.innerHTML = '<span>' + text + '</span><button class="close-btn">&times;</button>';

  msg.querySelector(".close-btn").onclick = function() { msg.remove(); };
  root.prepend(msg);

  setTimeout(function() {
    if (!msg.parentNode) return;
    msg.classList.add("fade-out");
    msg.addEventListener("animationend", function() { msg.remove(); });
  }, 3000);
};
