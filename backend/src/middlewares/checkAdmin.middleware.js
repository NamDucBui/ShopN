const checkAdminMiddleware = (req, res, next) => {
    if(req.query.isAdmin === 'true'){
        console.log("Hợp lệ")
        next()
    } else {
        res.status(403).json({message: "Bạn không có quyền truy cập!"})
    }
}

module.exports = checkAdminMiddleware