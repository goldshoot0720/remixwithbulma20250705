-- CreateTable
CREATE TABLE "Udemy" (
    "id" SERIAL NOT NULL,
    "course" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,

    CONSTRAINT "Udemy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "saving" INTEGER NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Udemy_course_key" ON "Udemy"("course");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_name_key" ON "Bank"("name");
