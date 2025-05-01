
import React from 'react';
import { ClassSession } from '@/contexts/TimetableContext';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ClassCardProps {
  classItem: ClassSession;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';

  return (
    <Card 
      className="class-card overflow-hidden"
      style={{ borderLeft: `4px solid ${classItem.color}` }}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="font-semibold">{classItem.subjectName}</h3>
            <p className="text-sm text-muted-foreground">{classItem.subjectCode}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              {classItem.startTime} - {classItem.endTime}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium">Room</p>
              <p className="text-muted-foreground">{classItem.roomNumber}</p>
            </div>
            
            {!isTeacher && (
              <div>
                <p className="font-medium">Teacher</p>
                <p className="text-muted-foreground">{classItem.teacherName}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
