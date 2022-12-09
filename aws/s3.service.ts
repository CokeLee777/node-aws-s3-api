import s3 from "../config/s3.config";
import * as fs from "fs";
import * as path from "path";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import {AWSError} from "aws-sdk";
import {DeleteObjectOutput, GetObjectOutput} from "aws-sdk/clients/s3";
import SendData = ManagedUpload.SendData;
import {AWSS3Error} from "./s3.error";

export const getFileFromBucket = async (bucketName: string, fileName: string) => {

    const getParams = {
        Bucket: bucketName,
        Key: fileName
    }

    return s3.getObject(getParams, function(error: AWSError, data: GetObjectOutput) {
        // Handle any error and exit
        if (error){
            throw new AWSS3Error(500, "파일 조회에 실패하였습니다");
        } else {
            console.log(`Get file successful=${data.Body}`);
        }
    });
}

export const uploadFileToBucket = async (bucketName: string, fileName: string) => {

    const filePath = path.join(__dirname, `../static/upload/${fileName}`);
    const fileStream = await fs.createReadStream(filePath);
    await fileStream.on('error', (error: Error) => {
        console.log('File Error', error);
    });

    const uploadParams = {
        Bucket: bucketName,
        Key: path.basename(filePath),
        Body: fileStream
    };

    s3.upload(uploadParams, (error: Error, data: SendData) => {
        if (error) {
            throw new AWSS3Error(500, "파일 업로드에 실패하였습니다");
        } else {
            console.log(`File upload successful=${data.Key}`);
        }
    });
}

export const deleteFileFromBucket = async (bucketName: string, fileName: string) => {

    const getParams = {
        Bucket: bucketName,
        Key: fileName
    }

    s3.deleteObject(getParams, function(error: AWSError, data: DeleteObjectOutput) {
        // Handle any error and exit
        if (error){
            throw new AWSS3Error(500, "파일 삭제를 실패하였습니다");
        } else {
            console.log(`Delete file successful=${data}`);
        }
    });
}
