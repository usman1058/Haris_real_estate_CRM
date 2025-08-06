/*
  Warnings:

  - You are about to alter the column `price` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL DEFAULT 0,
    "floors" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "description" TEXT NOT NULL DEFAULT '',
    "features" TEXT,
    "dealerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inventory_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Inventory" ("createdAt", "dealerId", "id", "location", "price", "size", "title", "type") SELECT "createdAt", "dealerId", "id", "location", "price", "size", "title", coalesce("type", '') AS "type" FROM "Inventory";
DROP TABLE "Inventory";
ALTER TABLE "new_Inventory" RENAME TO "Inventory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
