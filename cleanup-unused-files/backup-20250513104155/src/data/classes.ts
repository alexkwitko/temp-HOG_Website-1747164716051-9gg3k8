export interface ClassType {
  id: string;
  title: string;
  description: string;
  image: string;
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  ageGroup: 'Adults' | 'Kids' | 'Teens' | 'All Ages';
  duration: number; // in minutes
  instructor?: string;
}

export const classes: ClassType[] = [
  {
    id: 'beginner-bjj',
    title: 'Beginner BJJ Fundamentals',
    description: 'This class focuses on the essential techniques and principles of Brazilian Jiu-Jitsu. You\'ll learn proper body positioning, basic submissions, escapes, and the foundations that will support your entire BJJ journey. Perfect for those with 0-12 months of experience.',
    image: 'https://images.pexels.com/photos/9382863/pexels-photo-9382863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 'Beginner',
    ageGroup: 'Adults',
    duration: 60,
    instructor: 'John Silva'
  },
  {
    id: 'intermediate-bjj',
    title: 'Intermediate BJJ',
    description: 'Building on the fundamentals, this class introduces more complex techniques, chain attacks, and defense sequences. Focus is on refining details, timing, and developing your personal game. Recommended for those with at least 1 year of consistent training.',
    image: 'https://images.pexels.com/photos/8534469/pexels-photo-8534469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 'Intermediate',
    ageGroup: 'Adults',
    duration: 75,
    instructor: 'John Silva'
  },
  {
    id: 'advanced-bjj',
    title: 'Advanced BJJ',
    description: 'For experienced practitioners, this class covers sophisticated techniques, advanced concepts, and competition strategies. Training includes situational sparring and problem-solving against specific attacks and positions. Typically for blue belt and above.',
    image: 'https://images.pexels.com/photos/7991575/pexels-photo-7991575.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 'Advanced',
    ageGroup: 'Adults',
    duration: 90,
    instructor: 'David Chen'
  },
  {
    id: 'no-gi-grappling',
    title: 'No-Gi Grappling',
    description: 'This class focuses on submission grappling without the traditional gi. Learn wrestling takedowns, clinch work, and submissions that are specific to no-gi competition. Training emphasizes speed, athleticism, and adaptability.',
    image: 'https://images.pexels.com/photos/6765852/pexels-photo-6765852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 'All Levels',
    ageGroup: 'Adults',
    duration: 75,
    instructor: 'David Chen'
  },
  {
    id: 'competition-training',
    title: 'Competition Training',
    description: 'Designed specifically for those preparing for tournaments. Classes focus on competition-specific strategies, conditioning, and high-intensity drilling and sparring to simulate competition environments. Open to all levels who want to compete.',
    image: 'https://images.pexels.com/photos/6765852/pexels-photo-6765852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 'All Levels',
    ageGroup: 'Adults',
    duration: 90,
    instructor: 'David Chen'
  },
  {
    id: 'womens-only-bjj',
    title: 'Women\'s Only BJJ',
    description: 'Created to provide a supportive environment for women to learn and train BJJ. The class covers all aspects of jiu-jitsu with an emphasis on self-defense applications and techniques that work well for women\'s body types and common self-defense scenarios.',
    image: 'https://images.pexels.com/photos/6765843/pexels-photo-6765843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 'All Levels',
    ageGroup: 'Adults',
    duration: 60,
    instructor: 'Maria Rodriguez'
  },
  {
    id: 'kids-bjj-5-7',
    title: 'Kids BJJ (Ages 5-7)',
    description: 'Designed for our youngest students, this class develops coordination, listening skills, and basic movements through fun games and drills. Children learn discipline, respect, and foundational jiu-jitsu techniques through age-appropriate activities.',
    image: 'https://images.pexels.com/photos/8613312/pexels-photo-8613312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 'Beginner',
    ageGroup: 'Kids',
    duration: 45,
    instructor: 'Samantha Lee'
  },
  {
    id: 'kids-bjj-8-12',
    title: 'Kids BJJ (Ages 8-12)',
    description: 'This class builds on basic skills with more technical instruction and light situational training. Focus is on developing confidence, anti-bullying strategies, and core BJJ techniques through structured curriculum and positive reinforcement.',
    image: 'https://images.pexels.com/photos/8613326/pexels-photo-8613326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 'All Levels',
    ageGroup: 'Kids',
    duration: 60,
    instructor: 'Samantha Lee'
  }
];