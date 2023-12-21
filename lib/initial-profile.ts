import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function initialProfile() {
  try {
    const user = await currentUser();
    if (!user) return redirectToSignIn();

    let profile

    profile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profile) {
      return profile;
    }

    const check = await prisma.profile.findMany({})
    if (check.length === 0) {
      const newProfile = await prisma.profile.create({
        data: {
          userId: user.id,
          name: user.firstName + " " + user.lastName,
          imageURL: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
          role: Role.ADMIN
        },
      });
      return newProfile;
    }

    const newProfile = await prisma.profile.create({
      data: {
        userId: user.id,
        name: user.firstName + " " + user.lastName,
        imageURL: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (error) {
    console.error(error);
    redirectToSignIn();
  }
}