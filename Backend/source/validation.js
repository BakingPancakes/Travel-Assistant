/**
 * Middleware for validating user data
 */
export function validateUserData(req, res, next) {
    const { name, email } = req.body;
    
    // Basic validation
    if (!name || !email) {
        return res.status(400).json({
            message: 'Name and email are required'
        });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email format'
        });
    }
    
    // If validation passes, continue to next middleware/controller
    next();
}