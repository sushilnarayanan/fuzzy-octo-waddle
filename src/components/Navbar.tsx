import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Users, PlusCircle, Layout, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(supabase.auth.getUser());

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="w-8 h-8" />
            <span className="font-bold text-xl">DevRent</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/projects" className="hover:text-indigo-200">
              <Layout className="w-5 h-5" />
            </Link>
            <Link to="/developers" className="hover:text-indigo-200">
              <Users className="w-5 h-5" />
            </Link>
            <Link to="/create-project" className="hover:text-indigo-200">
              <PlusCircle className="w-5 h-5" />
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-200">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="hover:text-indigo-200">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuth(true)} className="hover:text-indigo-200">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </nav>
  );
}