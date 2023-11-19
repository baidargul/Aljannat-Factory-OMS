"use client";
import React, { useEffect, useState } from "react";
import SheetProvider from "../SheetProvider/SheetProvider";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  row: any;
};

const GenericRow = (props: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [rowTotalAmount, setRowTotalAmount] = useState<any>(0);



  const { row } = props;
  const handleRowClick = () => {
    setSelectedOrder(row);
  };

  function DataRow() {
    return (
      <div
        className={`p-2 grid grid-cols-8 w-full justify-items-start items-center gap-10 text-xs text-start border select-none ${String(row.status).toLocaleLowerCase() === "fake" && "opacity-40 line-through"}`}
        onClick={handleRowClick}
      >
        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis ">
          {row.createdAt.toDateString() + " " + row.createdAt.toLocaleTimeString()}
        </div>
        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.customers.name.charAt(0).toUpperCase() +
            row.customers.name.slice(1).toLowerCase()}
        </div>
        <div className="font-semibold w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          {
            formalizeText(row.ordersRegister.length > 1 ? `${row.ordersRegister[0].product.name} (...)` : `${row.ordersRegister[0].product.name}`)
          }
        </div>
        <div
          className={`${row.ordersRegister[0].weight !== 0 ? "opacity-100" : "opacity-40 "
            } w-36 overflow-hidden whitespace-nowrap text-ellipsis`}
        >
          {getTotalWeight(row)}
        </div>
        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.ordersRegister[0].productVariations.name.charAt(0).toUpperCase() +
            row.ordersRegister[0].productVariations.name.slice(1).toLowerCase()}
        </div>

        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          Rs {rowTotalAmount}
        </div>
        <div className={` ${rowStatusStyle(row.status)} p-1 text-center rounded-md w-36 overflow-hidden whitespace-nowrap text-ellipsis`}>
          {row.status}
        </div>
        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.trackingNo}
        </div>
      </div>
    );
  }


  // const title = `${row.weight ? String(row.weight).toLocaleUpperCase() : "0KG"
  //   } ${row.product.charAt(0).toUpperCase() + row.product.slice(1).toLowerCase()
  //   }   (${row.variant.charAt(0).toUpperCase() + row.variant.slice(1).toLowerCase()
  //   })`;

  let orderDate: any = new Date(row.dateOfBooking).toDateString();

  useEffect(() => {
    setRowTotalAmount(calculateRowTotal(row));
  }, [row]); // Only re-run the effect if 'row' changes

  return (
    <SheetProvider trigger={DataRow()}>
      <ScrollArea>
        <div className="select-none mt-10 flex flex-col p-2  gap-2 ">
          <div className="flex justify-between text-xs items-center">
            <p className="p-1 border-b-2 border-red-900/30 tracking-wide ">
              {orderDate}
            </p>
            <p className="text-red-900 p-1 border-b-2 border-red-900/30 border-double-2 font-semibold">
              {row.status}
            </p>
          </div>
          <div className="bg-red-900 p-1 font-semibold">
            <div className="bg-yellow-300 rounded flex p-2 gap-2 w-full items-center justify-between text-center">
              <p className="text-red-900">
                {getTotalWeight(row)}
              </p>
              <p className="">{formalizeText(row.ordersRegister.length > 1 ? `${row.ordersRegister[0].product.name} (...)` : `${row.ordersRegister[0].product.name}`)}</p>
              <p className="text-red-900">{formalizeText(row.ordersRegister[0].productVariations.name)}</p>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 w-full">
              <div className="font-semibold">
                <p className="">Customer</p>
                <p className="">Phone 01</p>
                <p className="">Phone 02</p>
                <p className="">City</p>
                <p className="">Address</p>
              </div>
              <div className="">
                <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {row.customers.name.charAt(0).toUpperCase() +
                    row.customers.name.slice(1).toLowerCase()}
                </p>
                <p className="">
                  {row.customers.phone !== "00000000001"
                    ? row.customers.phone
                    : "N/A"}
                </p>
                <p className="">
                  {row.customers.phone2 !== "00000000001"
                    ? row.customers.phone2
                    : "N/A"}
                </p>
                <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {row.customers.city.charAt(0).toUpperCase() +
                    row.customers.city.slice(1).toLowerCase()}
                </p>
                <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {row.customers.address.charAt(0).toUpperCase() +
                    row.customers.address.slice(1).toLowerCase()}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <p className="font-semibold">Note</p>
              <p className="w-full text-xs tracking-tight">{row.note}</p>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div>
              <p className="font-semibold">Status</p>
              <p className="text-xs tracking-tight">{row.status}</p>
            </div>
            <div>
              <p className="font-semibold">Service</p>
              <p className="text-xs tracking-tight">{row.courier}</p>
            </div>
            <div>
              <p className="font-semibold">#</p>
              <p className="text-xs tracking-tight">{row.trackingNo}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 -mb-2 bg-slate-300 items-center px-2">
            <p className="font-semibold text-sm">Product</p>
            <p className="font-semibold text-sm">Variant</p>
            <p className="font-semibold text-sm">Weight</p>
            <p className="font-semibold text-sm">Amount</p>
          </div>
          <div className="">
            {
              row.ordersRegister.map((item: any) => {
                return (
                  <div className="grid grid-cols-4 px-2 border-b border-x" key={formalizeText(item.name)}>
                    <div>
                      <p className="text-xs tracking-tight">{formalizeText(item.product.name)}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-tight">{formalizeText(item.productVariations.name)}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-tight">{item.weight}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-tight">Rs {item.amount}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="flex justify-between mt-10 items-center">
            <div className="text-sm flex gap-1 text-slate-700 items-center">
              <p className="font-semibold ">
                EMP:
              </p>
              <p className="tracking-wide">
                {formalizeText((row.profile.name))}
              </p>
            </div>
            <p className="font-semibold text-lg text-green-700">
              Rs {rowTotalAmount}
            </p>
          </div>
        </div>
      </ScrollArea>
    </SheetProvider>
  );
};

export default GenericRow;

function rowStatusStyle(status: string) {
  switch (String(status).toLocaleLowerCase()) {
    case "dispatched":
      return "bg-indigo-100 text-indigo-800";
    case "credit":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "fake":
      return "bg-slate-100 text-slate-800";
    case "cancelled":
      return "bg-red-100 text-red-500";
    default:
      return "bg-yellow-300";
  }
}

function formalizeText(text: string) {
  if (!text) {
    return "N/A"
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function calculateRowTotal(row: any) {
  let total = 0;
  row.ordersRegister.map((item: any) => {
    total += item.amount;
  });
  return total;
}

function getTotalWeight(row: any) {
  let total = 0;
  const units = [] as any;
  row.ordersRegister.map((item: any) => {
    total += Number(item.weight);
    if (!units.includes(item.productVariations.defaultUnit)) {
      units.push(item.productVariations.defaultUnit)
    }
  });
  let unitString = "(";
  units.map((unit: any) => {
    unitString = unitString.length > 1 ? unitString + "/" + unit : unitString + unit;
  })
  unitString = String(unitString + ")").toLocaleUpperCase();
  return `${total} ${units.length > 1 ? unitString : String(units[0]).toLocaleUpperCase()}`;
}