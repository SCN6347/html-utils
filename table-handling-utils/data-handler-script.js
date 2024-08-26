function generateJsonData() {
	let table = document.getElementById("editableTable");
	let headers = Array.from(table.querySelectorAll("#headerRow th")).map(
		(th) => th.textContent.trim()
	);
	let rows = Array.from(table.querySelectorAll("tbody tr"))
		.map((row) => {
			let cells = Array.from(row.querySelectorAll("td"));
			return headers.reduce((acc, header, i) => {
				if (i < cells.length - 1) {
					// Skip last cell (remove button)
					acc[header] = cells[i]
						? cells[i].textContent.trim()
						: "";
				}
				return acc;
			}, {});
		})
		.filter((row) =>
			Object.values(row).some((value) => value.trim() !== "")
		); // Skip empty rows

	return JSON.stringify(rows, null, 2); // Return JSON data as string
}

// Function to export table data as JSON
function exportToJson() {
	let jsonData = generateJsonData(); // Get JSON data
	let blob = new Blob([jsonData], {
		type: "application/json",
	});
	saveAs(blob, "table-data.json");
}

// Function to preview JSON data
function previewJson() {
	let jsonData = generateJsonData(); // Get JSON data
	document.getElementById("jsonDisplay").textContent = jsonData; // Display JSON data
}

// Function to display unique values for the selected column
function showUniqueValues() {
	const selectedColumnIndex =
		document.getElementById("uniqueColumnSelect").value;
	const tableRows = Array.from(
		document.querySelectorAll("#editableTable tbody tr")
	);

	if (selectedColumnIndex === "") {
		alert("Please select a column.");
		return;
	}

	// Gather unique values from the selected column
	const uniqueValues = new Set();

	tableRows.forEach((row) => {
		const cellValue =
			row.children[selectedColumnIndex]?.textContent.trim();
		if (cellValue !== "") {
			uniqueValues.add(cellValue);
		}
	});

	// Display unique values in the preview pane
	document.getElementById("uniqueValuesDisplay").textContent =
		Array.from(uniqueValues).join("\n") ||
		"No unique values found.";
}
