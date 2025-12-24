const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// @route   POST /api/auth/register
// @desc    Register a new user via Supabase Auth
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Use Supabase Auth to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Insert user into users table (assuming RLS allows)
    const { data: userData, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          name: name,
          email: email,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      console.error('Error inserting user:', insertError);
      // Continue anyway, as auth user is created
    }

    res.status(201).json({
      user: data.user,
      session: data.session
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user via Supabase Auth
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use Supabase Auth to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      user: data.user,
      session: data.session
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;