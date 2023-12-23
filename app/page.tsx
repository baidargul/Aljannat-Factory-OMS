import { initialProfile } from "@/lib/initial-profile"
import { redirectToSignIn } from "@clerk/nextjs";
import { Role, profile } from "@prisma/client";
import { redirect } from "next/navigation";
import Stats from "./index-components/Page/components/Stats";
export default async function Home() {
  const profile: profile = await initialProfile();
  if (!profile) redirectToSignIn();
  if (profile.role === Role.UNVERIFIED) redirect(`/home/unverified/${profile.userId}`)
  if (profile.role === Role.ORDERVERIFIER) redirect(`/orders/verify`)
  if (profile.role === Role.PAYMENTVERIFIER) redirect(`/orders/verify`)

  return (
    <div className={`flex select-none gap-2 justify-center items-center p-4 cursor-default`}>
      <div className="">
        <Stats />
      </div>
    </div>
  );
}