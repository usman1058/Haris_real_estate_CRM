/*
  Warnings:

  - You are about to alter the column `images` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - Added the required column `updatedAt` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "size" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL DEFAULT 0,
    "floors" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "description" TEXT,
    "features" TEXT,
    "images" JSONB,
    "dealerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inventory_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Inventory" ("beds", "createdAt", "dealerId", "description", "features", "floors", "id", "images", "location", "price", "size", "status", "title", "type") SELECT "beds", "createdAt", "dealerId", "description", "features", "floors", "id", "images", "location", "price", "size", "status", "title", "type" FROM "Inventory";
DROP TABLE "Inventory";
ALTER TABLE "new_Inventory" RENAME TO "Inventory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
