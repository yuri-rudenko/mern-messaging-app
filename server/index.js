import express from 'express';
import cors from 'cors';

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('static/uploads'));

const start = async () => {
    try {
        
        app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
        // await mongoose.connect(process.env.MONGODB_URI);

    } 

    catch (error) { 
        console.log(error);
    }
};

start();