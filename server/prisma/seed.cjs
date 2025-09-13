// prisma/seed.cjs
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Optionally seed base data
  console.log('Seeding: creating demo user')
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: 'demo',
      password: '$2a$10$P6pd9E7xgIu0n3T3iQp3oOhzv6Q4SxV9iS8G42mDk7vM1b3kF2JrK' // 'password' bcrypt
    }
  })
  console.log('Seed complete')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
