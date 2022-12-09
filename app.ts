import express, {NextFunction, Request, Response} from "express";
import * as path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import s3Controller from "./aws/s3.controller";

dotenv.config({
    path: path.resolve(__dirname, `.env`)
});

const app = express();

//Content-Type: application/json
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/s3", s3Controller);

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    return response.status(404).send("Page Not Found!");
});

app.listen(3001, () => {
    console.log(`listening on 3001`);
});