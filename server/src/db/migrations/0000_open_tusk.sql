CREATE TYPE "public"."role" AS ENUM('ADMIN', 'MODERATOR', 'MEMBER');--> statement-breakpoint
CREATE TABLE "server" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(225) NOT NULL,
	"admin" text NOT NULL,
	"icon" text,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "server_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serverId" uuid NOT NULL,
	"userId" text NOT NULL,
	"role" "role" DEFAULT 'MEMBER' NOT NULL,
	"joinedAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" varchar(225) NOT NULL,
	"email" varchar(225) NOT NULL,
	"avatar" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "server" ADD CONSTRAINT "server_admin_users_id_fk" FOREIGN KEY ("admin") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_member" ADD CONSTRAINT "server_member_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_member" ADD CONSTRAINT "server_member_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;