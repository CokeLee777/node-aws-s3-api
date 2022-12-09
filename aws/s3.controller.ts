import express, {NextFunction, Request, Response} from "express";
import {AWSS3Error, NotEnoughRequestDataError} from "./s3.error";
import * as s3Service from "./s3.service";

const router = express.Router();

router.get("/buckets/file", (request: Request, response: Response, next: NextFunction) => {
    const requestBody = validateRequestBody(request);
    s3Service.getFileFromBucket(requestBody.bucketName, requestBody.fileName)
        .then((data) => {
            return response.status(200).json({
                contents: data
            });
        })
        .catch((error) => {
            next(error);
        });
});

router.post("/buckets/file", (request: Request, response: Response, next: NextFunction) => {
    const requestBody = validateRequestBody(request);
    s3Service.uploadFileToBucket(requestBody.bucketName, requestBody.fileName)
        .then(() => {
            return response.sendStatus(200);
        })
        .catch((error) => {
            next(error);
        });
});

router.delete("/buckets/file", (request: Request, response: Response, next: NextFunction) => {
    const requestBody = validateRequestBody(request);
    s3Service.deleteFileFromBucket(requestBody.bucketName, requestBody.fileName)
        .then(() => {
            return response.sendStatus(200);
        })
        .catch((error) => {
            next(error);
        });
});

router.use((error: Error, request: Request, response: Response, next: NextFunction) => {

    if(error instanceof AWSS3Error ||
        error instanceof NotEnoughRequestDataError){
        return response.status(error.code).json({message: error.message});
    } else {
        return response.status(500).json({message: error.message});
    }
})

const validateRequestBody = (request: Request) => {
    const requestBody = request.body;
    if(requestBody.bucketName === undefined
        || requestBody.fileName === undefined){
        throw new NotEnoughRequestDataError(400, "요청 파라미터가 부족합니다");
    }

    return requestBody;
}

export default router;