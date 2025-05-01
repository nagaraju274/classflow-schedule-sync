
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useTimetable } from '@/contexts/TimetableContext';
import { cn } from '@/lib/utils';
import DailySchedule from './DailySchedule';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TimetableView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'daily' | 'weekly'>('weekly');
  
  // Get the day of the week
  const dayOfWeek = WEEKDAYS[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1];
  
  // In the weekly view, we show the schedule for all days
  const daysToShow = view === 'weekly' ? WEEKDAYS : [dayOfWeek];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Schedule</h2>
          <p className="text-muted-foreground">
            View and manage your class timetable
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className={cn("p-3 pointer-events-auto")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex rounded-md border">
            <Button
              variant={view === 'daily' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('daily')}
            >
              Daily
            </Button>
            <Button
              variant={view === 'weekly' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('weekly')}
            >
              Weekly
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {daysToShow.map((day) => (
          <DailySchedule key={day} day={day} />
        ))}
      </div>
    </div>
  );
};

export default TimetableView;
