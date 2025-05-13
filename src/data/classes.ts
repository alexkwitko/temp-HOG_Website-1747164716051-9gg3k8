export interface ClassType {
  id: string;
  title: string;
  level: string;
  description: string;
  instructor: string;
  image?: string;
  suitableFor?: string[];
  skillsFocus?: string[];
  duration?: number;
}

export const classes: ClassType[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    level: 'Beginner',
    description: 'Learn the core techniques and principles of Brazilian Jiu-Jitsu in a structured and supportive environment.',
    instructor: 'Coach Mike',
    image: 'https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?auto=format&fit=crop&q=80&w=300',
    duration: 60,
    suitableFor: ['Beginners', 'White Belts', 'New Students'],
    skillsFocus: ['Positions', 'Escapes', 'Basic Submissions']
  },
  {
    id: 'all-levels',
    title: 'All Levels',
    level: 'All Levels',
    description: 'Open to practitioners of all skill levels. Classes focus on both fundamental and advanced techniques.',
    instructor: 'Coach Sarah',
    image: 'https://images.unsplash.com/photo-1562771379-36153afc3e08?auto=format&fit=crop&q=80&w=300',
    duration: 75,
    suitableFor: ['All Belt Levels', 'Returning Students'],
    skillsFocus: ['Technique Refinement', 'Drills', 'Live Training']
  },
  {
    id: 'advanced',
    title: 'Advanced',
    level: 'Advanced',
    description: 'For experienced practitioners looking to expand their technical knowledge and refine their skills.',
    instructor: 'Coach Alex',
    image: 'https://images.unsplash.com/photo-1613312980234-115beb40f8f1?auto=format&fit=crop&q=80&w=300',
    duration: 90,
    suitableFor: ['Blue Belt and Above', 'Competition Team'],
    skillsFocus: ['Advanced Techniques', 'Competition Strategy', 'Specialized Positions']
  },
  {
    id: 'kids',
    title: 'Kids Class',
    level: 'Kids',
    description: 'Fun and engaging classes designed specifically for children to learn discipline, respect, and self-defense.',
    instructor: 'Coach Lisa',
    image: 'https://images.unsplash.com/photo-1599232288126-7dbd2127db13?auto=format&fit=crop&q=80&w=300',
    duration: 45,
    suitableFor: ['Children 5-12'],
    skillsFocus: ['Fundamentals', 'Games', 'Coordination']
  },
  {
    id: 'competition',
    title: 'Competition Training',
    level: 'All Levels',
    description: 'Focused training for students preparing for tournaments and competitions.',
    instructor: 'Coach David',
    image: 'https://images.unsplash.com/photo-1611441562191-28d5d2e0086b?auto=format&fit=crop&q=80&w=300',
    duration: 120,
    suitableFor: ['Competition Team', 'Dedicated Students'],
    skillsFocus: ['Competition Tactics', 'Conditioning', 'Intense Drilling']
  },
  {
    id: 'nogi',
    title: 'No-Gi',
    level: 'All Levels',
    description: 'Training without the traditional gi uniform, focusing on techniques that work without gi grips.',
    instructor: 'Coach James',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=300',
    duration: 75,
    suitableFor: ['All Belt Levels'],
    skillsFocus: ['Wrestling', 'Leg Locks', 'Submissions']
  }
]; 