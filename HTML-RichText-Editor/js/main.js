document.addEventListener('DOMContentLoaded', () => {
  initToolbar();
  initTableModal();
  initShapeModal();

  // Load HTML button + input
  const loadBtn = document.getElementById('loadBtn');
  const loadInput = document.getElementById('loadFileInput');

  loadBtn.onclick = () => loadInput.click();
  loadInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const doc = new DOMParser().parseFromString(text, "text/html");

      // Set title
      document.getElementById('docTitle').value = doc.querySelector("title")?.textContent || "";

      // Load body into editor
      richTextEditor.innerHTML = doc.body.innerHTML;
      updateHtmlAndPreview();
      showStatus("HTML file loaded into editor.", "success");
    };
    reader.readAsText(file);
  };

  // Paste
  document.getElementById('pasteBtn').onclick = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes('text/html')) {
          const html = await (await item.getType('text/html')).text();
          richTextEditor.innerHTML += extractBodyContent(html);
          updateHtmlAndPreview();
          showStatus('Rich text pasted!', 'success');
          return;
        }
      }
      const text = await navigator.clipboard.readText();
      richTextEditor.innerHTML += text;
      updateHtmlAndPreview();
      showStatus('Plain text pasted.', 'success');
    } catch {
      showStatus('Failed to read clipboard.', 'error');
    }
  };

  // Clear
  document.getElementById('clearBtn').onclick = () => {
    richTextEditor.innerHTML = '';
    htmlContent.value = '';
    preview.innerHTML = '';
    hideStatus();
  };

  // Generate HTML
  document.getElementById('generateBtn').onclick = () => {
    if (!richTextEditor.innerHTML.trim()) {
      showStatus('Please enter content first.', 'error');
      return;
    }

    const docTitle = document.getElementById('docTitle').value.trim() || "Generated Document";

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docTitle}</title>
  <style>
    body{font-family:Arial;margin:20px;}
    table{border-collapse:collapse;}
    td,th{border:1px solid #ddd;padding:8px;}
  </style>
</head>
<body>
${richTextEditor.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.replace(/\s+/g,'_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showStatus('HTML generated!', 'success');
  };

  // Copy HTML
  document.getElementById('copyHtmlBtn').onclick = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent.value);
      showStatus('Copied to clipboard!', 'success');
    } catch {
      showStatus('Copy failed.', 'error');
    }
  };
});
