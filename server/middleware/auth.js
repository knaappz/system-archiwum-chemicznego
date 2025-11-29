import jwt from "jsonwebtoken";
export const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send({ msg: "Brak tokena autoryzacji" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send({ msg: "Nieprawidłowy token" });
        req.user = decoded;
        next();
    });
}
