const app = require('./app')

const mongoose = require('mongoose');


const {DB_HOST} = process.env;

mongoose.connect(DB_HOST)
.then(()=>{
    app.listen(3000);
    console.log("Процес пішов впевнено уперед!!")
})
.catch(error=>{
  console.log(error.message);
  process.exit(1)
})
/* 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 */


