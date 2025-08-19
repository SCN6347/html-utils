function initToolbar() {
  const toolbar = document.getElementById('toolbar');
  toolbar.innerHTML = `
    <button id="boldBtn"><b>B</b></button>
    <button id="italicBtn"><i>I</i></button>
    <button id="underlineBtn"><u>U</u></button>
    <select id="headingSelect">
      <option value="">Paragraph</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
    </select>
    <button id="insertTableBtn">🗃 Table</button>
    <button id="insertShapeBtn">◇ Shape</button>
    <button id="insertListBtn">• List</button>
    <button id="insertOrderedListBtn">1. List</button>
    <button id="alignLeftBtn">≡</button>
    <button id="alignCenterBtn">≡</button>
    <button id="alignRightBtn">≡</button>
  `;

  document.getElementById('boldBtn').onclick = () => execCommand('bold');
  document.getElementById('italicBtn').onclick = () => execCommand('italic');
  document.getElementById('underlineBtn').onclick = () => execCommand('underline');
  document.getElementById('headingSelect').onchange = e => {
    const val = e.target.value;
    execCommand('formatBlock', val ? `<${val}>` : '<p>');
  };
  document.getElementById('insertListBtn').onclick = () => execCommand('insertUnorderedList');
  document.getElementById('insertOrderedListBtn').onclick = () => execCommand('insertOrderedList');
  document.getElementById('alignLeftBtn').onclick = () => execCommand('justifyLeft');
  document.getElementById('alignCenterBtn').onclick = () => execCommand('justifyCenter');
  document.getElementById('alignRightBtn').onclick = () => execCommand('justifyRight');
}
