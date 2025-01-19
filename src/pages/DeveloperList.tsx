import React, { useState } from 'react';
import { Star, Clock, Code2 } from 'lucide-react';
import BookingModal from '../components/BookingModal';

export default function DeveloperList() {
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [skillFilter, setSkillFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredDevelopers = developers.filter(dev => {
    if (skillFilter !== 'all' && !dev.skills.includes(skillFilter)) return false;
    if (priceFilter === 'under50' && dev.hourlyRate >= 50) return false;
    if (priceFilter === '50-100' && (dev.hourlyRate < 50 || dev.hourlyRate > 100)) return false;
    if (priceFilter === '100plus' && dev.hourlyRate <= 100) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Available Developers</h1>
        <div className="flex space-x-4">
          <select 
            className="rounded-lg border-gray-300 text-sm"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="all">All Skills</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="Python">Python</option>
          </select>
          <select 
            className="rounded-lg border-gray-300 text-sm"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">Price: Any</option>
            <option value="under50">Under $50/hr</option>
            <option value="50-100">$50-100/hr</option>
            <option value="100plus">$100+/hr</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredDevelopers.map((dev, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-start space-x-4">
              <img
                src={dev.avatar}
                alt={dev.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{dev.name}</h3>
                    <p className="text-gray-600 text-sm">{dev.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">${dev.hourlyRate}/hr</p>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm">{dev.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Code2 className="w-4 h-4 mr-2" />
                    <span>{dev.skills.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{dev.availability}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm">{dev.bio}</p>
            </div>
            <button 
              onClick={() => setSelectedDeveloper(dev)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Book Session
            </button>
          </div>
        ))}
      </div>

      {selectedDeveloper && (
        <BookingModal
          developer={selectedDeveloper}
          onClose={() => setSelectedDeveloper(null)}
        />
      )}
    </div>
  );
}

const developers = [
  {
    name: "Sarah Chen",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript"],
    hourlyRate: 85,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 4.9,
    availability: "Available next week",
    bio: "Full stack developer with 5+ years of experience. Specialized in React and Node.js. Love solving complex problems and mentoring."
  },
  {
    name: "Alex Rodriguez",
    title: "Backend Developer",
    skills: ["Python", "Django", "AWS"],
    hourlyRate: 95,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 4.8,
    availability: "Available tomorrow",
    bio: "Backend developer focused on scalable architectures. Expert in Python and cloud services. Passionate about clean code."
  },
  {
    name: "Emily Johnson",
    title: "Frontend Developer",
    skills: ["Vue.js", "Firebase", "UI/UX"],
    hourlyRate: 75,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 4.9,
    availability: "Available today",
    bio: "Frontend specialist with an eye for design. Creating beautiful and functional user interfaces is my passion."
  },
  {
    name: "David Kim",
    title: "Mobile Developer",
    skills: ["React Native", "iOS", "Android"],
    hourlyRate: 90,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    rating: 4.7,
    availability: "Available this week",
    bio: "Mobile app developer with experience in both iOS and Android. Specialized in React Native and cross-platform development."
  }
];