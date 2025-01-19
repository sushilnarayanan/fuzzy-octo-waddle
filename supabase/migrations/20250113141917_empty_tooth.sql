/*
  # Create projects table and related schemas

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `budget` (numeric)
      - `category` (text)
      - `timeframe` (text)
      - `status` (text)
      - `client_id` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `skills` (text[])

  2. Security
    - Enable RLS on `projects` table
    - Add policies for authenticated users
*/

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  budget numeric NOT NULL,
  category text NOT NULL CHECK (category IN ('build', 'debug', 'learn')),
  timeframe text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
  client_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  skills text[]
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view projects
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- Only authenticated users can create projects
CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only project owners can update their projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = client_id);