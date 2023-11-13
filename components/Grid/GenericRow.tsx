"use client";
import React, { useState } from "react";
import SheetProvider from "../SheetProvider/SheetProvider";
import { ScrollArea } from "../ui/scroll-area";

type Props = {
  row: any;
};

const GenericRow = (props: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { row } = props;

  const handleRowClick = () => {
    setSelectedOrder(row);
  };

  function DataRow() {
    return (
      <div
        className={`p-2 grid grid-cols-8 w-full justify-items-start gap-10 text-xs text-start border select-none ${String(row.status).toLocaleLowerCase()==="fake" && "opacity-40 line-through"}`}
        onClick={handleRowClick}
      >
        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis ">
          {row.dateOfBooking.toDateString()}
        </div>
        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.customers.name.charAt(0).toUpperCase() +
            row.customers.name.slice(1).toLowerCase()}
        </div>
        <div className="font-semibold w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.product.charAt(0).toUpperCase() +
            row.product.slice(1).toLowerCase()}
        </div>
        <div
          className={`${
            row.weight && "opacity-100"
          } opacity-40 w-36 overflow-hidden whitespace-nowrap text-ellipsis`}
        >
          {row.weight ? String(row.weight).toLocaleUpperCase() : "0KG"}
        </div>
        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.variant.charAt(0).toUpperCase() +
            row.variant.slice(1).toLowerCase()}
        </div>

        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          Rs {row.amount}
        </div>
        <div className={` ${rowStatusStyle(row.status)} p-1 text-center rounded-md w-36 overflow-hidden whitespace-nowrap text-ellipsis`}>
          {row.status}
        </div>
        <div className="w-36 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.note}
        </div>
      </div>
    );
  }


  const title = `${
    row.weight ? String(row.weight).toLocaleUpperCase() : "0KG"
  } ${
    row.product.charAt(0).toUpperCase() + row.product.slice(1).toLowerCase()
  }   (${
    row.variant.charAt(0).toUpperCase() + row.variant.slice(1).toLowerCase()
  })`;

  let orderDate: any = new Date(row.dateOfBooking).toDateString();
  return (
    <SheetProvider trigger={DataRow()}>
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
          <div className="bg-yellow-300 rounded flex p-2 gap-2 w-full justify-evenly">
            <p className="text-red-900">
              {row.weight ? String(row.weight).toLocaleUpperCase() : "0KG"}
            </p>
            <p className="">{row.product}</p>
            <p className="text-red-900">{row.variant}</p>
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
        <div className="flex justify-between mt-10">
          <p className="font-semibold text-lg text-green-700">
            {row.confirmedBy}
          </p>
          <p className="font-semibold text-lg text-green-700">
            Rs {row.amount}
          </p>
        </div>
      </div>
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