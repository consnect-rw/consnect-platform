-- CreateTable
CREATE TABLE "CompanySpecialization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CompanySpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_company_specialization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_company_specialization_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_company_specialization_B_index" ON "_company_specialization"("B");

-- AddForeignKey
ALTER TABLE "CompanySpecialization" ADD CONSTRAINT "CompanySpecialization_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_company_specialization" ADD CONSTRAINT "_company_specialization_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_company_specialization" ADD CONSTRAINT "_company_specialization_B_fkey" FOREIGN KEY ("B") REFERENCES "CompanySpecialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
