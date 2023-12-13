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
import Image from "next/image";

type Props = {
  row: any;
  index: number;
  stage?: "orderVerification" | "paymentVerification" | "DispatchDivision" | "InventoryManager" | any;
  profile: any
  disabled?: boolean;
  selectionProps: {
    addToSelection: (id: string) => void;
    removeFromSelection: (id: string) => void;
    isInSelection: (id: string) => boolean;
    clearSelection: () => void;
    mode: Mode;
  }
};

type Mode = 'normal' | 'selection'

const GenericRow = (props: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [row, setRow] = useState<any>(props.row);
  const [rowTotalAmount, setRowTotalAmount] = useState<any>(0);
  const [timeLapsed, setTimeLapsed] = useState<any>();
  const { addToSelection, isInSelection, mode } = props.selectionProps;
  console.log(props.row)
  const handleRowClick = () => {
    setSelectedOrder(row);
    if (!props.disabled && mode === "selection") {
      addToSelection(row.id);
    }
  };
  function updateRow(newRow: any) {
    setRow(newRow);
  }



  useEffect(() => {
    const intervalId = setInterval(() => {
      const time = getTimeLapsed(row.createdAt);
      setTimeLapsed(time);
    }, 1000); // run every second

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [row.createdAt]);


  function DataRow() {
    return (
      <div
        className={`p-2 w-full  ${isInSelection(row.id) ? "bg-green-100" : ""} ${!props.disabled && !isInSelection(row.id) && "hover:bg-yellow-50 cursor-pointer"} cursor-default justify-items-start grid grid-cols-10 items-center text-xs text-start border select-none ${String(row.status).toLocaleLowerCase() === "fake" && "opacity-40 line-through"}`}
        onClick={handleRowClick}
      >
        <div className=" overflow-hidden whitespace-nowrap text-ellipsis opacity-40">
          {props.index + 1}
        </div>
        <div>
          <div className="overflow-hidden whitespace-nowrap text-ellipsis ml-auto mr-auto">
            {new Date(row.createdAt).toDateString()}
          </div>
          <div className="flex gap-1 text-slate-400 text-xs scale-90 -ml-1">
            <div>{timeLapsed && "Created"}</div>
            <div>
              {
                timeLapsed && `${timeLapsed} ago`
              }
            </div>
          </div>
        </div>
        <div className="ml-auto mr-auto">
          <ToolTipProvider content={String(new Date(row.dateOfDelivery).toDateString())}>
            <div className={`overflow-hidden whitespace-nowrap text-ellipsis ${getDeliveryDateDifference(row.dateOfDelivery) === "Yesterday" || Number(getDeliveryDateDifference(row.dateOfDelivery)) < 1 ? "text-red-800 opacity-40 font-semibold tracking-tight" : ""}`}>
              {
                getDeliveryDateDifference(row.dateOfDelivery)
              }
            </div>
          </ToolTipProvider>
        </div>
        <div className="w-24 overflow-hidden whitespace-nowrap text-ellipsis">
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
        <ToolTipProvider content={String(row.orderNotes ? row.orderNotes[0].note : "")}>
          <div className="flex flex-col items-center ">
            <div>
              {row.orderNotes.length > 1 ? (
                <div className="text-xs w-4 h-4 border-zinc-500 text-zinc-800 justify-center items-center flex text-center">
                  <div className="scale-75 flex gap-1 opacity-60 items-center font-semibold">
                    <div>
                      Interactions:
                    </div>
                    <div>
                      {row.orderNotes.length - 1}
                    </div>
                  </div>
                </div>
              ) : (<div className="scale-75 flex gap-1 opacity-60 items-center font-semibold">New</div>)}
            </div>
            <div className={` ${rowStatusStyle(row.status)} p-1 text-center w-28 text-xs rounded-md  overflow-hidden whitespace-nowrap text-ellipsis`}>
              {getStatusCasual(row.status)}
            </div>
          </div>
        </ToolTipProvider>
        <div className=" overflow-hidden whitespace-nowrap text-ellipsis ml-auto">
          {row.trackingNo ? (
            <ToolTipProvider content={row.trackingNo}>
              <div className="flex flex-col items-center">
                <div className="font-semibold">
                  {row.courier}
                </div>
                <div className="text-black/60 p-1 bg-slate-100 rounded border border-slate-200">
                  {row.trackingNo}
                </div>
              </div>
            </ToolTipProvider>
          ) : null}
        </div>
      </div >
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

  const forNotThisUser = props.profile.userId !== row.userId;
  function rowClicked(row: any) {
    if (forNotThisUser) return

    if (selectedOrder.id === row.id) {
      setSelectedOrder(null)
    } else {
      setSelectedOrder(row.id)
    }
  }

  return (
    <SheetProvider trigger={DataRow()}>

      {
        props.disabled ? (
          OtherUserOrder()
        ) : (
          <div className="select-none -mt-2 flex flex-col p-2  gap-2 ">

            <div onClick={() => orderIdClicked(row.id)} className="text-xs uppercase text-center bg-slate-300 text-white py-1 border-y border-slate-400 hover:bg-slate-700 transition-all duration-1000 cursor-pointer">{row.id}</div>

            <div className="flex justify-between text-xs items-center">
              <div className="p-1 border-b-2 border-slate-900/30 tracking-wide ">
                {orderDate}
              </div>
              <div className="text-slate-900 p-1 border-b-2 border-slate-900/30 border-double-2 font-semibold">
                {formalizeText(getStatusCasual(row.status))}
              </div>
            </div>
            <div className="bg-slate-900/40 p-1 font-semibold">
              <div className="bg-slate-300 rounded flex p-2 gap-2 w-full items-center justify-between text-center">
                <div className="text-slate-900">
                  {getTotalWeight(row)}
                </div>
                <div className="">{formalizeText(row.ordersRegister.length > 1 ? `${row.ordersRegister[0].product.name} (...)` : `${row.ordersRegister[0].product.name}`)}</div>
                <div className="text-slate-900">{formalizeText(row.ordersRegister[0].productVariations.name)}</div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 w-full text-sm">
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
                  <div className="text-ellipsis overflow-hidden whitespace-break-spaces h-16">
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
            <div className="grid grid-cols-4 -mb-2 bg-slate-300 items-center px-2 py-1">
              <p className="font-semibold text-sm">Product</p>
              <p className="font-semibold text-sm">Variant</p>
              <p className="font-semibold text-sm">Weight</p>
              <p className="font-semibold text-sm">Amount</p>
            </div>
            <div className="">
              {
                row.ordersRegister.map((item: any) => {
                  return (
                    <div className="grid grid-cols-4 px-2 py-1 border-b border-x" key={formalizeText(item.name)}>
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
                  Current handler:
                </p>
                <p className="tracking-wide">
                  {formalizeText((row.profile ? row.profile.name : ""))}
                </p>
              </div>
              <p className="font-semibold text-lg text-green-700">
                Rs {rowTotalAmount}
              </p>
            </div>
            <div>
              {props.stage && getStageControls(props.stage, props.profile, row, updateRow)}
            </div>
          </div >
        )
      }

    </SheetProvider >
  );
};

export default GenericRow;

function OtherUserOrder() {
  return (
    <div>
      <div className="p-2 w-full bg-slate-100 border-2 border-slate-200 drop-shadow-sm rounded mt-10">
        This order is being handled by another user
      </div>
    </div>
  )
}

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
    case Status.DISPATCHED:
      return "bg-green-100 text-green-700 border-b border-green-700 ";
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
    case "inventoryManager":
      return _inventoryStageControls(profile, row, updateRow);
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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

    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      console.log(response)
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });

    await axios.post("/api/order/dispatch/MnP/book", { userId, row }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    })

    toast.success("Order ready to be dispatch towards M&P")
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const data = res.data.data
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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

    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }

    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
function _inventoryStageControls(profile: any, row: any, updateRow: any) {
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
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      console.log(response)
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        setOtherNote("")
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    setIsWorking(false)
  }

  async function handleDispatched(row: any) {
    const userId = profile.userId;
    const note = `'Dispatched' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.DISPATCHED
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then((res) => {
      const data = res.data.data
      updateRow(data)
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });

    await axios.post("/api/order/dispatch/MnP/book", { userId, row }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    })

    toast.success("Order dispatched!")
    setIsWorking(false)
  }
  async function handleCancelled() {
    const userId = profile.userId;
    const note = `'Cancelled' - ${formalizeText(profile.name)}`;
    const orderId = row.id;
    if (!note) {
      return
    }

    setIsWorking(true)
    const status = Status.CANCELLED
    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const data = res.data.data
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
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
      case Status.DISPATCHED:
        status = Status.READYTODISPATCH
      default:
        status = Status.READYTODISPATCH
        break;
    }

    await axios.patch("/api/order/notes/", { userId, note, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }

    });
    await axios.patch("/api/order/status/update", { userId, status, orderId }).then(async (res) => {
      const response = await res.data
      if (response.status === 200) {
        const data = response.data
        toast.success(response.message, { duration: 1000 })
        updateRow(data)
      } else {
        toast.warning(response.message, { duration: 1000 })
      }
    });
    setIsWorking(false)
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="border border-green-300 rounded p-2">
        <div className="widest font-semibold text-slate-700 text-sm mt-1">Actions:</div>
        <div className="grid grid-cols-2 gap-1 mt-1">
          <button disabled={isWorking} onClick={() => handleResetButton(row)} className={`bg-indigo-100 hover:bg-indigo-50 active:scale-90 border border-indigo-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status !== Status.READYTODISPATCH ? "" : "hidden"}`}>Reset Status</button>
          <button disabled={isWorking} onClick={() => handleDispatched(row)} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.READYTODISPATCH ? "" : "hidden"}`}>Dispatched</button>
          <button disabled={isWorking} onClick={() => handleCancelled()} className={`bg-green-100 hover:bg-green-50 active:scale-90 border border-green-200 drop-shadow-sm text-slate-800 rounded-md p-1 text-xs ${row.status === Status.READYTODISPATCH ? "" : "hidden"}`}>CANCELLED</button>
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
    <div className="w-[700px] select-none">
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

              <div onKeyDown={keyPressEvent} onClick={() => handleRowClick(index)} className={`select-none cursor-default border-b scale-90 ${index === selectedRowIndex ? "bg-red-100 rounded-md" : "hover:bg-slate-50"} `} key={v4()}>
                <div className="grid grid-cols-3 gap-2 p-2 items-center">
                  {/* <div className="text-xs text-slate-700 w-4 h-4 text-center font-semibold opacity-50">
                    {rowIndex === 0 ? "-" : rowIndex}
                  </div> */}

                  <div className="flex gap-1 text-xs items-center relative">
                    <Image src={note?.profile?.imageURL} width={20} height={20} className="rounded-full w-6 h-6" alt="profile" />
                    <div className="flex flex-col justify-start items-start text-start">
                      <div>
                        {note?.profile?.name}
                      </div>
                      <div className="text-xs scale-75">{note?.profile?.role}</div>
                    </div>

                  </div>
                  <div className="text-xs text-slate-700 px-2">
                    {String(note.note).toUpperCase()}
                  </div>
                  <div className=" ml-auto">
                    <div className="text-xs text-slate-700 ">
                      {new Date(note.createdAt).toDateString()}
                    </div>
                    <div className="text-xs text-slate-700">
                      {new Date(note.createdAt).toLocaleTimeString()}
                    </div>
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
    case Status.DISPATCHED:
      return "DISPATCHED"
    case Status.CANCELLED:
      return "CANCELLED"
    default:
      return "Unknown"
  }
}

function getTimeLapsed(targetDateTime: any) {
  const target = new Date(targetDateTime);
  const now = new Date();
  const diff = now.getTime() - target.getTime();
  const diffInSeconds = diff / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  const diffInMonths = diffInDays / 30; // Assuming an average month length of 30 days
  const diffInYears = diffInDays / 365; // Assuming a year has 365 days

  if (diffInYears >= 1) {
    return `${Math.floor(diffInYears)}y`;
  } else if (diffInMonths >= 1) {
    return `${Math.floor(diffInMonths)}mo`;
  } else if (diffInDays >= 1) {
    return `${Math.floor(diffInDays)}d`;
  } else if (diffInHours >= 1) {
    return `${Math.floor(diffInHours)}h`;
  } else if (diffInMinutes >= 1) {
    return `${Math.floor(diffInMinutes)}m`;
  } else {
    return `${Math.floor(diffInSeconds)}s`;
  }
}

function getDeliveryDateDifference(targetDateTime: any) {
  const target = new Date(targetDateTime);
  const now = new Date();
  const diff = now.getTime() - target.getTime();

  const diffInSeconds = Math.floor(diff / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
}

