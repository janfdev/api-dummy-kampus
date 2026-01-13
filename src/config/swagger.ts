import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Test Login Library - Campus Authentication",
    version: "1.0.0",
    description:
      "API untuk simulasi sistem autentikasi kampus. API ini menyediakan endpoint untuk login, registrasi, dan manajemen user kampus (mahasiswa, dosen, staff).",
    contact: {
      name: "API Support",
      email: "support@campus.ac.id",
    },
  },
  servers: [
    {
      url: "https://api-dummy-oauth.vercel.app/api",
      description: "Production Server",
    },
    {
      url: "http://localhost:3000/api",
      description: "Development Server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "Endpoint untuk autentikasi kampus",
    },
    {
      name: "Users",
      description: "Endpoint untuk manajemen user",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID user (auto-generated)",
            example: 1,
          },
          email: {
            type: "string",
            format: "email",
            description: "Email user",
            example: "mahasiswa@campus.ac.id",
          },
          full_name: {
            type: "string",
            description: "Nama lengkap user",
            example: "John Doe",
          },
          role: {
            type: "string",
            enum: ["mahasiswa", "dosen", "staff"],
            description: "Role user di sistem kampus",
            example: "mahasiswa",
          },
          nim: {
            type: "string",
            description: "Nomor Induk Mahasiswa (untuk role mahasiswa)",
            example: "2021001",
            nullable: true,
          },
          nidn: {
            type: "string",
            description: "Nomor Induk Dosen Nasional (untuk role dosen)",
            example: "0123456789",
            nullable: true,
          },
          status: {
            type: "string",
            description: "Status user",
            example: "active",
          },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Operasi berhasil",
          },
          data: {
            type: "object",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Terjadi kesalahan",
          },
          data: {
            type: "null",
            example: null,
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "../routes/*.ts")], // Path ke file routes yang berisi JSDoc
};

export const swaggerSpec = swaggerJSDoc(options);
