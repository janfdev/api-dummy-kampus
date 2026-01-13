import express from "express";
import swaggerUi from "swagger-ui-express";
import { oauthRoutes } from "./routes/oauth.route";
import { swaggerSpec } from "./config/swagger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger UI
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Campus API Documentation",
  })
);

// Routes
app.use("/api", oauthRoutes);

app.get("/", (req, res) => {
  res.send("API Test Login Library Running...");
  res.redirect("/docs");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
