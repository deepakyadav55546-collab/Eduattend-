ALTER TABLE "Fee" ADD COLUMN "currencyCode" TEXT NOT NULL DEFAULT 'INR';
ALTER TABLE "FeePayment" ADD COLUMN "currencyCode" TEXT NOT NULL DEFAULT 'INR';
UPDATE "FeePayment" p SET "currencyCode" = f."currencyCode" FROM "Fee" f WHERE p."feeId" = f."id";
