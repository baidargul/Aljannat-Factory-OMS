import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import prisma  from "@/lib/prisma";

export async function initialProfile() {
  try {
    const user = await currentUser();
    if (!user) return redirectToSignIn();

    const profile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profile) {
      return profile;
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