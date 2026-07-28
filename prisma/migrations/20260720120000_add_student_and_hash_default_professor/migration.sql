-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");

-- The initial migration created this development professor with a plaintext password.
-- Keep the account, but store only its bcrypt hash after this migration.
UPDATE "Professor"
SET "password" = '$2b$12$5F9P/3dKsDE3rUr49TqFs.WUloEF3xD2UEGazc9Pk8p1UpL38tYES'
WHERE "username" = 'professor' AND "password" = '123456';
