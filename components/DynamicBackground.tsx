import React, { useState, useEffect } from 'react';

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

const getTimeOfDay = (): TimeOfDay => {
  const now = new Date();
  // Get the current hour in the 'America/New_York' timezone (which handles EST/EDT automatically)
  const estHourString = now.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    hour12: false,
  });
  const hour = parseInt(estHourString, 10);

  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
};

const backgroundClasses: { [key in TimeOfDay]: string } = {
  morning: 'bg-gradient-to-t from-orange-400/20 via-sky-800/30 to-slate-900',
  day: 'bg-gradient-to-b from-sky-600/40 via-sky-800/50 to-slate-900',
  evening: 'bg-gradient-to-t from-red-500/30 via-indigo-800/40 to-slate-900',
  night: 'bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-900',
};

const DynamicBackground: React.FC = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [timeOfDay]);

  return (
    <div
      className={`fixed inset-0 -z-10 transition-all duration-[2000ms] ease-in-out ${backgroundClasses[timeOfDay]}`}
    />
  );
};

export default DynamicBackground;