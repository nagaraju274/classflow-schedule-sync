
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTimetable } from '@/contexts/TimetableContext';
import { Clock, Users, BookOpen } from 'lucide-react';
import ClassCard from '@/components/timetable/ClassCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { classes, subjects, getClassesForDay } = useTimetable();
  
  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = getClassesForDay(today);
  
  // Sort classes by start time
  const sortedTodayClasses = [...todayClasses].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  // Get tomorrow's day name
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
  const tomorrowClasses = getClassesForDay(tomorrowName);

  // Calculate statistics based on role
  const totalClasses = user?.role === 'admin' ? classes.length 
    : user?.role === 'teacher' ? classes.filter(c => c.teacherId === user.id).length
    : classes.length; // For students, all classes are potentially theirs

  const totalSubjects = subjects.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Across all days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              In your curriculum
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              {today}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Schedule */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
            <CardDescription>{today}</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedTodayClasses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No classes scheduled for today</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedTodayClasses.map(classItem => (
                  <ClassCard key={classItem.id} classItem={classItem} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Tomorrow's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Tomorrow's Classes</CardTitle>
            <CardDescription>{tomorrowName}</CardDescription>
          </CardHeader>
          <CardContent>
            {tomorrowClasses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No classes scheduled for tomorrow</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tomorrowClasses.map(classItem => (
                  <ClassCard key={classItem.id} classItem={classItem} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
