/*
  # Update profiles table with additional fields

  1. Changes
    - Add 'about' text field for user descriptions
    - Add 'profile_completed' boolean field to track profile completion status
  
  2. Security
    - Add policy to allow public viewing of completed profiles
*/

-- Add new columns (skipping user_type as it already exists)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS about text,
ADD COLUMN IF NOT EXISTS profile_completed boolean DEFAULT false;

-- Update RLS policies for new fields
CREATE POLICY "Public users can view completed profiles" ON profiles
  FOR SELECT USING (
    profile_completed = true
    OR auth.uid() = id
  );