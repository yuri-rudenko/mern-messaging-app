import path from "path";

export default function(req, file, cb){
    
    const filetypes = /jpeg|jpg|png/;
    
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
        req.fileCheckResult = true;
        return cb(null, true);
    } else {
        req.fileCheckResult = false;
        return cb(null, false);
    }
}