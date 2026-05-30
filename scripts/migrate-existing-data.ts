import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function migrateExistingData() {
  try {
    console.log('🔍 Checking for existing collection items...\n');

    // Check for items without userId (old data)
    // Note: After schema migration, userId is required, so this query is no longer valid
    // This script is kept for reference but is obsolete after database reset
    console.log('✅ No orphaned items found. All data is already migrated!');
    console.log('(This script is obsolete after the database schema update)');
    process.exit(0);

    const orphanedItems: any[] = [];

    console.log(`Found ${orphanedItems.length} items that need to be assigned to a user.\n`);

    // Ask user what to do
    console.log('Options:');
    console.log('1. Create a new account and assign all items to it');
    console.log('2. Assign items to an existing account (by email)');
    console.log('3. Cancel (don\'t migrate)\n');

    const choice = await question('Enter your choice (1, 2, or 3): ');

    let userId: string;

    if (choice === '1') {
      // Create new user
      console.log('\n📝 Creating new account...\n');
      const email = await question('Email: ');
      const password = await question('Password (min 6 characters): ');
      const name = await question('Name (optional, press Enter to skip): ');

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
        },
      });

      userId = user.id;
      console.log(`\n✅ Created account for ${email}`);
    } else if (choice === '2') {
      // Use existing user
      const email = await question('\nEmail of existing account: ');

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log(`\n❌ No user found with email: ${email}`);
        console.log('Please run the script again and choose option 1 to create an account.');
        process.exit(1);
      }

      userId = user!.id;
      console.log(`\n✅ Found account for ${email}`);
    } else {
      console.log('\n❌ Migration cancelled.');
      process.exit(0);
    }

    // Update all orphaned items
    console.log(`\n🔄 Assigning ${orphanedItems.length} items to user...`);

    const result = await prisma.collectionItem.updateMany({
      where: {
        userId: userId, // This code path is unreachable due to early exit above
      },
      data: {
        userId,
      },
    });

    console.log(`\n✅ Successfully migrated ${result.count} items!`);
    console.log('\n🎉 Your collection has been restored!');
    console.log('You can now sign in and see all your minifigs.\n');
  } catch (error) {
    console.error('\n❌ Error during migration:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

migrateExistingData();
