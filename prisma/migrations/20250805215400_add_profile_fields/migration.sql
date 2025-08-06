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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inventory_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Inventory" ("beds", "createdAt", "dealerId", "description", "features", "floors", "id", "images", "location", "price", "size", "status", "title", "type", "updatedAt") SELECT "beds", "createdAt", "dealerId", "description", "features", "floors", "id", "images", "location", "price", "size", "status", "title", "type", "updatedAt" FROM "Inventory";
DROP TABLE "Inventory";
ALTER TABLE "new_Inventory" RENAME TO "Inventory";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "bio" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" DATETIME
);
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "name", "password") SELECT "email", "emailVerified", "id", "image", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
