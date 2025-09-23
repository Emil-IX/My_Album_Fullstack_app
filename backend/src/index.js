
import app from './server.js';
import colors from 'colors';


const port = process.env.PORT || 3000;



app.listen(port, ()=>{
    console.log(colors.blue.bold(`Server is running on port: ${port}`));
})