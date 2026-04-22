CREATE TABLE "household" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "nutria_user" (
	"id" text PRIMARY KEY NOT NULL,
	"household_id" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nutria_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "app_setting" (
	"household_id" text NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "app_setting_household_id_key_pk" PRIMARY KEY("household_id","key")
);
--> statement-breakpoint
CREATE TABLE "consumption_log" (
	"id" text PRIMARY KEY NOT NULL,
	"prep_item_id" text NOT NULL,
	"person_id" text NOT NULL,
	"grams" real NOT NULL,
	"logged_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grocery_item" (
	"id" text PRIMARY KEY NOT NULL,
	"household_id" text NOT NULL,
	"week_start" text NOT NULL,
	"name" text NOT NULL,
	"section" text NOT NULL,
	"qty_text" text,
	"price_idr_per_unit" real,
	"checked" boolean DEFAULT false NOT NULL,
	"source" text DEFAULT 'manual'
);
--> statement-breakpoint
CREATE TABLE "meal_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"household_id" text NOT NULL,
	"week_start" text NOT NULL,
	"day_index" integer NOT NULL,
	"slot" text NOT NULL,
	"person_id" text NOT NULL,
	"title" text NOT NULL,
	"is_fresh" boolean DEFAULT true NOT NULL,
	"prep_item_id" text,
	"notes" text,
	"kcal" real,
	"protein_g" real,
	"carbs_g" real,
	"fat_g" real,
	"fiber_g" real,
	"iron_mg" real,
	"calcium_mg" real
);
--> statement-breakpoint
CREATE TABLE "pantry_item" (
	"id" text PRIMARY KEY NOT NULL,
	"household_id" text NOT NULL,
	"name" text NOT NULL,
	"section" text NOT NULL,
	"qty_guess" real,
	"unit_note" text,
	"price_idr_per_unit" real
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" text PRIMARY KEY NOT NULL,
	"household_id" text NOT NULL,
	"display_name" text NOT NULL,
	"role" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prep_item" (
	"id" text PRIMARY KEY NOT NULL,
	"prep_run_id" text NOT NULL,
	"name" text NOT NULL,
	"total_cooked_grams" real NOT NULL,
	"remaining_grams" real NOT NULL,
	"cook_yield_pct" real DEFAULT 27.5 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prep_run" (
	"id" text PRIMARY KEY NOT NULL,
	"household_id" text NOT NULL,
	"name" text NOT NULL,
	"started_at" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prep_session" (
	"id" text PRIMARY KEY NOT NULL,
	"household_id" text NOT NULL,
	"prep_run_id" text,
	"started_at" text NOT NULL,
	"ended_at" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "prep_session_ingredient" (
	"id" text PRIMARY KEY NOT NULL,
	"prep_session_id" text NOT NULL,
	"name" text NOT NULL,
	"raw_kg" real DEFAULT 0 NOT NULL,
	"shrink_pct" real DEFAULT 27.5 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prep_session_step" (
	"id" text PRIMARY KEY NOT NULL,
	"prep_session_id" text NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_nutria_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nutria_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutria_user" ADD CONSTRAINT "nutria_user_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_setting" ADD CONSTRAINT "app_setting_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumption_log" ADD CONSTRAINT "consumption_log_prep_item_id_prep_item_id_fk" FOREIGN KEY ("prep_item_id") REFERENCES "public"."prep_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consumption_log" ADD CONSTRAINT "consumption_log_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grocery_item" ADD CONSTRAINT "grocery_item_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_entry" ADD CONSTRAINT "meal_entry_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_entry" ADD CONSTRAINT "meal_entry_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_entry" ADD CONSTRAINT "meal_entry_prep_item_id_prep_item_id_fk" FOREIGN KEY ("prep_item_id") REFERENCES "public"."prep_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pantry_item" ADD CONSTRAINT "pantry_item_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_item" ADD CONSTRAINT "prep_item_prep_run_id_prep_run_id_fk" FOREIGN KEY ("prep_run_id") REFERENCES "public"."prep_run"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_run" ADD CONSTRAINT "prep_run_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_session" ADD CONSTRAINT "prep_session_household_id_household_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."household"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_session" ADD CONSTRAINT "prep_session_prep_run_id_prep_run_id_fk" FOREIGN KEY ("prep_run_id") REFERENCES "public"."prep_run"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_session_ingredient" ADD CONSTRAINT "prep_session_ingredient_prep_session_id_prep_session_id_fk" FOREIGN KEY ("prep_session_id") REFERENCES "public"."prep_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prep_session_step" ADD CONSTRAINT "prep_session_step_prep_session_id_prep_session_id_fk" FOREIGN KEY ("prep_session_id") REFERENCES "public"."prep_session"("id") ON DELETE cascade ON UPDATE no action;