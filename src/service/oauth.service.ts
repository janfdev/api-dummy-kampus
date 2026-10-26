import { eq } from "drizzle-orm";
import { db } from "../db";
import { tokenTable, usersTable } from "../db/schema";

export interface UserPayload {
  email: string;
  full_name?: string;
  role?: "mahasiswa" | "dosen" | "staff";
  faculty?: string | null;
  prodi?: string | null;
  nim?: string | null;
  nidn?: string | null;
  status?: string;
}

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

export const upsertUser = async (payload: UserPayload) => {
  try {
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, payload.email),
    });

    const values = {
      email: payload.email,
      full_name: payload.full_name ?? (existingUser ? existingUser.full_name : ""),
      role: (payload.role ?? (existingUser ? existingUser.role : "mahasiswa")) as "mahasiswa" | "dosen" | "staff",
      faculty: payload.faculty !== undefined ? payload.faculty : (existingUser ? existingUser.faculty : null),
      prodi: payload.prodi !== undefined ? payload.prodi : (existingUser ? existingUser.prodi : null),
      nim: payload.nim !== undefined ? payload.nim : (existingUser ? existingUser.nim : null),
      nidn: payload.nidn !== undefined ? payload.nidn : (existingUser ? existingUser.nidn : null),
      status: payload.status ?? (existingUser ? existingUser.status : "active"),
    };

    if (existingUser) {
      const [updated] = await db
        .update(usersTable)
        .set(values)
        .where(eq(usersTable.id, existingUser.id))
        .returning();

      return {
        success: true,
        message: "User berhasil diperbarui",
        data: updated,
      };
    }

    const [created] = await db
      .insert(usersTable)
      .values(values)
      .returning();

    return {
      success: true,
      message: "User berhasil disimpan",
      data: created,
    };
  } catch (err: any) {
    console.error("Upsert User Error:", err);
    return {
      success: false,
      message: err.message || "User gagal disimpan",
      data: null,
    };
  }
};

export const registerUser = async (payloadOrEmail: string | UserPayload) => {
  if (typeof payloadOrEmail === "string") {
    return upsertUser({ email: payloadOrEmail });
  }
  return upsertUser(payloadOrEmail);
};

export const deleteUserByEmail = async (email: string) => {
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!user) {
      return {
        success: false,
        message: "User tidak ditemukan",
        data: null,
      };
    }

    // Bersihkan token jika ada
    await db.delete(tokenTable).where(eq(tokenTable.user_id, user.id));
    await db.delete(usersTable).where(eq(usersTable.id, user.id));

    return {
      success: true,
      message: "User berhasil dihapus",
      data: null,
    };
  } catch (err: any) {
    console.error("Delete User Error:", err);
    return {
      success: false,
      message: err.message || "User gagal dihapus",
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
