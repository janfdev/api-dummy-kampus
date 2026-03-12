CREATE TYPE "public"."role" AS ENUM('mahasiswa', 'dosen', 'staff');--> statement-breakpoint
CREATE TABLE "token" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "token_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"access_token" varchar(255) NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'mahasiswa' NOT NULL,
	"fakultas" varchar(255),
	"prodi" varchar(255),
	"nim" varchar(50),
	"nidn" varchar(50),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;