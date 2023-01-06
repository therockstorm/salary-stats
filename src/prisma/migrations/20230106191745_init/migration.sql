-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "onContract" BOOLEAN NOT NULL DEFAULT false,
    "subDepartment" TEXT NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_key_key" ON "Application"("key");
