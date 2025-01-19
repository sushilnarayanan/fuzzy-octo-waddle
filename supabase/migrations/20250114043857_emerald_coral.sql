/*
  # Update Profile Policies

  1. Changes
    - Drop existing profile viewing policy
    - Create new comprehensive RLS policies for profiles table
  
  2. Security
    - Public viewing policy
    - Insert policy for authenticated users
    - Update policy for own profile
    - Delete policy for own profile
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Public users can view completed profiles" ON profiles;

-- Create new policies
CREATE POLICY "Anyone can view profiles"
ON profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON profiles
FOR DELETE
USING (auth.uid() = id);