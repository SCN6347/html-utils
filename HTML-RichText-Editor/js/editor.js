const richTextEditor = document.getElementById('richTextEditor');
const htmlContent = document.getElementById('htmlContent');
const preview = document.getElementById('preview');
const editorStatus = document.getElementById('editorStatus');

function updateHtmlAndPreview() {
  htmlContent.value = richTextEditor.innerHTML;
  preview.innerHTML = richTextEditor.innerHTML;
  hideStatus();
}

function showStatus(message, type) {
  editorStatus.textContent = message;
  editorStatus.className = 'status ' + type;
}

function hideStatus() {
  editorStatus.className = 'status';
  editorStatus.textContent = '';
}

function execCommand(command, value = null) {
  document.execCommand(command, false, value);
  richTextEditor.focus();
  updateHtmlAndPreview();
}

richTextEditor.addEventListener('input', updateHtmlAndPreview);
