import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["mahasiswa", "dosen", "staff"]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("mahasiswa"),
  faculty: varchar("fakultas", { length: 255 }),
  prodi: varchar("prodi", { length: 255 }),
  nim: varchar("nim", { length: 50 }),
  nidn: varchar("nidn", { length: 50 }),
  status: varchar("status", { length: 50 }).notNull().default("active"),
});

export const tokenTable = pgTable("token", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  access_token: varchar("access_token", { length: 255 }).notNull(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id),
});
