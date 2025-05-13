export interface Instructor {
  id: string;
  name: string;
  title: string;
  belt: string;
  bio: string;
  image: string;
  specialties?: string[];
  achievements?: string[];
  instagram?: string;
  twitter?: string;
  website?: string;
}

export const instructors: Instructor[] = [
  {
    id: 'michael-johnson',
    name: 'Michael Johnson',
    title: 'Head Coach',
    belt: 'Black Belt',
    bio: 'Michael has been training Brazilian Jiu-Jitsu for over 15 years and has won multiple championships at the highest levels. He founded House of Grappling with the mission to create an inclusive training environment where practitioners of all levels can thrive.',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop',
    specialties: ['Competition Training', 'Guard Passing', 'Self-Defense'],
    achievements: ['IBJJF World Champion', 'ADCC Competitor', 'Pan American Gold Medalist'],
    instagram: '@michaeljohnsonbjj',
  },
  {
    id: 'sarah-williams',
    name: 'Sarah Williams',
    title: 'Kids Program Director',
    belt: 'Brown Belt',
    bio: 'Sarah specializes in teaching children and has developed a comprehensive curriculum that focuses on discipline, respect, and technical development. Her background in child education helps her connect with students of all ages.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&auto=format&fit=crop',
    specialties: ['Kids Training', 'Beginners Instruction', 'Women\'s Self-Defense'],
    achievements: ['Kids BJJ Program Development Certification', 'State Championship Gold Medalist'],
    instagram: '@sarahwilliamsbjj',
  },
  {
    id: 'james-rodriguez',
    name: 'James Rodriguez',
    title: 'No-Gi Coach',
    belt: 'Black Belt',
    bio: 'James has a background in wrestling and specializes in no-gi training. His dynamic teaching style emphasizes movement, pressure, and tactical awareness. He has competed successfully in both gi and no-gi tournaments.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e6349?w=400&auto=format&fit=crop',
    specialties: ['No-Gi Techniques', 'Wrestling', 'Leg Locks'],
    achievements: ['ADCC Trials Finalist', 'No-Gi World Champion'],
    instagram: '@jamesrodriguezbjj',
    twitter: '@jamesbjj'
  },
  {
    id: 'alex-chen',
    name: 'Alex Chen',
    title: 'Competition Team Coach',
    belt: 'Black Belt',
    bio: 'Alex leads our competition team and has a reputation for detailed technical instruction. With a background in both judo and BJJ, he brings a unique perspective to takedowns and ground work.',
    image: 'https://images.unsplash.com/photo-1556149211-c3d123163e94?w=400&auto=format&fit=crop',
    specialties: ['Competition Strategy', 'Advanced Techniques', 'Judo Integration'],
    achievements: ['Multiple-time Black Belt World Medalist', 'National Judo Champion'],
    instagram: '@alexchenbjj',
    website: 'www.alexchenbjj.com'
  }
]; 