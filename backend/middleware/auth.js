const supabase = require('../config/db');

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token with Supabase
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Set the auth token for Supabase client
    supabase.auth.setAuth(actualToken);
    
    // Get user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Add user from payload
    req.user = { userId: user.id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};