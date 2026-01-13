import swaggerJSDoc from "swagger-jsdoc";

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
  paths: {
    "/oauth/login": {
      post: {
        summary: "Login ke sistem kampus",
        description:
          "Endpoint untuk autentikasi user kampus berdasarkan email. Akan mengembalikan data user dan token jika berhasil.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    description: "Email user yang terdaftar di sistem kampus",
                    example: "mahasiswa@campus.ac.id",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login berhasil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Login berhasil",
                    },
                    data: {
                      type: "object",
                      properties: {
                        user: {
                          $ref: "#/components/schemas/User",
                        },
                        token: {
                          type: "string",
                          example: "campus_token_1_1234567890",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Email tidak diisi",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email wajib diisi",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "User tidak terdaftar",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Internal Server Error",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/oauth/register": {
      post: {
        summary: "Registrasi user baru",
        description:
          "Endpoint untuk mendaftarkan user baru ke sistem kampus. Email harus unik dan belum terdaftar sebelumnya.",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    description: "Email user yang akan didaftarkan",
                    example: "newuser@campus.ac.id",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Registrasi berhasil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "User berhasil disimpan",
                    },
                    data: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Email tidak diisi",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Email sudah terdaftar",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    message: {
                      type: "string",
                      example: "Email sudah terdaftar",
                    },
                    data: {
                      type: "null",
                      example: null,
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        summary: "Dapatkan semua user",
        description:
          "Endpoint untuk mengambil daftar semua user yang terdaftar di sistem kampus",
        tags: ["Users"],
        responses: {
          200: {
            description: "Berhasil mengambil data user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Gagal mengambil data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: false,
                    },
                    message: {
                      type: "string",
                      example: "User gagal didapatkan",
                    },
                    data: {
                      type: "null",
                      example: null,
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Internal server error",
                    },
                    data: {
                      type: "null",
                      example: null,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
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
  apis: [], // Tidak perlu scan file karena sudah didefinisikan manual di paths
};

export const swaggerSpec = swaggerJSDoc(options);
