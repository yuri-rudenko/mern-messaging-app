import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDirectory = path.resolve(__dirname, '..');

class fileController {

    deleteImage(req, res) {
        try {
    
            const {image} = req.body;
            if(!image) throw new Error('File has no name');
            const imagePath = path.resolve(parentDirectory, '..', 'static', 'uploads', image);
            fs.rm(imagePath, () => {res.status(200).json({message: `File ${image} has been deleted`})});
        } 
        catch (error) {
            res.status(400).json(error.message);
        }
    }

    async uploadImage(req, res, next) {
        try {
           
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "No files were uploaded." });
            }
    
            const fileNames = req.files.length === 1 
                ? req.files[0].filename 
                : req.files.map(file => file.filename);
    
            if (req.fileCheckResult) {
                res.status(200).json(fileNames);
            } else {
                res.status(400).json({ message: "File type error" });
            }
        } catch (error) {
            
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

}

export default new fileController()
