import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({success: false, message: "Bạn phải xác thực quyền admin"});
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({success: false, message: "Bạn không có quyền admin"});
        }

        req.adminId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
}

export default adminAuth;