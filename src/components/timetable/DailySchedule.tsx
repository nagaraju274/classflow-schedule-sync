
import React from 'react';
import { useTimetable } from '@/contexts/TimetableContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ClassCard from './ClassCard';

interface DailyScheduleProps {
  day: string;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ day }) => {
  const { getClassesForDay } = useTimetable();
  const { user } = useAuth();
  
  const classes = getClassesForDay(day);
  
  // Sort classes by start time
  const sortedClasses = [...classes].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{day}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedClasses.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No classes scheduled for this day</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedClasses.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailySchedule;
