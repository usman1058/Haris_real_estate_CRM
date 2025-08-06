/*
  Warnings:

  - You are about to drop the column `properties` on the `Dealer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Demand" ADD COLUMN "clientName" TEXT;
ALTER TABLE "Demand" ADD COLUMN "clientPhone" TEXT;
ALTER TABLE "Demand" ADD COLUMN "type" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dealer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Dealer" ("id", "name") SELECT "id", "name" FROM "Dealer";
DROP TABLE "Dealer";
ALTER TABLE "new_Dealer" RENAME TO "Dealer";
CREATE TABLE "new_Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "type" TEXT,
    "dealerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inventory_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Inventory" ("createdAt", "id", "location", "price", "size", "title") SELECT "createdAt", "id", "location", "price", "size", "title" FROM "Inventory";
DROP TABLE "Inventory";
ALTER TABLE "new_Inventory" RENAME TO "Inventory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
