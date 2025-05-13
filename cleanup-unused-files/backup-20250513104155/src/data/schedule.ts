export interface ScheduleItemType {
  id: string;
  classId: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 = Monday, 7 = Sunday
  startTime: string; // "HH:MM" 24-hour format
  endTime: string; // "HH:MM" 24-hour format
  instructor: string;
  room: string;
}

export const schedule: ScheduleItemType[] = [
  // Monday
  {
    id: '1-0600',
    classId: 'no-gi-grappling',
    dayOfWeek: 1,
    startTime: '06:00',
    endTime: '07:15',
    instructor: 'David Chen',
    room: 'Main Mat'
  },
  {
    id: '1-1000',
    classId: 'beginner-bjj',
    dayOfWeek: 1,
    startTime: '10:00',
    endTime: '11:00',
    instructor: 'John Silva',
    room: 'Main Mat'
  },
  {
    id: '1-1630',
    classId: 'kids-bjj-5-7',
    dayOfWeek: 1,
    startTime: '16:30',
    endTime: '17:15',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '1-1730',
    classId: 'kids-bjj-8-12',
    dayOfWeek: 1,
    startTime: '17:30',
    endTime: '18:30',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '1-1830',
    classId: 'beginner-bjj',
    dayOfWeek: 1,
    startTime: '18:30',
    endTime: '19:30',
    instructor: 'John Silva',
    room: 'Main Mat'
  },
  {
    id: '1-1930',
    classId: 'intermediate-bjj',
    dayOfWeek: 1,
    startTime: '19:45',
    endTime: '21:00',
    instructor: 'John Silva',
    room: 'Main Mat'
  },

  // Tuesday
  {
    id: '2-0600',
    classId: 'beginner-bjj',
    dayOfWeek: 2,
    startTime: '06:00',
    endTime: '07:00',
    instructor: 'Maria Rodriguez',
    room: 'Main Mat'
  },
  {
    id: '2-1000',
    classId: 'womens-only-bjj',
    dayOfWeek: 2,
    startTime: '10:00',
    endTime: '11:00',
    instructor: 'Maria Rodriguez',
    room: 'Main Mat'
  },
  {
    id: '2-1630',
    classId: 'kids-bjj-5-7',
    dayOfWeek: 2,
    startTime: '16:30',
    endTime: '17:15',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '2-1730',
    classId: 'kids-bjj-8-12',
    dayOfWeek: 2,
    startTime: '17:30',
    endTime: '18:30',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '2-1830',
    classId: 'no-gi-grappling',
    dayOfWeek: 2,
    startTime: '18:30',
    endTime: '19:45',
    instructor: 'David Chen',
    room: 'Main Mat'
  },
  {
    id: '2-2000',
    classId: 'competition-training',
    dayOfWeek: 2,
    startTime: '20:00',
    endTime: '21:30',
    instructor: 'David Chen',
    room: 'Main Mat'
  },

  // Wednesday
  {
    id: '3-0600',
    classId: 'intermediate-bjj',
    dayOfWeek: 3,
    startTime: '06:00',
    endTime: '07:15',
    instructor: 'John Silva',
    room: 'Main Mat'
  },
  {
    id: '3-1000',
    classId: 'beginner-bjj',
    dayOfWeek: 3,
    startTime: '10:00',
    endTime: '11:00',
    instructor: 'Maria Rodriguez',
    room: 'Main Mat'
  },
  {
    id: '3-1630',
    classId: 'kids-bjj-5-7',
    dayOfWeek: 3,
    startTime: '16:30',
    endTime: '17:15',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '3-1730',
    classId: 'kids-bjj-8-12',
    dayOfWeek: 3,
    startTime: '17:30',
    endTime: '18:30',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '3-1830',
    classId: 'womens-only-bjj',
    dayOfWeek: 3,
    startTime: '18:30',
    endTime: '19:30',
    instructor: 'Maria Rodriguez',
    room: 'Main Mat'
  },
  {
    id: '3-1945',
    classId: 'advanced-bjj',
    dayOfWeek: 3,
    startTime: '19:45',
    endTime: '21:15',
    instructor: 'John Silva',
    room: 'Main Mat'
  },

  // Thursday
  {
    id: '4-0600',
    classId: 'no-gi-grappling',
    dayOfWeek: 4,
    startTime: '06:00',
    endTime: '07:15',
    instructor: 'David Chen',
    room: 'Main Mat'
  },
  {
    id: '4-1000',
    classId: 'beginner-bjj',
    dayOfWeek: 4,
    startTime: '10:00',
    endTime: '11:00',
    instructor: 'John Silva',
    room: 'Main Mat'
  },
  {
    id: '4-1630',
    classId: 'kids-bjj-5-7',
    dayOfWeek: 4,
    startTime: '16:30',
    endTime: '17:15',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '4-1730',
    classId: 'kids-bjj-8-12',
    dayOfWeek: 4,
    startTime: '17:30',
    endTime: '18:30',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '4-1830',
    classId: 'beginner-bjj',
    dayOfWeek: 4,
    startTime: '18:30',
    endTime: '19:30',
    instructor: 'Maria Rodriguez',
    room: 'Main Mat'
  },
  {
    id: '4-1945',
    classId: 'intermediate-bjj',
    dayOfWeek: 4,
    startTime: '19:45',
    endTime: '21:00',
    instructor: 'John Silva',
    room: 'Main Mat'
  },

  // Friday
  {
    id: '5-0600',
    classId: 'beginner-bjj',
    dayOfWeek: 5,
    startTime: '06:00',
    endTime: '07:00',
    instructor: 'John Silva',
    room: 'Main Mat'
  },
  {
    id: '5-1000',
    classId: 'no-gi-grappling',
    dayOfWeek: 5,
    startTime: '10:00',
    endTime: '11:15',
    instructor: 'David Chen',
    room: 'Main Mat'
  },
  {
    id: '5-1630',
    classId: 'kids-bjj-5-7',
    dayOfWeek: 5,
    startTime: '16:30',
    endTime: '17:15',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '5-1730',
    classId: 'kids-bjj-8-12',
    dayOfWeek: 5,
    startTime: '17:30',
    endTime: '18:30',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '5-1830',
    classId: 'competition-training',
    dayOfWeek: 5,
    startTime: '18:30',
    endTime: '20:00',
    instructor: 'David Chen',
    room: 'Main Mat'
  },

  // Saturday
  {
    id: '6-0900',
    classId: 'beginner-bjj',
    dayOfWeek: 6,
    startTime: '09:00',
    endTime: '10:00',
    instructor: 'John Silva',
    room: 'Main Mat'
  },
  {
    id: '6-1015',
    classId: 'intermediate-bjj',
    dayOfWeek: 6,
    startTime: '10:15',
    endTime: '11:30',
    instructor: 'John Silva',
    room: 'Main Mat'
  },
  {
    id: '6-1000',
    classId: 'kids-bjj-5-7',
    dayOfWeek: 6,
    startTime: '10:00',
    endTime: '10:45',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '6-1100',
    classId: 'kids-bjj-8-12',
    dayOfWeek: 6,
    startTime: '11:00',
    endTime: '12:00',
    instructor: 'Samantha Lee',
    room: 'Kids Mat'
  },
  {
    id: '6-1200',
    classId: 'no-gi-grappling',
    dayOfWeek: 6,
    startTime: '12:00',
    endTime: '13:15',
    instructor: 'David Chen',
    room: 'Main Mat'
  },
  {
    id: '6-1330',
    classId: 'womens-only-bjj',
    dayOfWeek: 6,
    startTime: '13:30',
    endTime: '14:30',
    instructor: 'Maria Rodriguez',
    room: 'Main Mat'
  },

  // Sunday
  {
    id: '7-1000',
    classId: 'advanced-bjj',
    dayOfWeek: 7,
    startTime: '10:00',
    endTime: '11:30',
    instructor: 'John Silva',
    room: 'Main Mat'
  },
  {
    id: '7-1200',
    classId: 'competition-training',
    dayOfWeek: 7,
    startTime: '12:00',
    endTime: '13:30',
    instructor: 'David Chen',
    room: 'Main Mat'
  }
];

export function getDayName(dayOfWeek: number): string {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  return days[dayOfWeek - 1];
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}