import { PrismaClient } from "@prisma/client";

import { hash } from "@/lib/crypto";

const prisma = new PrismaClient();

const agentData = [
  {
    name: "Abhishek",
    salary: "145000",
    currency: "USD",
    department: "Engineering",
    subDepartment: "Platform",
  },
  {
    name: "Anurag",
    salary: "90000",
    currency: "USD",
    department: "Banking",
    onContract: true,
    subDepartment: "Loan",
  },
  {
    name: "Himani",
    salary: "240000",
    currency: "USD",
    department: "Engineering",
    subDepartment: "Platform",
  },
  {
    name: "Yatendra",
    salary: "30",
    currency: "USD",
    department: "Operations",
    subDepartment: "CustomerOnboarding",
  },
  {
    name: "Ragini",
    salary: "30",
    currency: "USD",
    department: "Engineering",
    subDepartment: "Platform",
  },
  {
    name: "Nikhil",
    salary: "110000",
    currency: "USD",
    onContract: true,
    department: "Engineering",
    subDepartment: "Platform",
  },
  {
    name: "Guljit",
    salary: "30",
    currency: "USD",
    department: "Administration",
    subDepartment: "Agriculture",
  },
  {
    name: "Himanshu",
    salary: "70000",
    currency: "EUR",
    department: "Operations",
    subDepartment: "CustomerOnboarding",
  },
  {
    name: "Anupam",
    salary: "200000000",
    currency: "INR",
    department: "Engineering",
    subDepartment: "Platform",
  },
];

async function main() {
  console.log("Seeding database...");

  const secret = await hash("secret");
  await prisma.application.create({ data: { key: "clipboard", secret } });

  await Promise.all(agentData.map((data) => prisma.agent.create({ data })));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
