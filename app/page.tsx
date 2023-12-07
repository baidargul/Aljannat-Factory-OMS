import { initialProfile } from "@/lib/initial-profile"
import { redirectToSignIn } from "@clerk/nextjs";
import { Role, profile } from "@prisma/client";
import { redirect } from "next/navigation";
export default async function Home() {
  const profile: profile = await initialProfile();
  if (!profile) redirectToSignIn();
  if (profile.role === Role.UNVERIFIED) redirect(`/home/unverified/${profile.userId}`)
  if (profile.role === Role.ORDERVERIFIER) redirect(`/orders/verify`)
  if (profile.role === Role.PAYMENTVERIFIER) redirect(`/orders/verify`)

  return (
    <div className={`flex select-none gap-2 justify-center items-center min-h-screen p-4 cursor-default`}>
      <div className="">
        HomePage
      </div>
    </div>
  );
}
