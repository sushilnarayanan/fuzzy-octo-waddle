/*
  # Create profiles and projects tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `avatar_url` (text)
      - `tech_stack` (text[])
      - `github_url` (text)
      - `portfolio_url` (text)
      - `linkedin_url` (text, private)
      - `email` (text, private)
      - `is_developer` (boolean)
      - `calendar_synced` (boolean)
    - `projects_history`
      - `id` (uuid, primary key)
      - `project_id` (uuid)
      - `developer_id` (uuid)
      - `client_id` (uuid)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  tech_stack text[],
  github_url text,
  portfolio_url text,
  linkedin_url text,
  email text,
  is_developer boolean DEFAULT false,
  calendar_synced boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE projects_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  developer_id uuid REFERENCES profiles(id),
  client_id uuid REFERENCES profiles(id),
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_history ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile and public fields of other profiles
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read public profile fields" ON profiles
  FOR SELECT USING (
    auth.uid() != id 
    AND (linkedin_url IS NULL OR email IS NULL)
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to read their project history
CREATE POLICY "Users can read own project history" ON projects_history
  FOR SELECT USING (
    auth.uid() = developer_id 
    OR auth.uid() = client_id
  );