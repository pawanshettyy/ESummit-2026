// Example: Get branch for all users
const usersWithBranches = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    fullName: true,
    branch: true,
    college: true,
    yearOfStudy: true
  },
  where: {
    branch: {
      not: null // Only users who have a branch set
    }
  }
});

console.log('Users with branches:', usersWithBranches);

// Example: Get branch for a specific user by Clerk ID
const userBranch = await prisma.user.findUnique({
  where: { clerkUserId: 'user_clerk_id_here' },
  select: {
    branch: true,
    college: true,
    yearOfStudy: true
  }
});

console.log('User branch:', userBranch?.branch);