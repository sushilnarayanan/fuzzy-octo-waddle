import React, { useState, useEffect } from 'react';
import { X, Clock, Send, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ApplicationModalProps {
  project: {
    id: string;
    title: string;
    budget: number;
    timeframe: string;
  };
  onClose: () => void;
}

export default function ApplicationModal({ project, onClose }: ApplicationModalProps) {
  const [proposal, setProposal] = useState('');
  const [rate, setRate] = useState('');
  const [availability, setAvailability] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        const requiredFields = ['name', 'tech_stack', 'github_url', 'portfolio_url', 'linkedin_url'];
        setIsProfileComplete(requiredFields.every(field => profile[field]));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isProfileComplete) {
      toast.error('Please complete your profile before applying');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('projects_history')
        .insert([{
          project_id: project.id,
          developer_id: user.id,
          status: 'pending',
          proposal,
          rate: Number(rate),
          availability
        }]);

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Apply to Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isProfileComplete && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please complete your profile before applying to projects.
                  <a href="/dashboard" className="font-medium underline ml-1">
                    Go to Dashboard
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Project Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Project:</span>
              <span className="font-medium">{project.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Budget:</span>
              <span className="font-medium">${project.budget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timeframe:</span>
              <span className="font-medium">{project.timeframe}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Proposal
            </label>
            <textarea
              required
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Describe how you would approach this project..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate (USD)
            </label>
            <input
              type="number"
              required
              min="1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Availability
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Can start next week, available 20hrs/week"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isProfileComplete}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}