function initShapeModal() {
  const modal = document.getElementById('shapeModal');
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Insert Shape</h3>
        <button class="close-modal">&times;</button>
      </div>
      <label>Type: 
        <select id="shapeType">
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="triangle">Triangle</option>
        </select>
      </label>
      <label>Width: <input type="number" id="shapeWidth" value="100"></label>
      <label>Height: <input type="number" id="shapeHeight" value="100"></label>
      <label>Color: <input type="color" id="shapeColor" value="#3498db"></label>
      <div class="shape-preview" id="shapePreview"></div>
      <div class="button-group">
        <button id="cancelShapeBtn" class="secondary">Cancel</button>
        <button id="insertShapeConfirmBtn" class="primary">Insert</button>
      </div>
    </div>
  `;

  const shapePreview = modal.querySelector('#shapePreview');
  const typeEl = modal.querySelector('#shapeType');
  const wEl = modal.querySelector('#shapeWidth');
  const hEl = modal.querySelector('#shapeHeight');
  const cEl = modal.querySelector('#shapeColor');

  function updatePreview() {
    const type = typeEl.value, w = wEl.value, h = hEl.value, col = cEl.value;
    shapePreview.style = `width:${w}px;height:${h}px;background:${col}`;
    shapePreview.innerHTML = '';
    if (type === 'circle') shapePreview.style.borderRadius = '50%';
    if (type === 'triangle') {
      shapePreview.style.background = 'transparent';
      shapePreview.innerHTML = `<div style="width:100%;height:100%;background:${col};clip-path:polygon(50% 0%,0% 100%,100% 100%)"></div>`;
    }
  }
  [typeEl, wEl, hEl, cEl].forEach(el => el.oninput = updatePreview);
  updatePreview();

  document.getElementById('insertShapeBtn').onclick = () => { modal.style.display = 'block'; updatePreview(); };
  modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
  document.getElementById('cancelShapeBtn').onclick = () => modal.style.display = 'none';

  document.getElementById('insertShapeConfirmBtn').onclick = () => {
    const type = typeEl.value, w = wEl.value, h = hEl.value, col = cEl.value;
    let html = '';
    if (type === 'rectangle') html = `<div style="width:${w}px;height:${h}px;background:${col};border:1px solid ${darkenColor(col,20)};"></div>`;
    if (type === 'circle') html = `<div style="width:${w}px;height:${h}px;background:${col};border-radius:50%;border:1px solid ${darkenColor(col,20)};"></div>`;
    if (type === 'triangle') html = `<div style="width:${w}px;height:${h}px;"><div style="width:100%;height:100%;background:${col};clip-path:polygon(50% 0%,0% 100%,100% 100%)"></div></div>`;
    execCommand('insertHTML', html);
    modal.style.display = 'none';
  };
}
