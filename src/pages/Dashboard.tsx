import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle, XCircle, Clock, ExternalLink, Upload } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState({
    posted: [],
    applied: [],
    inProgress: [],
    completed: []
  });
  const [editing, setEditing] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadProjects();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
          checkProfileCompletion(data);
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const checkProfileCompletion = (profileData) => {
    const requiredFields = ['name', 'tech_stack', 'github_url', 'linkedin_url', 'about'];
    const isComplete = requiredFields.every(field => profileData[field]);
    setIsProfileComplete(isComplete);
  };

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Load posted projects
        const { data: postedProjects } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', user.id);

        // Load projects history
        const { data: projectsHistory } = await supabase
          .from('projects_history')
          .select(`
            *,
            project:projects(*)
          `)
          .or(`developer_id.eq.${user.id},client_id.eq.${user.id}`);

        if (projectsHistory) {
          setProjects({
            posted: postedProjects || [],
            applied: projectsHistory.filter(p => p.status === 'pending'),
            inProgress: projectsHistory.filter(p => p.status === 'in_progress'),
            completed: projectsHistory.filter(p => p.status === 'completed')
          });
        }
      }
    } catch (error) {
      toast.error('Error loading projects');
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${profile.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        await updateProfile({ ...profile, avatar_url: publicUrl });
        toast.success('Profile image updated');
      } catch (error) {
        toast.error('Error uploading image');
      }
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile(updatedProfile);
      checkProfileCompletion(updatedProfile);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {!isProfileComplete && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Profile incomplete - Some features are restricted
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            updateProfile(profile);
          }} className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={profile.avatar_url || 'https://via.placeholder.com/150'}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                <Upload className="w-5 h-5 inline mr-2" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                value={profile.about || ''}
                onChange={e => setProfile({...profile, about: e.target.value})}
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
              <input
                type="text"
                placeholder="e.g., React, Node.js, Python"
                value={profile.tech_stack ? profile.tech_stack.join(', ') : ''}
                onChange={e => setProfile({
                  ...profile,
                  tech_stack: e.target.value.split(',').map(s => s.trim())
                })}
                className="mt-1 block w-full rounded-lg border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
              <input
                type="url"
                value={profile.github_url || ''}
                onChange={e => setProfile({...profile, github_url: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin_url || ''}
                onChange={e => setProfile({...profile, linkedin_url: e.target.value})}
                className="mt-1 block w-full rounded-lg border-gray-300"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={profile.avatar_url || 'https://via.placeholder.com/150'}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-gray-600">{profile.user_type}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">About</h4>
              <p className="text-gray-600">{profile.about || 'No description provided'}</p>
            </div>
            <div className="space-y-2">
              <p><strong>Tech Stack:</strong> {profile.tech_stack?.join(', ') || 'Not set'}</p>
              {profile.github_url && (
                <p>
                  <strong>GitHub:</strong>
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-600 hover:text-indigo-500">
                    <ExternalLink className="w-4 h-4 inline" />
                  </a>
                </p>
              )}
              {profile.linkedin_url && (
                <p>
                  <strong>LinkedIn:</strong>
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-600 hover:text-indigo-500">
                    <ExternalLink className="w-4 h-4 inline" />
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold">Posted Projects</h2>
          </div>
          <div className="space-y-4">
            {projects.posted.map(project => (
              <div key={project.id} className="border-b pb-2">
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-semibold">In Progress</h2>
          </div>
          <div className="space-y-4">
            {projects.inProgress.map(ph => (
              <div key={ph.id} className="border-b pb-2">
                <h3 className="font-medium">{ph.project.title}</h3>
                <p className="text-sm text-gray-500">Started: {new Date(ph.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">Completed</h2>
          </div>
          <div className="space-y-4">
            {projects.completed.map(ph => (
              <div key={ph.id} className="border-b pb-2">
                <h3 className="font-medium">{ph.project.title}</h3>
                <p className="text-sm text-gray-500">Completed: {new Date(ph.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}