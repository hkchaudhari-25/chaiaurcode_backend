require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter',(req, res) => {
    res.send('we are at twitter route....')
})

app.get('/chaha', (req, res)=>{
    res.send('Take chaha.. even in Unhala..')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})