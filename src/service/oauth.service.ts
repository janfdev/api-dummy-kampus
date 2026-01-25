import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";

export const loginCampus = async (email: string) => {
  try {
    // Cari user berdasarkan email
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!user) {
      return {
        success: false,
        message: "User tidak terdaftar di sistem kampus",
        data: null,
      };
    }

    // Simulasi generate token (Di real app gunakan jwt/better-auth)
    const dummyToken = `campus_token_${user.id}_${Date.now()}`;

    // Return data user simulasi (tanpa password karena ini dummy data resource)
    return {
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          faculty: user.faculty,
          prodi: user.prodi,
          nim: user.nim,
          nidn: user.nidn,
          status: user.status,
        },
        token: dummyToken,
      },
    };
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error("Internal Server Error");
  }
};

export const registerUser = async (email: string) => {
  try {
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email sudah terdaftar",
        data: null,
      };
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        email: email as string,
        full_name: "",
        role: "mahasiswa",
        faculty: "",
        prodi: "",
        nim: "",
        nidn: "",
        status: "active",
      })
      .returning();

    return {
      success: true,
      message: "User berhasil disimpan",
      data: user,
    };
  } catch (err) {
    return {
      success: false,
      message: "User gagal disimpan",
      data: null,
    };
  }
};

export const getAllUser = async () => {
  try {
    const users = await db.query.usersTable.findMany();

    return {
      success: true,
      message: "User berhasil didapatkan",
      data: users,
    };
  } catch (err) {
    return {
      success: false,
      message: "User gagal didapatkan",
      data: null,
    };
  }
};
