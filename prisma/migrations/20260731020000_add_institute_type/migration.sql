-- Add the universal institute type to existing School records.
ALTER TABLE "School" ADD COLUMN "instituteType" "InstituteType" NOT NULL DEFAULT 'SCHOOL';
