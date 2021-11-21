const AWS_BUCKET_NAME="ema-imagenes"
const AWS_BUCKET_REGION="us-east-1"
const AWS_ACCESS_KEY= "AKIAQEKNUV6KQCXHUSML"
const AWS_SECRET_KEY= "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"

var AWS = require('aws-sdk');
const fs = require('fs')
const crypto = require('crypto');
const { promisify } = require( 'util');
const randomBytes = promisify(crypto.randomBytes)

//configuracion de conexion a AWS

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    "region": "us-east-1",
    signatureVersion: 'v4'
    
}); 
var s3 = new AWS.S3();

//funcion para generar un URL con el cual se puede subir una imagen hacia el bucket de S3
 async function generateUploadURL(name, type) {
    const rawBytes = randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: AWS_BUCKET_NAME,
        Key: name,
        ContentType: type,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}

exports.generateUploadURL= generateUploadURL