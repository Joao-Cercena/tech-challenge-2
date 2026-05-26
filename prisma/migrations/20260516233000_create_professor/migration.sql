-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professor_username_key" ON "Professor"("username");

-- Seed default professor
INSERT INTO "Professor" ("name", "username", "password", "updatedAt")
VALUES ('Professor Padrão', 'professor', '123456', CURRENT_TIMESTAMP)
ON CONFLICT ("username") DO NOTHING;
