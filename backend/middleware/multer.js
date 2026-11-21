import multer from 'multer'
import fs from 'fs'

// git does not keep empty folders, so create ./public on the server if missing
fs.mkdirSync("./public", { recursive: true })

let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});
 let upload = multer({storage})

 export default upload
