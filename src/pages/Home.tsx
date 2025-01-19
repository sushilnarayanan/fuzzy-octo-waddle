import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, UserPlus, LogIn } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import AuthModal from '../components/AuthModal';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [message, setMessage] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState([
    { type: 'bot', content: "Hi! I'm DevRent Assistant. What kind of help are you looking for today? You can ask for help with:\n\n• Building a project\n• Debugging an issue\n• Learning a concept" }
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChat(prev => [...prev, { type: 'user', content: message }]);

    setTimeout(() => {
      setChat(prev => [...prev, {
        type: 'bot',
        content: "I've found some developers who can help you with that. Here are a few options:",
        developers: sampleDevelopers.slice(0, 3)
      }]);
    }, 1000);

    setMessage('');
  };

  const handleBooking = (developer) => {
    if (!user) {
      setShowAuth(true);
    } else {
      setSelectedDeveloper(developer);
    }
  };

  const openAuth = (signup: boolean) => {
    setIsSignUp(signup);
    setShowAuth(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!user && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-indigo-900">Join DevRent Today</h2>
            <p className="text-indigo-700">Connect with expert developers or showcase your skills</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => openAuth(true)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <UserPlus className="w-5 h-5" />
              <span>Sign Up</span>
            </button>
            <button
              onClick={() => openAuth(false)}
              className="flex items-center space-x-2 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-[600px] overflow-y-auto p-6 space-y-4">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${
                msg.type === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                
                {msg.developers && (
                  <div className="mt-4 space-y-4">
                    {msg.developers.map((dev, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow">
                        <div className="flex items-center space-x-4">
                          <img src={dev.avatar} alt={dev.name} className="w-12 h-12 rounded-full" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{dev.name}</h3>
                            <p className="text-sm text-gray-600">{dev.skills.join(', ')}</p>
                          </div>
                          <div className="ml-auto">
                            <span className="text-lg font-semibold text-gray-900">${dev.hourlyRate}/hr</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleBooking(dev)}
                          className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you need help with..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {selectedDeveloper && (
        <BookingModal
          developer={selectedDeveloper}
          onClose={() => setSelectedDeveloper(null)}
        />
      )}
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          defaultIsSignUp={isSignUp}
        />
      )}
    </div>
  );
}

const sampleDevelopers = [
  {
    name: "Sarah Chen",
    skills: ["React", "Node.js", "TypeScript"],
    hourlyRate: 85,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 4.9
  },
  {
    name: "Alex Rodriguez",
    skills: ["Python", "Django", "AWS"],
    hourlyRate: 95,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 4.8
  },
  {
    name: "Emily Johnson",
    skills: ["Vue.js", "Firebase", "UI/UX"],
    hourlyRate: 75,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 4.9
  }
];