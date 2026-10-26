import express from "express";
import path from "path";
import { oauthRoutes } from "./routes/oauth.route";
import { swaggerSpec } from "./config/swagger";
import { getManageHtml } from "./views/manage";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all cross-origin requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Interactive SSO Directory Manager Web UI
app.get(["/manage", "/api/manage"], (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(getManageHtml());
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Serve Swagger UI static files from node_modules
app.use(
  "/swagger-ui",
  express.static(path.join(__dirname, "../node_modules/swagger-ui-dist")),
);

// Serve Swagger JSON
app.get("/docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(swaggerSpec);
});

// Serve Swagger UI HTML
app.get("/docs", (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Dummy Kampus - Documentation</title>
  <link rel="stylesheet" href="/swagger-ui/swagger-ui.css" />
  <style>
    body { margin: 0; padding: 0; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/swagger-ui/swagger-ui-bundle.js"></script>
  <script src="/swagger-ui/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/docs/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>`;
  res.send(html);
});

// Redirect / to /manage directory dashboard
app.get("/", (req, res) => {
  res.redirect("/manage");
});

// Routes
app.use("/api", oauthRoutes);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/docs`);
    console.log(`SSO Directory Manager available at http://localhost:${PORT}/manage`);
  });
}

export default app;
