import path from "path";

export default function(req, file, cb) {
    
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {

        req.fileCheckResult = true;
        return cb(null, true);

    } else {
        req.fileCheckResult = false;
        const error = new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.');
        error.code = 'INVALID_FILE_TYPE';
        return cb(error);
    }
}