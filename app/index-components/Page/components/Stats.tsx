import React, { useEffect, useState } from 'react';
import OrderStats from './sub/OrderStats';
import OrderNotes from '@/app/user/(routes)/dashboard/components/sub/OrderNotes';
import currentProfile from '@/lib/current-profile';
import StatusChart from './StatusChart';

type StatsProps = {};

const Stats: React.FC<StatsProps> = () => {
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await currentProfile();
      setProfile(userProfile);
    };

    fetchData();
  }, []);

  if (!profile) return noProfile();

  return (
    <div>
      <div>
        {/* <OrderStats /> */}
      </div>
      <div className='mt-5'>
        <StatusChart />
      </div>
      <div className='mt-5'>
        <div className='text-slate-500 my-1'>Happening right now:</div>
        <OrderNotes profile={profile} />
      </div>
    </div>
  );
};

function noProfile() {
  return (
    <div>
      <h1>You must be a registered user to see this page.</h1>
    </div>
  );
}

export default Stats;
