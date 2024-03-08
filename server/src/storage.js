import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (destination) => {

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            const destinationPath = path.join(__dirname, `../src/static/uploads/${destination}`);
            console.log(__dirname)
            cb(null, destinationPath);
        },
        filename: function(req, file, cb) {
            const newFileName = uuidv4() + '.jpg';
            req.newFileName = newFileName
            cb(null, newFileName);
        }
    });

    return storage

}