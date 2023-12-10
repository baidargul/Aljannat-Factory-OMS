import { Clock2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
    refreshRate: number;
};

const TimeRemainingToRefresh = (props: Props) => {
    const [initialTime, setInitialTime] = useState(props.refreshRate / 1000);
    const [timeRemainingToRefresh, setTimeRemainingToRefresh] = useState(initialTime);

    useEffect(() => {
        // Update initialTime when refreshRate changes
        setInitialTime(props.refreshRate / 1000);
        // Reset timeRemainingToRefresh to the new initialTime
        setTimeRemainingToRefresh(props.refreshRate / 1000);
    }, [props.refreshRate]);

    useEffect(() => {
        // Reset timeRemainingToRefresh to the initial value
        if (timeRemainingToRefresh === 0) {
            setTimeRemainingToRefresh(initialTime);
        }
    }, [timeRemainingToRefresh])

    useEffect(() => {
        const interval = setInterval(() => {
            if (timeRemainingToRefresh === 0) {
                // Reset timeRemainingToRefresh to the initial value
                setTimeRemainingToRefresh(initialTime);
                return;
            } else {
                setTimeRemainingToRefresh(prevTime => Math.max(prevTime - 1, 0));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [initialTime]);

    return (
        <div className='flex items-center gap-1'>
            <div>
                <Clock2 className='inline w-4 h-4' />
            </div>
            :
            <div>
                {`${timeRemainingToRefresh}/${initialTime}s`}
            </div>
        </div>
    );
};

export default TimeRemainingToRefresh;
