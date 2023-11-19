import UploadButton from "@/components/File/UploadButton"
import GenericGrid from "@/components/Grid/GenericGrid";
import prisma from "@/lib/prisma"
import { initialProfile } from "@/lib/initial-profile"
export default async function Home() {

  const orders = await getOrders()
  const profile = await initialProfile();



  return (
    <div className={`flex flex-col gap-2 justify-center items-center p-4 cursor-default`}>
      <div className="w-full">

        <div>
          <GenericGrid orders={orders} />
        </div>

      </div>
    </div>
  );
}


async function getOrders() {

  const orders = await prisma.orders.findMany({
    include: {
      customers: true,
      profile: true,
      ordersRegister: {
        include: {
          productVariations: {
            select: {
              name: true,
              defaultUnit: true,
            }
          },
          product: {
            select: {
              id: true,
              name: true,
            }
          },
        }
      }
    },
    orderBy: {
      dateOfBooking: "desc"
    }
  });
  return orders
}