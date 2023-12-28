'use client'
import { Input } from '@/components/ui/input'
import { usePOS } from '@/hooks/usePOS'
import { formalizeText } from '@/lib/my'
import React, { useEffect, useState, useRef } from 'react'

type Props = {
    item: any
    index: number
    setIsChanged: any
    POS: any
}

const POSOrderRow = (props: Props) => {
    const POS: any = props.POS
    const [weight, setWeight] = useState<number>(getWeight());
    const [amount, setAmount] = useState<number>(getAmount());
    const weightRef = useRef<any>(null);
    const amountRef = useRef<any>(null);

    function getWeight() {
        let tempWeight = 0;
        POS.products.forEach((item: any) => {
            if (item.id === props.item.id) {
                tempWeight = item.weight;
            }
        });
        return tempWeight;
    }

    function getAmount() {
        let tempAmount = 0;
        POS.products.forEach((item: any) => {
            if (item.id === props.item.id) {
                tempAmount = item.amount;
            }
        });
        return tempAmount;
    }

    const handleWeightChange = (e: any) => {
        setWeight(e.target.value);
    };

    const handleAmountChange = (e: any) => {
        setAmount(e.target.value);
    };

    const handleWeightBlur = () => {
        POS.changeWeight(props.item.id, weight);
    };

    const handleAmountBlur = () => {
        POS.changeAmount(props.item.id, amount);
    };

    const handleWeightFocus = () => {
        weightRef.current.select();
    };

    const handleAmountFocus = () => {
        amountRef.current.select();
    };

    const handleWeightKeyDown = (e: any) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            POS.changeWeight(props.item.id, weight);
            amountRef.current.focus();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            POS.changeWeight(props.item.id, weight);
        }
    };

    const handleAmountKeyDown = (e: any) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            POS.changeAmount(props.item.id, amount);
            weightRef.current.focus();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            POS.changeAmount(props.item.id, amount);
        }
    };


    return (
        <div className='p-2 relative group bg-slate-50 border-b hover:bg-yellow-100'>
            <div className='grid grid-cols-5 items-center gap-2'>
                <div className='w-4 opacity-20'>{props.index + 1}</div>
                <div>{formalizeText(props.item.productName)}</div>
                <div>{formalizeText(props.item.variantName)}</div>
                <div>
                    <Input
                        ref={weightRef}
                        name='amount'
                        className='text-sm'
                        type='number'
                        placeholder={`0.5 (${props.item.unit.toUpperCase()})`}
                        onChange={handleWeightChange}
                        onBlur={handleWeightBlur}
                        onFocus={handleWeightFocus}
                        onKeyDown={handleWeightKeyDown}
                        value={weight}
                    />
                </div>
                <div>
                    <Input
                        ref={amountRef}
                        name='weight'
                        className='text-sm'
                        type='number'
                        placeholder='Rs '
                        onChange={handleAmountChange}
                        onBlur={handleAmountBlur}
                        onFocus={handleAmountFocus}
                        onKeyDown={handleAmountKeyDown}
                        value={amount}
                    />
                </div>
            </div>
            <button
                onClick={() => POS.removeProduct(props.item.id)}
                className='group-hover:block group-active:block hidden absolute top-2 left-8 bg-red-800 text-white rounded-md w-6 h-6 text-center cursor-pointer'
            >
                x
            </button>
        </div>
    );
};

export default POSOrderRow;