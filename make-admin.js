const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function makeUserAdmin(email) {
  try {
    console.log(`Making user with email ${email} an admin...`)

    const user = await prisma.user.update({
      where: {
        email: email
      },
      data: {
        role: 'ADMIN'
      }
    })

    console.log(`✅ Success! User ${user.name || user.email} is now an admin.`)
    console.log(`User ID: ${user.id}`)
    console.log(`Role: ${user.role}`)

  } catch (error) {
    console.error('❌ Error updating user role:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Usage: node make-admin.js user@example.com
const email = process.argv[2]

if (!email) {
  console.log('Usage: node make-admin.js <email>')
  console.log('Example: node make-admin.js admin@example.com')
  process.exit(1)
}

makeUserAdmin(email)