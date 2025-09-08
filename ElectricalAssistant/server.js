// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Root where index.html lives
const ROOT = path.join(__dirname, "public");

// Serve everything inside /public
app.use(express.static(ROOT));

// Explicit MIME for modules
app.use("/modules", express.static(path.join(ROOT, "modules"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript");
    } else if (filePath.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css");
    } else if (filePath.endsWith(".html")) {
      res.setHeader("Content-Type", "text/html");
    }
  }
}));

// Fallback: always send index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(ROOT, "index.html"), (err) => {
    if (err) {
      console.error("⚠️ Could not send index.html:", err);
      res.status(500).send("Server error: index.html not found");
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📂 Serving root from: ${ROOT}`);
});
