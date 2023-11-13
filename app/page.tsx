import UploadButton from "@/components/File/UploadButton"
import GenericGrid from "@/components/Grid/GenericGrid";
import prisma from "@/lib/prisma"

export default async function Home() {

  const orders = await getOrders()




  return (
    <div className={`flex flex-col gap-2 justify-center items-center p-4 cursor-default`}>
      <UploadButton />

      <div className="w-full p-10">

        <div>
          <GenericGrid orders={orders}/>
        </div>

      </div>
    </div>
  );
}


async function getOrders() {

  const orders = await prisma.orders.findMany({
    include: {
     customers: true,
     ordersRegister:{
        include:{
          productVariations:{
            select:{
              id:true,
              name:true,
            }
          },
          product:{
            select:{
              id:true,
              name:true,
            }
          },
          }
     }
    },
    orderBy: {
        dateOfBooking: "asc"
    }
});
  return orders
}