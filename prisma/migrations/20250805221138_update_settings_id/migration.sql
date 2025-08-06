-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "theme" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL,
    "emailPreferences" BOOLEAN NOT NULL,
    "systemName" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "defaultCurrency" TEXT NOT NULL,
    "maxUsers" INTEGER NOT NULL
);
INSERT INTO "new_Settings" ("apiKey", "defaultCurrency", "emailPreferences", "id", "maxUsers", "notificationsEnabled", "systemName", "theme") SELECT "apiKey", "defaultCurrency", "emailPreferences", "id", "maxUsers", "notificationsEnabled", "systemName", "theme" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
