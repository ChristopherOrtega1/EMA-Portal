const AWS_BUCKET_NAME="ema-imag"
const AWS_BUCKET_REGION="us-east-1"
const AWS_ACCESS_KEY= "AKIAQEKNUV6K5B6LJCFV"
const AWS_SECRET_KEY= "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"

var AWS = require('aws-sdk');
const fs = require('fs')

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    "region": "us-east-1" 
}); 
var s3 = new AWS.S3();


//uploads a file 
function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)

    console.log(file)

    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Body: fileStream,
        Key: file.name

    }

    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile