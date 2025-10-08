const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, 'uploads/'),
    filename: (req, file, callback) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 100000)
        callback(null, unique + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, callback) => {
    const allowTypes = /jpeg|jpg|png|gif|webp/
    const isExtensionValid = allowTypes.test(path.extname(file.originalname).toLowerCase())
    const isMimetypeValid = allowTypes.test(file.mimetype)

    if (isExtensionValid && isMimetypeValid)
        callback(null, true)
    else
        callback(new Error('Seules les images sont autoriées'))
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 octet * 1024 (Ko) * 1024 (Mo)
})

module.exports = upload