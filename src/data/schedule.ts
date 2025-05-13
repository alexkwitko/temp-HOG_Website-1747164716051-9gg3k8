export interface ScheduleItemType {
  id: string;
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string; // Format: "HH:MM" (24-hour)
  classId: string; // References classes.id
  roomName: string;
  instructorName?: string;
}

export const schedule: ScheduleItemType[] = [
  // Monday
  {
    id: 'mon-1',
    dayOfWeek: 1,
    startTime: '06:30',
    endTime: '07:30',
    classId: 'all-levels',
    roomName: 'Main Mat'
  },
  {
    id: 'mon-2',
    dayOfWeek: 1,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'fundamentals',
    roomName: 'Main Mat'
  },
  {
    id: 'mon-3',
    dayOfWeek: 1,
    startTime: '16:00',
    endTime: '16:45',
    classId: 'kids',
    roomName: 'Kids Mat'
  },
  {
    id: 'mon-4',
    dayOfWeek: 1,
    startTime: '17:30',
    endTime: '19:00',
    classId: 'all-levels',
    roomName: 'Main Mat'
  },
  {
    id: 'mon-5',
    dayOfWeek: 1,
    startTime: '19:15',
    endTime: '20:30',
    classId: 'nogi',
    roomName: 'Main Mat'
  },
  
  // Tuesday
  {
    id: 'tue-1',
    dayOfWeek: 2,
    startTime: '06:30',
    endTime: '07:30',
    classId: 'fundamentals',
    roomName: 'Main Mat'
  },
  {
    id: 'tue-2',
    dayOfWeek: 2,
    startTime: '12:00',
    endTime: '13:00',
    classId: 'all-levels',
    roomName: 'Main Mat'
  },
  {
    id: 'tue-3',
    dayOfWeek: 2,
    startTime: '17:00',
    endTime: '17:45',
    classId: 'kids',
    roomName: 'Kids Mat'
  },
  {
    id: 'tue-4',
    dayOfWeek: 2,
    startTime: '18:00',
    endTime: '19:15',
    classId: 'fundamentals',
    roomName: 'Main Mat'
  },
  {
    id: 'tue-5',
    dayOfWeek: 2,
    startTime: '19:30',
    endTime: '21:00',
    classId: 'advanced',
    roomName: 'Main Mat'
  },
  
  // Wednesday
  {
    id: 'wed-1',
    dayOfWeek: 3,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'all-levels',
    roomName: 'Main Mat'
  },
  {
    id: 'wed-2',
    dayOfWeek: 3,
    startTime: '16:00',
    endTime: '16:45',
    classId: 'kids',
    roomName: 'Kids Mat'
  },
  {
    id: 'wed-3',
    dayOfWeek: 3,
    startTime: '17:30',
    endTime: '19:00',
    classId: 'all-levels',
    roomName: 'Main Mat'
  },
  {
    id: 'wed-4',
    dayOfWeek: 3,
    startTime: '19:15',
    endTime: '20:30',
    classId: 'nogi',
    roomName: 'Main Mat'
  },
  
  // Thursday
  {
    id: 'thu-1',
    dayOfWeek: 4,
    startTime: '06:30',
    endTime: '07:30',
    classId: 'fundamentals',
    roomName: 'Main Mat'
  },
  {
    id: 'thu-2',
    dayOfWeek: 4,
    startTime: '12:00',
    endTime: '13:00',
    classId: 'all-levels',
    roomName: 'Main Mat'
  },
  {
    id: 'thu-3',
    dayOfWeek: 4,
    startTime: '17:00',
    endTime: '17:45',
    classId: 'kids',
    roomName: 'Kids Mat'
  },
  {
    id: 'thu-4',
    dayOfWeek: 4,
    startTime: '18:00',
    endTime: '19:15',
    classId: 'fundamentals',
    roomName: 'Main Mat'
  },
  {
    id: 'thu-5',
    dayOfWeek: 4,
    startTime: '19:30',
    endTime: '21:00',
    classId: 'competition',
    roomName: 'Competition Area'
  },
  
  // Friday
  {
    id: 'fri-1',
    dayOfWeek: 5,
    startTime: '06:30',
    endTime: '07:30',
    classId: 'all-levels',
    roomName: 'Main Mat'
  },
  {
    id: 'fri-2',
    dayOfWeek: 5,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'fundamentals',
    roomName: 'Main Mat'
  },
  {
    id: 'fri-3',
    dayOfWeek: 5,
    startTime: '16:00',
    endTime: '16:45',
    classId: 'kids',
    roomName: 'Kids Mat'
  },
  {
    id: 'fri-4',
    dayOfWeek: 5,
    startTime: '17:30',
    endTime: '19:00',
    classId: 'nogi',
    roomName: 'Main Mat'
  },
  {
    id: 'fri-5',
    dayOfWeek: 5,
    startTime: '19:15',
    endTime: '21:00',
    classId: 'open-mat',
    roomName: 'Main Mat'
  },
  
  // Saturday
  {
    id: 'sat-1',
    dayOfWeek: 6,
    startTime: '10:00',
    endTime: '11:00',
    classId: 'fundamentals',
    roomName: 'Main Mat'
  },
  {
    id: 'sat-2',
    dayOfWeek: 6,
    startTime: '11:15',
    endTime: '12:30',
    classId: 'advanced',
    roomName: 'Main Mat'
  },
  {
    id: 'sat-3',
    dayOfWeek: 6,
    startTime: '12:45',
    endTime: '14:15',
    classId: 'open-mat',
    roomName: 'Main Mat'
  }
];

// Helper functions
export function getDayName(dayNumber: number): string {
  const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayNumber];
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hoursNum = parseInt(hours);
  
  if (hoursNum === 0) {
    return `12:${minutes} AM`;
  } else if (hoursNum < 12) {
    return `${hoursNum}:${minutes} AM`;
  } else if (hoursNum === 12) {
    return `12:${minutes} PM`;
  } else {
    return `${hoursNum - 12}:${minutes} PM`;
  }
} 