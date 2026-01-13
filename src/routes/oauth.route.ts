import { Router, Request, Response } from "express";
import {
  getAllUser,
  loginCampus,
  registerUser,
} from "../service/oauth.service";
const router = Router();

/**
 * @swagger
 * /oauth/login:
 *   post:
 *     summary: Login ke sistem kampus
 *     description: Endpoint untuk autentikasi user kampus berdasarkan email. Akan mengembalikan data user dan token jika berhasil.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email user yang terdaftar di sistem kampus
 *                 example: mahasiswa@campus.ac.id
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: campus_token_1_1234567890
 *       400:
 *         description: Email tidak diisi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email wajib diisi
 *       401:
 *         description: User tidak terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post("/oauth/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email wajib diisi" });
      return;
    }

    const result = await loginCampus(email);

    if (!result.success) {
      res.status(401).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /oauth/register:
 *   post:
 *     summary: Registrasi user baru
 *     description: Endpoint untuk mendaftarkan user baru ke sistem kampus. Email harus unik dan belum terdaftar sebelumnya.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email user yang akan didaftarkan
 *                 example: newuser@campus.ac.id
 *     responses:
 *       200:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User berhasil disimpan
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email tidak diisi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email sudah terdaftar
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/oauth/register", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email wajib diisi",
        data: null,
      });
    }

    const result = await registerUser(email);

    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "User berhasil disimpan",
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Dapatkan semua user
 *     description: Endpoint untuk mengambil daftar semua user yang terdaftar di sistem kampus
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Gagal mengambil data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User gagal didapatkan
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await getAllUser();

    if (!result.success) {
      res.status(401).json({
        success: false,
        message: result.message,
        data: null,
      });
    }

    res.status(200).json({ data: result.data });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
    });
  }
});

export const oauthRoutes = router;
