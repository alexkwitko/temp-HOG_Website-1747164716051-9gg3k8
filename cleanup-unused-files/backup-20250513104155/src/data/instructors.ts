export interface InstructorType {
  id: string;
  name: string;
  role: string;
  belt: string;
  image: string;
  bio: string;
  achievements: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export const instructors: InstructorType[] = [
  {
    id: 'john-silva',
    name: 'John Silva',
    role: 'Head Coach & Founder',
    belt: 'Black Belt 3rd Degree',
    image: 'https://images.pexels.com/photos/7991572/pexels-photo-7991572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'John began training Brazilian Jiu-Jitsu in 1998 under the legendary Rickson Gracie. With over two decades of experience, he has competed and medaled in numerous IBJJF competitions and has trained world champions. His teaching philosophy emphasizes technical precision and practical application.',
    achievements: [
      'IBJJF World Champion (2x)',
      'ADCC North American Trials Winner',
      'Pan American Champion',
      'Certified IBJJF Referee'
    ],
    socialMedia: {
      instagram: 'https://instagram.com/johnsilvabjj',
      facebook: 'https://facebook.com/johnsilvabjj'
    }
  },
  {
    id: 'maria-rodriguez',
    name: 'Maria Rodriguez',
    role: 'Head Competition Coach',
    belt: 'Black Belt',
    image: 'https://images.pexels.com/photos/7991578/pexels-photo-7991578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Maria has been training for over 15 years and is passionate about developing champions. Her classes focus on advanced techniques and competition strategies, making her students consistent medal winners at major tournaments. Her systematic approach to training has produced multiple world-class competitors.',
    achievements: [
      'IBJJF European Champion',
      'No-Gi World Championship Bronze Medalist',
      'Pan American Silver Medalist',
      'ADCC Trials Finalist'
    ],
    socialMedia: {
      instagram: 'https://instagram.com/mariarodriguezbjj',
      twitter: 'https://twitter.com/mariarodriguezbjj'
    }
  }
];