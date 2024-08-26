// Helper function to populate the table with data
function populateTable(data) {
	let table = document.getElementById("editableTable");
	let headers = Object.keys(data[0]);
	let headerRow = table.querySelector("#headerRow");
	let body = table.querySelector("tbody");
	let select = document.getElementById("removeColumnSelect");

	// Clear existing table content
	headerRow.innerHTML = "";
	body.innerHTML = "";
	// Add headers
	headers.forEach((header) => {
		let th = document.createElement("th");
		th.textContent = header;
		th.setAttribute("contenteditable", "true");
		th.setAttribute("onclick", "editHeader(this)");
		headerRow.appendChild(th);
	});

	// Add rows
	data.forEach((rowData) => {
		let tr = document.createElement("tr");
		headers.forEach((header) => {
			let td = document.createElement("td");
			td.textContent = rowData[header] || "";
			td.setAttribute("contenteditable", "true");
			tr.appendChild(td);
		});
		// Add copy and remove buttons
		let buttonCell = document.createElement("td");
		const copyButton = document.createElement("button");
		copyButton.className = "btn btn-success";
		copyButton.innerText = "Copy";
		copyButton.onclick = function () {
			copyRow(this);
		};

		const removeButton = document.createElement("button");
		removeButton.className = "btn btn-danger";
		removeButton.innerText = "Remove";
		removeButton.onclick = function () {
			removeRow(this);
		};
		buttonCell.appendChild(copyButton);
		buttonCell.appendChild(removeButton);
		tr.appendChild(buttonCell);

		body.appendChild(tr);
	});

	// Update column select options
	updateColumnSelect();
	resetPreviewPane(document.getElementById("jsonDisplay"));
	resetPreviewPane(document.getElementById("uniqueValuesDisplay"));
}

// Function to add a new row
function addRow() {
	let table = document.getElementById("editableTable");
	let headerCells = table.querySelectorAll("#headerRow th").length;
	let newRow = document.createElement("tr");

	// Add new cells to the new row
	for (let i = 0; i < headerCells; i++) {
		let newCell = document.createElement("td");
		newCell.setAttribute("contenteditable", "true");
		newRow.appendChild(newCell);
	}
	// Add copy and remove buttons
	let buttonCell = document.createElement("td");
	const copyButton = document.createElement("button");
	copyButton.className = "btn btn-success";
	copyButton.innerText = "Copy";
	copyButton.onclick = function () {
		copyRow(this);
	};

	const removeButton = document.createElement("button");
	removeButton.className = "btn btn-danger";
	removeButton.innerText = "Remove";
	removeButton.onclick = function () {
		removeRow(this);
	};

	buttonCell.appendChild(copyButton);
	buttonCell.appendChild(removeButton);
	newRow.appendChild(buttonCell);

	table.querySelector("tbody").appendChild(newRow);
}

// Function to copy a row
function copyRow(button) {
	let row = button.parentElement.parentElement;
	let table = document.getElementById("editableTable");
	let headerCells = table.querySelectorAll("#headerRow th").length;
	let newRow = document.createElement("tr");

	// Copy each cell's content from the original row
	Array.from(row.children)
		.slice(0, -1)
		.forEach((cell) => {
			let newCell = document.createElement("td");
			newCell.textContent = cell.textContent;
			newCell.setAttribute("contenteditable", "true");
			newRow.appendChild(newCell);
		});

	// Add copy and remove buttons
	let buttonCell = document.createElement("td");
	const copyButton = document.createElement("button");
	copyButton.className = "btn btn-success";
	copyButton.innerText = "Copy";
	copyButton.onclick = function () {
		copyRow(this);
	};

	const removeButton = document.createElement("button");
	removeButton.className = "btn btn-danger";
	removeButton.innerText = "Remove";
	removeButton.onclick = function () {
		removeRow(this);
	};
	buttonCell.appendChild(copyButton);
	buttonCell.appendChild(removeButton);
	newRow.appendChild(buttonCell);

	table.querySelector("tbody").appendChild(newRow);
}

// Function to remove a row
function removeRow(button) {
	let row = button.parentElement.parentElement;
	row.remove();
}

function addColumn() {
	let table = document.getElementById("editableTable");
	let headerRow = table.querySelector("#headerRow");
	let rows = table.querySelectorAll("tbody tr");
	let numColumns = headerRow.querySelectorAll("th").length;

	// Add new header cell
	let newHeader = document.createElement("th");
	newHeader.setAttribute("contenteditable", "true");
	newHeader.setAttribute("onclick", "editHeader(this)");
	newHeader.textContent = `Column ${numColumns + 1}`;
	headerRow.appendChild(newHeader);

	// Add new cells to each row in tbody
	rows.forEach((row) => {
		let newCell = document.createElement("td");
		newCell.setAttribute("contenteditable", "true");
		row.insertBefore(newCell, row.lastElementChild); // Insert before the last cell (remove and copy buttons)
	});

	// Update column select options
	updateColumnSelect();
}

// Function to remove the selected column
function removeSelectedColumn() {
	let table = document.getElementById("editableTable");
	let headerRow = table.querySelector("#headerRow");
	let rows = table.querySelectorAll("tbody tr");
	let select = document.getElementById("removeColumnSelect");
	let selectedIndex = select.selectedIndex;
	console.log("Selected Index: " + selectedIndex);

	let colIndex = selectedIndex; // Adjust index for 0-based
	if (headerRow.children.length > 1) {
		let colIndex = selectedIndex; // Adjust index for 0-based

		// Remove header cell
		if (headerRow.children.length > 1) {
			headerRow.removeChild(headerRow.children[colIndex]);
		}

		// Remove cells from each row
		rows.forEach((row) => {
			if (row.children.length > 1) {
				row.removeChild(row.children[colIndex]);
			}
		});

		// Update column select options
		updateColumnSelect();
	}
}

// Function to handle header editing
function editHeader(header) {
	let currentText = header.textContent;
	let input = document.createElement("input");
	input.type = "text";
	input.value = currentText;
	input.className = "header-input";
	input.addEventListener("blur", function () {
		header.textContent = this.value;
		this.remove();
		updateColumnSelect(); // Update column select options after editing header
	});
	header.innerHTML = "";
	header.appendChild(input);
	input.focus();
}

// Function to update column select options
function updateColumnSelect() {
	populateUniqueColumnSelect(
		document.getElementById("removeColumnSelect")
	);
	populateUniqueColumnSelect(
		document.getElementById("uniqueColumnSelect")
	);
}

function populateUniqueColumnSelect(columnSelect) {
	const headers = Array.from(
		document.querySelectorAll("#headerRow th")
	).map((th) => th.textContent.trim());

	// Clear existing options
	columnSelect.innerHTML = "";

	// Add new options based on current headers
	headers.forEach((header, index) => {
		const option = document.createElement("option");
		option.value = index;
		option.textContent = header;
		columnSelect.appendChild(option);
	});
}
