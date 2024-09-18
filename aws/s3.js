
const{PutObjectCommand} = require( "@aws-sdk/client-s3")
const {AssumeRole} = require("./iam.js")

const saveImage = async(obj)=>{
  try{
    const s3Client = await AssumeRole() //These creates an S3Client with STS for 3sec... enough for the request to be sent and authorized
    console.log("STSclient created with temporary credentials")
 

    const saveImageCommand = new PutObjectCommand({
        Bucket: "chat-app-files-storage",              // Your S3 bucket name
        Key: `images/${obj.image.name}`,          // The S3 key (path + filename)
        Body: obj.image.data,                   // The file content as binary
        ContentType: "image/jpeg"            // MIME type of the image
      })

      await s3Client.send(saveImageCommand)
      return `https://chat-app-files-storage.s3.us-west-2.amazonaws.com/${saveImageCommand.input.Key}`
    }
    catch(error){
      console.log(error)
    }
}

module.exports = {saveImage}

