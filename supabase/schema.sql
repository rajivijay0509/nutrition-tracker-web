-- Supabase Schema for Nutrition Tracker
-- Run this in your Supabase SQL Editor

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  height_cm INTEGER,
  gender TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Food Entries
CREATE TABLE IF NOT EXISTS food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  calories INTEGER,
  protein_g DECIMAL(10,2),
  carbs_g DECIMAL(10,2),
  fat_g DECIMAL(10,2),
  fiber_g DECIMAL(10,2),
  meal_type TEXT, -- breakfast, lunch, dinner, snack
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Food entries policies
CREATE POLICY "Users can view own food entries" ON food_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries" ON food_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food entries" ON food_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food entries" ON food_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Wellness Logs
CREATE TABLE IF NOT EXISTS wellness_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight_kg DECIMAL(10,2),
  water_ml INTEGER,
  sleep_hours DECIMAL(4,2),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  mood TEXT,
  notes TEXT,
  logged_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE wellness_logs ENABLE ROW LEVEL SECURITY;

-- Wellness logs policies
CREATE POLICY "Users can view own wellness logs" ON wellness_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness logs" ON wellness_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wellness logs" ON wellness_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wellness logs" ON wellness_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, height_cm, gender)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    (NEW.raw_user_meta_data->>'height_cm')::INTEGER,
    NEW.raw_user_meta_data->>'gender'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_food_entries_logged_at ON food_entries(logged_at);
CREATE INDEX IF NOT EXISTS idx_wellness_logs_user_id ON wellness_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_logs_logged_at ON wellness_logs(logged_at);
