import jwt from 'jsonwebtoken';

export const shouldBeLoggedId = async (req, res) => {

    console.log(req.userId);
    res.status(200).json({ message: 'You are Authenticated!' });
};

export const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Not authenticated!' });

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(403).json({ message: 'Invalid token!' });

        if (!payload.isAdmin) return res.status(403).json({ message: 'You are not authorized!' });
    });

    res.status(200).json({ message: 'You are Authenticated!' });
};
