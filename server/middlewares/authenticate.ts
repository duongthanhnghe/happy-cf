import jwt from 'jsonwebtoken'

export const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Thiếu token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "")
    console.log("decoded")
    console.log(decoded)
    req.user = decoded   // Gắn user vào request
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }
}