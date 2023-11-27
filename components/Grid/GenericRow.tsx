"use client";
import React, { useEffect, useState } from "react";
import SheetProvider from "../SheetProvider/SheetProvider";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import axios from "axios";
import ToolTipProvider from "../ToolTipProvider/ToolTipProvider";
import PopoverProvider from "../Popover/PopoverProvider";
import { Status } from "@prisma/client";
import { v4 } from "uuid";
import { toast } from "sonner";

type Props = {
  row: any;
  index: number;
  stage?: "orderVerification" | "paymentVerification" | "DispatchDivision" | "InventoryManager" | any;
  profile: any
};

const GenericRow = (props: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [row, setRow] = useState<any>(props.row);
  const [rowTotalAmount, setRowTotalAmount] = useState<any>(0);

  const handleRowClick = () => {
    setSelectedOrder(row);
  };

  function updateRow(newRow: any) {
    setRow(newRow);
  }
  function DataRow() {
    return (
      <div
        className={`p-2 w-full hover:bg-yellow-50 justify-items-start grid grid-cols-9 text-xs text-start border select-none ${String(row.status).toLocaleLowerCase() === "fake" && "opacity-40 line-through"}`}
        onClick={handleRowClick}
      >
        <div className=" overflow-hidden whitespace-nowrap text-ellipsis opacity-40">
          {props.index + 1}
        </div>
        <div className="overflow-hidden whitespace-nowrap text-ellipsis ">
          {new Date(row.createdAt).toDateString()}
        </div>
        <div className=" overflow-hidden whitespace-nowrap text-ellipsis">
          {row.customers.name.charAt(0).toUpperCase() +
            row.customers.name.slice(1).toLowerCase()}
        </div>
        <div className="font-semibold  overflow-hidden whitespace-nowrap text-ellipsis">
          {
            formalizeText(row.ordersRegister.length > 1 ? `${row.ordersRegister[0].product.name} (...)` : `${row.ordersRegister[0].product.name}`)
          }
        </div>
        <div
          className={`${row.ordersRegister[0].weight !== 0 ? "opacity-100" : "opacity-40 "
            }  overflow-hidden whitespace-nowrap text-ellipsis`}
        >
          {getTotalWeight(row)}
        </div>
        <div className=" overflow-hidden whitespace-nowrap text-ellipsis">
          {row.customers.city}
        </div>

        <div className=" overflow-hidden whitespace-nowrap text-ellipsis">
          Rs {rowTotalAmount}
        </div>
        <ToolTipProvider content={row.orderNotes[0].note}>
          <div className="flex items-center gap-1">
            <div className={` ${rowStatusStyle(row.status)} p-1 text-center rounded-md  overflow-hidden whitespace-nowrap text-ellipsis`}>
              {getStatusCasual(row.status)}
            </div>
            <div>
              {row.orderNotes.length > 1 ? (
                <div className="text-xs w-4 h-4 border-b border-zinc-500 text-zinc-800 justify-center items-center flex text-center">
                  <div className="scale-75">
                    {row.orderNotes.length - 1}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </ToolTipProvider>
        <div className=" overflow-hidden whitespace-nowrap text-ellipsis ml-auto">
          {row.trackingNo ? row.trackingNo : "N/A"}
        </div>
      </div>
    );
  }

  let orderDate: any = new Date(row.dateOfBooking).toDateString();

  useEffect(() => {
    setRowTotalAmount(calculateRowTotal(row));
  }, [row]);

  function orderIdClicked(orderId: string) {
    navigator.clipboard.writeText(orderId)
      .then(() => {
       toast.success("Order reference number copied to clipboard")
      })
      .catch((err) => {
        toast.error("Unable to copy order reference to clipboard")
      });
  }
  return (
    <SheetProvider trigger={DataRow()}>
      <div className="select-none -mt-2 flex flex-col p-2  gap-2 ">

        <div onClick={() => orderIdClicked(row.id)} className="text-xs uppercase text-center bg-slate-300 text-white py-1 border-y border-slate-400 hover:bg-slate-700 transition-all duration-1000 cursor-pointer">{row.id}</div>

        <div className="flex justify-between text-xs items-center">
          <div className="p-1 border-b-2 border-red-900/30 tracking-wide ">
            {orderDate}
          </div>
          <div className="text-red-900 p-1 border-b-2 border-red-900/30 border-double-2 font-semibold">
            {formalizeText(getStatusCasual(row.status))}
          </div>
        </div>
        <div className="bg-red-900 p-1 font-semibold">
          <div className="bg-yellow-300 rounded flex p-2 gap-2 w-full items-center justify-between text-center">
            <div className="text-red-900">
              {getTotalWeight(row)}
            </div>
            <div className="">{formalizeText(row.ordersRegister.length > 1 ? `${row.ordersRegister[0].product.name} (...)` : `${row.ordersRegister[0].product.name}`)}</div>
            <div className="text-red-900">{formalizeText(row.ordersRegister[0].productVariations.name)}</div>
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
                {formalizeText(row.customers.name)}
              </p>
              <p className="">
                {row.customers.phone ? row.customers.phone !== "00000000001" ? <a className="text-blue-400" href={`tel:${row.customers.phone}`}>{row.customers.phone}</a> : "N/A" : "N/A"}
              </p>
              <p className="">
                {row.customers.phone2 ? row.customers.phone2 !== "00000000001" ? <a className="text-blue-400" href={`tel:${row.customers.phone2}`}>{row.customers.phone2}</a> : "N/A" : "N/A"}
              </p>
              <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                {formalizeText(row.customers.city)}
              </p>
              <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                {formalizeText(row.customers.address)}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <p className="font-semibold">Note</p>
            <PopoverProvider content={GetOrderNotes(row)}>
              <div className="w-full text-xs tracking-tight flex gap-1 items-center">
                <div className={row.orderNotes.length > 1 ? "text-xs w-4 h-4 bg-zinc-200 border border-zinc-500 text-zinc-800 rounded-full justify-center items-center flex text-center" : "hidden"}>
                  <p className="scale-75">
                    {row.orderNotes.length - 1}
                  </p>
                </div>
                {formalizeText(row.orderNotes[0].note)}
              </div>
            </PopoverProvider>
          </div>
        </div>

        <div className="grid grid-cols-3">
          <div>
            <p className="font-semibold">Status</p>
            <p className="text-xs tracking-tight">{formalizeText(getStatusCasual(row.status))}</p>
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
                    <p className="text-xs tracking-tight">{`${item.weight} ${item.productVariations.defaultUnit}`}</p>
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
              Last handler:
            </p>
            <p className="tracking-wide">
              {formalizeText((row.profile.name))}
            </p>
          </div>
          <p className="font-semibold text-lg text-green-700">
            Rs {rowTotalAmount}
          </p>
        </div>
        <div>
          {props.stage && getStageControls(props.stage, props.profile, row, updateRow)}
        </div>
      </div>
    </SheetProvider>
  );
};

export default GenericRow;

function rowStatusStyle(status: string) {
  switch (String(status).toLocaleUpperCase()) {
    case Status.READYTODISPATCH:
      return "bg-indigo-100 text-indigo-800";
    case "credit":
      return "bg-green-100 text-green-800";
    case Status.PAYMENTVERIFIED:
      return "bg-green-100 text-green-800 border border-green-300";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "fake":
      return "bg-slate-100 text-slate-800";
    case Status.CANCELLED:
      return "bg-red-100 text-red-500";
    case Status.VERIFIEDORDER:
      return "bg-cyan-100 text-cyan-700";
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

function getStageControls(stage: string, profile: any, row: any, updateRow: any) {
  switch (stage) {
    case "orderBooker":
      return null
    case "orderVerification":
      return _orderVerificationStageControls(profile, row, updateRow);
    case "paymentVerification":
      return _paymentVerificationStageControls(profile, row, updateRow);
    case "dispatchDivision":
      return _dispatcherStageControls(profile, row, updateRow);
    case "InventoryManager":
      break;
    default:
      return null;
  }
}

function _orderVerificationStageControls(profile: any, row: any, updateRow: any) {
  const [otherNote, setOtherNote] = useState<string>("");
  const [isWorking, setIsWorking] = useState<boolean>(false);


  function handleNote(text: string) {
    setOtherNote(text);
  }

  async function handleUpdateNote() {
    const userId = profile.userId;
    if (!otherNote) {
      return
    }
    const note = `'${formalizeText(otherNote)}' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
      setOtherNote("")
    });
    setIsWorking(false)
  }

  async function handleVerifiedButton() {
    const userId = profile.userId;
    const note = `'Order Verified' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.VERIFIEDORDER
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleCODVerifiedButton() {
    const userId = profile.userId;
    const note = `'Order Verified as COD' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.VERIFIEDORDER
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handlePartialVerifiedButton() {
    const userId = profile.userId;
    const note = `'Order Verified as will be partial paid' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.VERIFIEDORDER
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleCancelledButton() {
    const userId = profile.userId;
    const note = `'Order is cancelled' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.CANCELLED
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleResetButton() {
    const userId = profile.userId;
    const note = `'Requested to reset order' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    let status: any = Status.BOOKED

    switch (row.status) {
      case Status.VERIFIEDORDER:
        status = Status.BOOKED
        break;
      case Status.PAYMENTVERIFIED:
        status = Status.VERIFIEDORDER
        break;
      case Status.READYTODISPATCH:
        status = Status.PAYMENTVERIFIED
        break;
      default:
        status = Status.BOOKED
        break;
    }

    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-3 gap-1">
        <button onClick={() => handleNote("Calling ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Calling</button>
        <button onClick={() => handleNote("On hold ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">On hold</button>
        <button onClick={() => handleNote("No response ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">No response</button>
        <button onClick={() => handleNote("Powered off ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Powered off</button>
        <button onClick={() => handleNote("Fake order ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Fake order</button>
        <button onClick={() => handleNote("Order verified ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Order verified</button>
        <button onClick={() => handleNote("Will be partial paid of amount Rs. ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Partial</button>
      </div>
      <div className="flex gap-1 items-center">
        <Input placeholder="Other" className="text-xs" value={otherNote} onChange={(e: any) => { setOtherNote(e.target.value) }} />
        <button disabled={row.status === "VERIFIED ORDER" ? true : false} onClick={() => handleUpdateNote()} className={`bg-green-100 hover:bg-green-50 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.VERIFIEDORDER ? "cursor-not-allowed line-through" : ""}`}>{isWorking ? "..." : "Update"}</button>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-1">
        <button disabled={isWorking} onClick={() => handleResetButton()} className={`bg-indigo-100 hover:bg-indigo-50 active:scale-90 border border-indigo-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status !== Status.BOOKED ? "" : "hidden"}`}>Reset Status</button>
        <button disabled={isWorking} onClick={() => handleVerifiedButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.BOOKED ? "" : "hidden"}`}>Order Verified</button>
        <button disabled={isWorking} onClick={() => handleCancelledButton()} className={`bg-orange-100 hover:bg-orange-50 active:scale-90 border border-orange-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.BOOKED ? "" : "hidden"}`}>Cancelled</button>
        <button disabled={isWorking} onClick={() => handleCODVerifiedButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.BOOKED ? "" : "hidden"}`}>COD</button>
        <button disabled={isWorking} onClick={() => handlePartialVerifiedButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.BOOKED ? "" : "hidden"}`}>Partial COD</button>
      </div>
    </div>
  )
}
function _paymentVerificationStageControls(profile: any, row: any, updateRow: any) {
  const [otherNote, setOtherNote] = useState<string>("");
  const [isWorking, setIsWorking] = useState<boolean>(false);


  function handleNote(text: string) {
    setOtherNote(text);
  }

  async function handleUpdateNote() {
    const userId = profile.userId;
    if (!otherNote) {
      return
    }
    const note = `'${formalizeText(otherNote)}' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
      setOtherNote("")
    });
    setIsWorking(false)
  }

  async function handleVerifiedButton() {
    const userId = profile.userId;
    const note = `'Payment is received and verified' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.PAYMENTVERIFIED
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleCODVerifiedButton() {
    const userId = profile.userId;
    const note = `'Payment on COD' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.PAYMENTVERIFIED
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handlePartialVerifiedButton() {
    const userId = profile.userId;
    const note = `'Partial payment is received and rest will be on COD' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.PAYMENTVERIFIED
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleCancelledButton() {
    const userId = profile.userId;
    const note = `'Order is cancelled' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.CANCELLED
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleResetButton(row: any) {
    const userId = profile.userId;
    const note = `'Requested to reset order' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    let status = null

    switch (row.status) {
      case Status.VERIFIEDORDER:
        status = Status.BOOKED
        break;
      case Status.PAYMENTVERIFIED:
        status = Status.VERIFIEDORDER
        break;
      case Status.READYTODISPATCH:
        status = Status.PAYMENTVERIFIED
        break;
      default:
        status = Status.BOOKED
        break;
    }

    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-3 gap-1">
        <button onClick={() => handleNote("Calling ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Calling</button>
        <button onClick={() => handleNote("On hold ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">On hold</button>
        <button onClick={() => handleNote("No response ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">No response</button>
        <button onClick={() => handleNote("Powered off ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Powered off</button>
        <button onClick={() => handleNote("Fake order ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Fake order</button>
        <button onClick={() => handleNote("Fake receipt ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Fake receipt</button>
        <button onClick={() => handleNote("Offered ")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Offered</button>
        <button onClick={() => handleNote("Rs.  has been paid as partial, rest on COD.")} className="bg-slate-100 hover:bg-slate-50 active:scale-90 border border-slate-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs">Partial</button>
      </div>
      <div className="flex gap-1 items-center">
        <Input placeholder="Other" className="text-xs" value={otherNote} onChange={(e: any) => { setOtherNote(e.target.value) }} />
        <button disabled={row.status === Status.PAYMENTVERIFIED ? true : false} onClick={() => handleUpdateNote()} className={`bg-green-100 hover:bg-green-50 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.PAYMENTVERIFIED ? "cursor-not-allowed line-through" : ""}`}>{isWorking ? "..." : "Update"}</button>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-1">
        <button disabled={isWorking} onClick={() => handleResetButton(row)} className={`bg-indigo-100 hover:bg-indigo-50 active:scale-90 border border-indigo-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status !== Status.VERIFIEDORDER ? "" : "hidden"}`}>Reset Status</button>
        <button disabled={isWorking} onClick={() => handleVerifiedButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.VERIFIEDORDER ? "" : "hidden"}`}>Payment Verified</button>
        <button disabled={isWorking} onClick={() => handleCancelledButton()} className={`bg-orange-100 hover:bg-orange-50 active:scale-90 border border-orange-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.VERIFIEDORDER ? "" : "hidden"}`}>Cancelled</button>
        <button disabled={isWorking} onClick={() => handleCODVerifiedButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.VERIFIEDORDER ? "" : "hidden"}`}>COD</button>
        <button disabled={isWorking} onClick={() => handlePartialVerifiedButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.VERIFIEDORDER ? "" : "hidden"}`}>Partial COD</button>
      </div>
    </div>
  )
}
function _dispatcherStageControls(profile: any, row: any, updateRow: any) {
  const [otherNote, setOtherNote] = useState<string>("");
  const [isWorking, setIsWorking] = useState<boolean>(false);


  function handleNote(text: string) {
    setOtherNote(text);
  }

  async function handleUpdateNote() {
    const userId = profile.userId;
    if (!otherNote) {
      return
    }
    const note = `'${formalizeText(otherNote)}' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
      setOtherNote("")
    });
    setIsWorking(false)
  }

  async function handleMnPButton(row: any) {
    const userId = profile.userId;
    const note = `'Dispatch confirmed to: "M&P" ' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.READYTODISPATCH
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });

    await axios.post("/api/order/dispatch/MnP/book", { userId, row }).then((res) => {
      const data = res.data.data
      console.log(res.data)
    })

    setIsWorking(false)
  }
  async function handleGopButton() {
    const userId = profile.userId;
    const note = `'Dispatch confirmed to: "GOP" ' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.READYTODISPATCH
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleSpeedAfButton() {
    const userId = profile.userId;
    const note = `'Dispatch confirmed to: "SpeedAf" ' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.READYTODISPATCH
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleTcsButton() {
    const userId = profile.userId;
    const note = `'Dispatch confirmed to: "TCS" ' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.READYTODISPATCH
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  async function handleResetButton(row: any) {
    const userId = profile.userId;
    const note = `'Requested to reset order on dispatch' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    let status = null

    switch (row.status) {
      case Status.VERIFIEDORDER:
        status = Status.BOOKED
        break;
      case Status.PAYMENTVERIFIED:
        status = Status.VERIFIEDORDER
        break;
      case Status.READYTODISPATCH:
        status = Status.PAYMENTVERIFIED
        break;
      default:
        status = Status.BOOKED
        break;
    }

    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    setIsWorking(false)
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1 items-center">
        <Input placeholder="Rider instructions" className="text-xs" value={otherNote} onChange={(e: any) => { setOtherNote(e.target.value) }} />
        <button disabled={row.status === Status.READYTODISPATCH ? true : false} onClick={() => handleUpdateNote()} className={`bg-green-100 hover:bg-green-50 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 px-4 text-xs ${row.status === Status.READYTODISPATCH ? "cursor-not-allowed line-through" : ""}`}>{isWorking ? "..." : "Add"}</button>
      </div>
      <div className="border border-green-300 rounded p-2">
        <div className="widest font-semibold text-slate-700 text-sm mt-1">Forward to:</div>
        <div className="grid grid-cols-2 gap-1 mt-1">
          <button disabled={isWorking} onClick={() => handleResetButton(row)} className={`bg-indigo-100 hover:bg-indigo-50 active:scale-90 border border-indigo-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status !== Status.PAYMENTVERIFIED ? "" : "hidden"}`}>Reset Status</button>
          <button disabled={isWorking} onClick={() => handleMnPButton(row)} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.PAYMENTVERIFIED ? "" : "hidden"}`}>M&P</button>
          <button disabled={isWorking} onClick={() => handleTcsButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.PAYMENTVERIFIED ? "" : "hidden"}`}>TCS</button>
          <button disabled={isWorking} onClick={() => handleGopButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.PAYMENTVERIFIED ? "" : "hidden"}`}>GPO</button>
          <button disabled={isWorking} onClick={() => handleSpeedAfButton()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.PAYMENTVERIFIED ? "" : "hidden"}`}>SpeedAf</button>
        </div>
      </div>
    </div>
  )
}


function GetOrderNotes(row: any) {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  function handleRowClick(index: number) {
    if (index === selectedRowIndex) {
      setSelectedRowIndex(-1);
    } else {
      setSelectedRowIndex(index);
    }
  }

  const keyPressEvent = (e: any) => {
    if (e.key === "Escape") {
      setSelectedRowIndex(-1);
    }

    if (e.key === "ArrowUp") {
      const current = selectedRowIndex;
      setSelectedRowIndex(current - 1);
    }
    if (e.key === "ArrowDown") {
      const current = selectedRowIndex;
      setSelectedRowIndex(current + 1);
    }
  }

  return (
    <div className="w-[700px]">
      <div className="flex justify-center items-center text-sm tracking-widest text-zinc-500 font-semibold border-b-2 border-spacing-2 mb-2 shadow-sm">
        ACTIVITY LOG
      </div>
      <ScrollArea className="w-full flex gap-1 justify-between items-center h-[200px]">
        {
          row.orderNotes.map((note: any, index: number) => {
            // if (index >= 5) {
            //   return
            // }
            const rowIndex = row.orderNotes.length - index - 1;
            return (

              <div onKeyDown={keyPressEvent} onClick={() => handleRowClick(index)} className={`select-none cursor-default border-b scale-90 ${index === selectedRowIndex ? "bg-red-100" : "hover:bg-slate-50"} `} key={v4()}>
                <div className="grid grid-cols-4 ">
                  <div className="text-xs text-slate-700 w-4 h-4 text-center font-semibold opacity-50">
                    {rowIndex === 0 ? "-" : rowIndex}
                  </div>
                  <div className="text-xs text-slate-700">
                    {new Date(note.createdAt).toDateString()}
                  </div>
                  <div className="text-xs text-slate-700">
                    {new Date(note.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-slate-700">
                    {String(note.note).charAt(0).toUpperCase() + String(note.note).slice(1).toLowerCase()}
                  </div>
                </div>
              </div>
            )
          })
        }
      </ScrollArea>
    </div>
  )
}

function getStatusCasual(status: Status) {
  switch (status) {
    case Status.BOOKED:
      return "BOOKED"
    case Status.VERIFIEDORDER:
      return "VERIFIED ORDER"
    case Status.PAYMENTVERIFIED:
      return "PAYMENT VERIFIED";
    case Status.READYTODISPATCH:
      return "READY FOR DISPATCH";
    case Status.CANCELLED:
      return "CANCELLED"
    default:
      return "Unknown"
  }
}