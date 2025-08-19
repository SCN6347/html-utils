function darkenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return `#${(
    0x1000000 +
    (R < 0 ? 0 : R) * 0x10000 +
    (G < 0 ? 0 : G) * 0x100 +
    (B < 0 ? 0 : B)
  ).toString(16).slice(1)}`;
}

function extractBodyContent(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.innerHTML;
}

function getFileName() {
  const now = new Date();
  const ts = `${now.getFullYear()}${(now.getMonth()+1)
    .toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours()
    .toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}`;
  return `document_${ts}.html`;
}
