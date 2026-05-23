import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
  // Read token from HttpOnly cookie
  const token = req.cookies?.fv_token
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorised' })
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.tailor = decoded
    next()
  } catch (err) {
    // Session expired or invalid token
    res.status(401).json({ error: 'Session expired. Please log in again.' })
  }
}
