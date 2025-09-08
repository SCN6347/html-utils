function initHelper(container) {
  // Section 1: Sizing Tool
  const calcBtn = container.querySelector("#calcBtn");
  const sizingResults = container.querySelector("#sizingResults");

  if (calcBtn && sizingResults) {
    calcBtn.onclick = function() {
      const energyWh = parseFloat(container.querySelector('#energyWh').value);
      const sunHours = parseFloat(container.querySelector('#sunHours').value);
      const voltage = parseFloat(container.querySelector('#systemVoltage').value);
      const dod = parseFloat(container.querySelector('#dod').value || 80);
      const efficiency = parseFloat(container.querySelector('#efficiency').value || 85);

      if (isNaN(energyWh) || isNaN(sunHours) || isNaN(voltage)) {
        sizingResults.innerHTML = `<span style="color:#f88;">Please enter valid inputs.</span>`;
        return;
      }

      const batteryWh = energyWh / (efficiency / 100);
      const usableBatteryWh = batteryWh / (dod / 100);
      const batteryAh = usableBatteryWh / voltage;
      const panelW = energyWh / sunHours;

      sizingResults.innerHTML = `
        🔋 Required Battery Capacity: <b>${batteryAh.toFixed(1)} Ah</b> (${usableBatteryWh.toFixed(1)} Wh)<br>
        ☀️ Required Solar Panel Capacity: <b>${panelW.toFixed(1)} W</b>
      `;
    };
  }

  // Section 2: Wh ↔ Ah Conversion & Runtime Estimation
  const compareBtn = container.querySelector("#compareBtn");
  const comparisonResults = container.querySelector("#comparisonResults");

  if (compareBtn && comparisonResults) {
    compareBtn.onclick = function() {
      const capWhRaw = container.querySelector('#capacityWh').value;
      const capAhRaw = container.querySelector('#capacityAh').value;
      const voltageRaw = container.querySelector('#compareVoltage').value;
      const loadPowerRaw = container.querySelector('#loadPower').value;

      const capWh = capWhRaw !== "" ? parseFloat(capWhRaw) : null;
      const capAh = capAhRaw !== "" ? parseFloat(capAhRaw) : null;
      const voltage = voltageRaw !== "" ? parseFloat(voltageRaw) : null;
      const loadPower = loadPowerRaw !== "" ? parseFloat(loadPowerRaw) : null;

      // If both Wh and Ah are empty, abort
      if ((capWh === null || isNaN(capWh)) && (capAh === null || isNaN(capAh))) {
        comparisonResults.innerHTML = `<span style="color:#f88;">Please enter at least Wh or Ah value to proceed.</span>`;
        return;
      }

      // If Wh is given, validate
      let whValid = false;
      if (capWh !== null && !isNaN(capWh)) {
        whValid = true;
      }

      // If Ah is given, validate voltage
      let ahValid = false;
      if (capAh !== null && !isNaN(capAh)) {
        if (voltage === null || isNaN(voltage)) {
          comparisonResults.innerHTML = `<span style="color:#f88;">Please select voltage for Ah input.</span>`;
          return;
        }
        ahValid = true;
      }

      let result = "";

      // Show Wh if given
      if (whValid) {
        result += `🔌 Capacity 1: <b>${capWh} Wh</b><br>`;
      }

      // Show Ah if given
      if (ahValid) {
        const capAhToWh = capAh * voltage;
        result += `🔌 Capacity 2: <b>${capAhToWh.toFixed(1)} Wh</b> (from ${capAh} Ah @ ${voltage}V)<br>`;
      }

      // If only one is given, show only that
      if (!whValid && ahValid) {
        // Only Ah given
        // Already shown above
      } else if (whValid && !ahValid) {
        // Only Wh given
        // Already shown above
      }

      // If loadPower is given and at least one capacity is valid, show runtime
      if (loadPower !== null && !isNaN(loadPower) && loadPower > 0) {
        result += `⏱ Estimated Runtime for ${loadPower}W load:<br>`;
        if (whValid) {
          const runtime1 = capWh / loadPower;
          result += `- Capacity 1: <b>${runtime1.toFixed(2)} hours</b><br>`;
        }
        if (ahValid) {
          const runtime2 = (capAh * voltage) / loadPower;
          result += `- Capacity 2: <b>${runtime2.toFixed(2)} hours</b>`;
        }
      }

      if (!result) {
        result = `<span style="color:#f88;">No valid input to compute.</span>`;
      }

      comparisonResults.innerHTML = result;
    };
  }

  // Section 3: Helper Tool (Existing Functionality)
  const resultBox = container.querySelector("#helperResult");
  const inputWh = container.querySelector("#inputWh");
  const sunHoursHelper = container.querySelector("#sunHours");

  if (!calcBtn || !resultBox) {
    console.warn("Helper UI not fully loaded.");
    return;
  }

  calcBtn.onclick = () => {
    const wh = parseFloat(inputWh.value) || 0;
    const sun = parseFloat(sunHoursHelper.value) || 1;

    if (!wh) {
      resultBox.innerHTML = `<span style="color:#f88;">Please enter Wh requirement.</span>`;
      return;
    }

    // Example calculation: derive battery capacity and panel requirement
    const ah = (wh / 12).toFixed(1); // assuming 12V system
    const panelW = (wh / sun).toFixed(1);

    resultBox.innerHTML = `
      <strong>Calculated Results:</strong><br>
      Battery size ≈ <span class="highlight">${ah} Ah @12V</span><br>
      Panel size ≈ <span class="highlight">${panelW} W</span>
    `;
  };

  // ✅ If analyzer data exists, show summary table
  const dataBox = container.querySelector("#fromAnalyzer");
  if (dataBox) {
    const data = window.appContext.analyzerData;
    if (data.length === 0) {
      dataBox.innerHTML = `<em>No analyzer data available yet.</em>`;
    } else {
      let totalWh = 0;
      data.forEach(d => { totalWh += d.totalWh; });
      dataBox.innerHTML = `
        <strong>From Analyzer:</strong><br>
        ${data.length} entries, Total ≈ ${totalWh} Wh/day
      `;
    }
  }
}
