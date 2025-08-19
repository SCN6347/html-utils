function initTableModal() {
  const modal = document.getElementById('tableModal');
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Insert Table</h3>
        <button class="close-modal">&times;</button>
      </div>
      <label>Rows: <input type="number" id="tableRows" value="3"></label>
      <label>Cols: <input type="number" id="tableCols" value="3"></label>
      <label>Border: <select id="tableBorder"><option value="1">Yes</option><option value="0">No</option></select></label>
      <div class="button-group">
        <button id="cancelTableBtn" class="secondary">Cancel</button>
        <button id="insertTableConfirmBtn" class="primary">Insert</button>
      </div>
    </div>
  `;

  document.getElementById('insertTableBtn').onclick = () => modal.style.display = 'block';
  modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
  document.getElementById('cancelTableBtn').onclick = () => modal.style.display = 'none';

  document.getElementById('insertTableConfirmBtn').onclick = () => {
    const rows = +document.getElementById('tableRows').value;
    const cols = +document.getElementById('tableCols').value;
    const border = +document.getElementById('tableBorder').value;
    let html = '<table style="border-collapse: collapse;" ' + (border ? 'border="1"' : '') + '>';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        html += `<td style="padding:5px;${border?'border:1px solid #ddd;':''}">&nbsp;</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    execCommand('insertHTML', html);
    modal.style.display = 'none';
  };
}
