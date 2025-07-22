-- Insert sample problems
INSERT INTO public.problems (title, description, content, difficulty, topic, xp_reward, time_limit, hints, solution) VALUES
(
  'Quadratic Equation Challenge',
  'Solve complex quadratic equations with multiple variables',
  'Find all real solutions to the equation x² + 6x + 9 = 0, and determine the nature of the roots.

**Requirements:**
1. Find all real solutions
2. Determine the discriminant
3. Classify the nature of the roots
4. Show your complete working

**Additional Questions:**
- What is the vertex of the parabola y = x² + 6x + 9?
- At what point(s) does this parabola intersect the x-axis?',
  'Medium',
  'Algebra',
  150,
  30,
  '["Try factoring the quadratic expression first.", "Notice that this might be a perfect square trinomial.", "The discriminant formula is b² - 4ac."]',
  'The equation x² + 6x + 9 = 0 can be factored as (x + 3)² = 0, giving x = -3 as a repeated root.'
),
(
  'Geometric Proof Master',
  'Prove geometric theorems using advanced techniques',
  'Prove that in any triangle ABC, if D is the midpoint of BC, then AD² = (2AB² + 2AC² - BC²)/4.

**Given:**
- Triangle ABC
- D is the midpoint of BC

**To Prove:**
AD² = (2AB² + 2AC² - BC²)/4

**Instructions:**
Use coordinate geometry or vector methods to prove this theorem.',
  'Hard',
  'Geometry',
  250,
  45,
  '["Consider placing the triangle in a coordinate system.", "Use the midpoint formula.", "Apply the distance formula."]',
  'Using coordinate geometry, place B at origin and C at (2a, 0). Then D is at (a, 0) and the result follows from distance calculations.'
),
(
  'Number Theory Basics',
  'Explore prime numbers and divisibility rules',
  'Find all prime numbers p such that p² + 2 is also prime.

**Requirements:**
1. List all such prime numbers p
2. Prove that your list is complete
3. Explain why no other primes work

**Hint:** Consider the cases p = 2, p = 3, and p > 3 separately.',
  'Easy',
  'Number Theory',
  100,
  20,
  '["Start with small primes.", "Consider remainders when dividing by 3.", "Think about even and odd numbers."]',
  'Only p = 3 works. For p = 2: p² + 2 = 6 (not prime). For p = 3: p² + 2 = 11 (prime). For p > 3: p² + 2 ≡ 1 + 2 ≡ 0 (mod 3), so divisible by 3.'
);

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, condition_type, condition_value, xp_reward) VALUES
('First Steps', 'Solve your first problem', '🎯', 'problems_solved', 1, 50),
('Problem Solver', 'Solve 10 problems', '🧩', 'problems_solved', 10, 100),
('Math Master', 'Solve 50 problems', '🏆', 'problems_solved', 50, 250),
('Speed Demon', 'Solve a problem in under 5 minutes', '⚡', 'speed_solve', 300, 100),
('Streak Warrior', 'Maintain a 7-day solving streak', '🔥', 'streak', 7, 150),
('Perfectionist', 'Achieve 95% accuracy over 20 problems', '💎', 'accuracy', 95, 200);
