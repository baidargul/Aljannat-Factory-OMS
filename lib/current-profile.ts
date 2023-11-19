import { auth } from "@clerk/nextjs";
import  prisma  from "@/lib/prisma"

const currentProfile = async () => {
    const {userId} = auth();
    if(!userId) return null;

    const profile = await prisma.profile.findFirst({
        where: {
            userId
        }
    });

  return profile;
};

export default currentProfile;