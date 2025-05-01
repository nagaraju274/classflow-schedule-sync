
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';

export interface ClassSession {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  roomNumber: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  color: string;
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface TimetableContextProps {
  classes: ClassSession[];
  subjects: Subject[];
  timeSlots: TimeSlot[];
  addClass: (newClass: Omit<ClassSession, 'id'>) => void;
  updateClass: (id: string, updatedClass: Partial<ClassSession>) => void;
  removeClass: (id: string) => void;
  getClassesForDay: (day: string) => ClassSession[];
  getClassById: (id: string) => ClassSession | undefined;
  hasConflict: (newClass: Omit<ClassSession, 'id'> & { id?: string }) => boolean;
}

// Generate sample data
const generateSampleData = () => {
  const subjects: Subject[] = [
    { id: '1', name: 'Mathematics', code: 'MATH101', description: 'Introduction to Calculus', color: '#9b87f5' },
    { id: '2', name: 'Physics', code: 'PHYS101', description: 'Classical Mechanics', color: '#7E69AB' },
    { id: '3', name: 'Computer Science', code: 'CS101', description: 'Introduction to Programming', color: '#6E59A5' },
    { id: '4', name: 'English', code: 'ENG101', description: 'Academic Writing', color: '#D946EF' },
    { id: '5', name: 'History', code: 'HIST101', description: 'World History', color: '#F97316' },
  ];

  const sampleClasses: ClassSession[] = [
    {
      id: '1',
      subjectId: '1',
      subjectName: 'Mathematics',
      subjectCode: 'MATH101',
      teacherId: '2',
      teacherName: 'Jane Smith',
      roomNumber: 'A101',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      color: '#9b87f5'
    },
    {
      id: '2',
      subjectId: '2',
      subjectName: 'Physics',
      subjectCode: 'PHYS101',
      teacherId: '2',
      teacherName: 'Jane Smith',
      roomNumber: 'B202',
      day: 'Monday',
      startTime: '11:00',
      endTime: '12:30',
      color: '#7E69AB'
    },
    {
      id: '3',
      subjectId: '3',
      subjectName: 'Computer Science',
      subjectCode: 'CS101',
      teacherId: '2',
      teacherName: 'Jane Smith',
      roomNumber: 'C303',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '10:30',
      color: '#6E59A5'
    },
    {
      id: '4',
      subjectId: '4',
      subjectName: 'English',
      subjectCode: 'ENG101',
      teacherId: '2',
      teacherName: 'Jane Smith',
      roomNumber: 'D404',
      day: 'Wednesday',
      startTime: '11:00',
      endTime: '12:30',
      color: '#D946EF'
    },
    {
      id: '5',
      subjectId: '5',
      subjectName: 'History',
      subjectCode: 'HIST101',
      teacherId: '2',
      teacherName: 'Jane Smith',
      roomNumber: 'E505',
      day: 'Thursday',
      startTime: '14:00',
      endTime: '15:30',
      color: '#F97316'
    }
  ];

  const timeSlots: TimeSlot[] = [
    { id: '1', start: '08:00', end: '08:50' },
    { id: '2', start: '09:00', end: '10:30' },
    { id: '3', start: '10:40', end: '11:30' },
    { id: '4', start: '11:00', end: '12:30' },
    { id: '5', start: '12:40', end: '13:30' },
    { id: '6', start: '13:40', end: '14:30' },
    { id: '7', start: '14:00', end: '15:30' },
    { id: '8', start: '15:40', end: '16:30' },
    { id: '9', start: '16:40', end: '17:30' },
  ];

  return { subjects, sampleClasses, timeSlots };
};

const TimetableContext = createContext<TimetableContextProps | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { subjects, sampleClasses, timeSlots } = generateSampleData();
  const [classes, setClasses] = useState<ClassSession[]>(sampleClasses);
  const { user } = useAuth();

  // Add a new class
  const addClass = (newClass: Omit<ClassSession, 'id'>) => {
    if (hasConflict(newClass)) {
      toast.error('There is a time conflict with another class');
      return;
    }
    
    const newId = Math.random().toString(36).substr(2, 9);
    const classWithId = { ...newClass, id: newId };
    
    setClasses(prev => [...prev, classWithId]);
    toast.success('Class added to schedule');
  };

  // Update an existing class
  const updateClass = (id: string, updatedClass: Partial<ClassSession>) => {
    if (hasConflict({ ...getClassById(id)!, ...updatedClass, id })) {
      toast.error('There is a time conflict with another class');
      return;
    }
    
    setClasses(prev =>
      prev.map(cls => (cls.id === id ? { ...cls, ...updatedClass } : cls))
    );
    toast.success('Class updated successfully');
  };

  // Remove a class
  const removeClass = (id: string) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
    toast.success('Class removed from schedule');
  };

  // Get classes for a specific day
  const getClassesForDay = (day: string): ClassSession[] => {
    if (!user) return [];
    
    return classes.filter(cls => {
      // For students and teachers, filter based on their role
      if (user.role === 'student') {
        // In a real app, we'd filter by studentId
        return cls.day === day;
      } else if (user.role === 'teacher') {
        return cls.teacherId === user.id && cls.day === day;
      }
      // Admins can see all classes
      return cls.day === day;
    });
  };

  // Get class by ID
  const getClassById = (id: string): ClassSession | undefined => {
    return classes.find(cls => cls.id === id);
  };

  // Check for time conflicts
  const hasConflict = (newClass: Omit<ClassSession, 'id'> & { id?: string }): boolean => {
    // Skip checking the class against itself when updating
    return classes.some(cls => {
      if (newClass.id === cls.id) return false;
      
      if (cls.day !== newClass.day) return false;
      
      const newStart = new Date(`2023-01-01T${newClass.startTime}`);
      const newEnd = new Date(`2023-01-01T${newClass.endTime}`);
      const existingStart = new Date(`2023-01-01T${cls.startTime}`);
      const existingEnd = new Date(`2023-01-01T${cls.endTime}`);
      
      // Check if there's an overlap
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  return (
    <TimetableContext.Provider
      value={{
        classes,
        subjects,
        timeSlots,
        addClass,
        updateClass,
        removeClass,
        getClassesForDay,
        getClassById,
        hasConflict,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = (): TimetableContextProps => {
  const context = useContext(TimetableContext);
  
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  
  return context;
};
