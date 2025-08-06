-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "theme" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailPreferences" BOOLEAN NOT NULL DEFAULT true,
    "systemName" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "defaultCurrency" TEXT NOT NULL,
    "maxUsers" INTEGER NOT NULL
);
