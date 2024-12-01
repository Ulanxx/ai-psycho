import React, { useMemo } from 'react';
import { TherapistCard } from './TherapistCard';
import { useThemeStore } from '../stores/theme';
import { Shuffle } from 'lucide-react';
import { useChatStore } from '../stores/chat';

export const therapists = [
  {
    id: '1',
    name: 'Sandra Tatroe, LCSW',
    title: 'Psychotherapist',
    rating: 4.65,
    reviewCount: 23,
    videoAvailable: true,
    insurance: ['Aetna'],
    availability: {
      today: 0,
      tomorrow: 4,
      nextDay: 4
    },
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Highly recommended · Excellent wait time',
    isSponsored: true
  },
  {
    id: '2',
    name: 'Dr. Ziara Kurys, PsyD',
    title: 'Psychologist',
    rating: 5.00,
    reviewCount: 15,
    videoAvailable: true,
    insurance: ['Aetna', 'Choice'],
    availability: {
      today: 0,
      tomorrow: 2,
      nextDay: 3
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Excellent wait time',
    isSponsored: false
  },
  {
    id: '3',
    name: 'Dr. Marcus Chen, PhD',
    title: 'Clinical Psychologist',
    rating: 4.92,
    reviewCount: 38,
    videoAvailable: true,
    insurance: ['Aetna', 'Choice', 'UnitedHealth'],
    availability: {
      today: 2,
      tomorrow: 3,
      nextDay: 1
    },
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Highly recommended',
    isSponsored: false
  },
  {
    id: '4',
    name: 'Emma Rodriguez, LMFT',
    title: 'Marriage & Family Therapist',
    rating: 4.88,
    reviewCount: 45,
    videoAvailable: true,
    insurance: ['Aetna'],
    availability: {
      today: 0,
      tomorrow: 0,
      nextDay: 2
    },
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Popular provider · Good wait time',
    isSponsored: false
  },
  {
    id: '5',
    name: 'Dr. James Wilson, MD',
    title: 'Psychiatrist',
    rating: 4.95,
    reviewCount: 62,
    videoAvailable: true,
    insurance: ['Aetna', 'Choice'],
    availability: {
      today: 1,
      tomorrow: 3,
      nextDay: 2
    },
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Highly rated · Excellent wait time',
    isSponsored: true
  },
  {
    id: '6',
    name: 'Dr. Sarah Kim, PsyD',
    title: 'Child Psychologist',
    rating: 4.78,
    reviewCount: 28,
    videoAvailable: true,
    insurance: ['Aetna', 'Choice'],
    availability: {
      today: 0,
      tomorrow: 2,
      nextDay: 4
    },
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Good wait time',
    isSponsored: false
  },
  {
    id: '7',
    name: 'Michael Thompson, LCSW',
    title: 'Clinical Social Worker',
    rating: 4.82,
    reviewCount: 34,
    videoAvailable: true,
    insurance: ['Aetna'],
    availability: {
      today: 3,
      tomorrow: 2,
      nextDay: 1
    },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Available today',
    isSponsored: false
  },
  {
    id: '8',
    name: 'Dr. Rachel Greene, PhD',
    title: 'Behavioral Psychologist',
    rating: 4.91,
    reviewCount: 51,
    videoAvailable: true,
    insurance: ['Aetna', 'Choice'],
    availability: {
      today: 0,
      tomorrow: 4,
      nextDay: 3
    },
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Popular provider · Excellent wait time',
    isSponsored: true
  },
  {
    id: '9',
    name: 'David Martinez, LMHC',
    title: 'Mental Health Counselor',
    rating: 4.73,
    reviewCount: 19,
    videoAvailable: true,
    insurance: ['Aetna'],
    availability: {
      today: 1,
      tomorrow: 2,
      nextDay: 2
    },
    image: 'https://images.unsplash.com/photo-1563807894768-f28bee0d37b6?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Available today',
    isSponsored: false
  },
  {
    id: '10',
    name: 'Dr. Lisa Wang, PsyD',
    title: 'Clinical Psychologist',
    rating: 4.87,
    reviewCount: 42,
    videoAvailable: true,
    insurance: ['Aetna', 'Choice'],
    availability: {
      today: 0,
      tomorrow: 3,
      nextDay: 4
    },
    image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?auto=format&fit=crop&q=80&w=300&h=300',
    waitTime: 'Highly recommended · Good wait time',
    isSponsored: false
  }
];

interface ChatStore {
  // ... 现有的 store 接口 ...
  selectedTherapistIds: string[];
  setSelectedTherapistIds: (ids: string[]) => void;
}

export function TherapistList() {
  const { isDark } = useThemeStore();
  const { selectedTherapistIds, setSelectedTherapistIds } = useChatStore();

  // 如果没有选中的医生，随机选择两个
  const initializeTherapists = () => {
    if (!selectedTherapistIds?.length) {
      const shuffled = [...therapists].sort(() => Math.random() - 0.5);
      const newIds = shuffled.slice(0, 2).map(t => t.id);
      setSelectedTherapistIds(newIds);
      return newIds;
    }
    return selectedTherapistIds;
  };

  const currentTherapists = useMemo(() => {
    const ids = initializeTherapists();
    return therapists.filter(t => ids.includes(t.id));
  }, [selectedTherapistIds]);

  const handleShuffle = () => {
    const shuffled = [...therapists]
      .filter(t => !selectedTherapistIds.includes(t.id))
      .sort(() => Math.random() - 0.5);
    const newIds = shuffled.slice(0, 2).map(t => t.id);
    setSelectedTherapistIds(newIds);
  };

  return (
    <div className="p-3 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">
          Recommended Therapists
        </h3>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 transition-colors"
        >
          <Shuffle className="w-4 h-4" />
          <span>Change</span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {currentTherapists.map((therapist) => (
          <TherapistCard key={therapist.id} therapist={therapist} />
        ))}
      </div>
    </div>
  );
}