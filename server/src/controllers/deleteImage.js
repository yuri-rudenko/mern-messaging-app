import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDirectory = path.resolve(__dirname, '..');

export default function(req, res) {
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