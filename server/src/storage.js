import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function checkFileType(req, file, cb){
    
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

export default () => {

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            const destinationPath = path.join(__dirname, `../static/uploads`);
            cb(null, destinationPath);
        },
        filename: function(req, file, cb) {
            const newFileName = uuidv4() + path.extname(file.originalname);
            req.newFileName = newFileName
            cb(null, newFileName);
        }
    });

    return storage
}