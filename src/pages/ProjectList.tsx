import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Tag } from 'lucide-react';
import ApplicationModal from '../components/ApplicationModal';
import { supabase } from '../lib/supabase';
import AuthModal from '../components/AuthModal';

export default function ProjectList() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');

  useEffect(() => {
    loadProjects();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
  };

  const handleApply = (project) => {
    if (!user) {
      setShowAuth(true);
    } else {
      setSelectedProject(project);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;
    if (budgetFilter === 'under100' && project.budget >= 100) return false;
    if (budgetFilter === '100-500' && (project.budget < 100 || project.budget > 500)) return false;
    if (budgetFilter === '500plus' && project.budget <= 500) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Available Projects</h1>
        <div className="flex space-x-4">
          <select 
            className="rounded-lg border-gray-300 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="build">Build</option>
            <option value="debug">Debug</option>
            <option value="learn">Learn</option>
          </select>
          <select 
            className="rounded-lg border-gray-300 text-sm"
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
          >
            <option value="all">All Budgets</option>
            <option value="under100">Under $100</option>
            <option value="100-500">$100-500</option>
            <option value="500plus">$500+</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-xl">{project.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  project.category === 'build' ? 'bg-blue-100 text-blue-800' :
                  project.category === 'debug' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {project.category}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-indigo-600">${project.budget}</p>
                <p className="text-sm text-gray-500">{project.timeframe}</p>
              </div>
            </div>
            
            <p className="mt-4 text-gray-600">{project.description}</p>
            
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Posted {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                <span>{project.skills.join(', ')}</span>
              </div>
            </div>

            <button 
              onClick={() => handleApply(project)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ApplicationModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}