import { db } from "./db";
import { usersTable } from "./db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  const users = [
    {
      email: "fauzanrizqinoor@gmail.com",
      full_name: "Rizqi Noor Fauzan",
      role: "mahasiswa" as const,
      nim: "12345678",
      status: "active",
    },
    {
      email: "rizqinoorf@gmail.com",
      full_name: "Fauzan AJA",
      role: "dosen" as const,
      nidn: "98765432",
      status: "active",
    },
    {
      email: "staff@campus.ac.id",
      full_name: "Pak Joko Staff",
      role: "staff" as const,
      status: "active",
    },
    {
      email: "inactive@campus.ac.id",
      full_name: "Andi Drop Out",
      role: "mahasiswa" as const,
      nim: "87654321",
      status: "inactive",
    },
  ];

  for (const user of users) {
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, user.email),
    });

    if (!existing) {
      await db.insert(usersTable).values(user);
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed();
