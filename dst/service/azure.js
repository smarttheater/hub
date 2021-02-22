"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const storage_blob_1 = require("@azure/storage-blob");
// import * as filetype from 'file-type'
// import * as fs from 'fs'
// const {
//     Aborter,
//     BlockBlobURL,
//     ContainerURL,
//     ServiceURL,
//     SharedKeyCredential,
//     StorageURL,
//     uploadStreamToBlockBlob,
//     uploadFileToBlockBlob
// } = require('@azure/storage-blob');
// const fs = require("fs");
// const path = require("path");
// if (process.env.NODE_ENV !== "production") {
//     require("dotenv").config();
// }
const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME || "";
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY || "";
// const ONE_MEGABYTE = 1024 * 1024;
// const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;
function showContainerNames(aborter, serviceURL) {
    return __awaiter(this, void 0, void 0, function* () {
        let response;
        let marker;
        do {
            response = yield serviceURL.listContainersSegment(aborter, marker);
            marker = response.marker;
            for (let container of response.containerItems) {
                console.log(` - ${container.name}`);
            }
        } while (marker);
    });
}
// async function uploadLocalFile(aborter: Aborter, containerURL: ContainerURL, filePath: string) {
//     filePath = path.resolve(filePath);
//     const fileName = path.basename(filePath);
//     const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);
//     const ft = filetype(fs.readFileSync(filePath));
//     const mime = ft ? ft.mime : "";
//     const option: IBlockBlobUploadOptions = { blobHTTPHeaders: { blobContentType: mime } }
//     return await uploadFileToBlockBlob(aborter, filePath, blockBlobURL, option);
// }
// async function uploadStream(aborter: Aborter, containerURL: any, filePath: any) {
//     filePath = path.resolve(filePath);
//     const fileName = path.basename(filePath).replace('.md', '-stream.md');
//     const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);
//     const stream = fs.createReadStream(filePath, {
//         highWaterMark: FOUR_MEGABYTES,
//     });
//     const uploadOptions = {
//         bufferSize: FOUR_MEGABYTES,
//         maxBuffers: 5,
//     };
//     return await uploadStreamToBlockBlob(
//         aborter,
//         stream,
//         blockBlobURL,
//         uploadOptions.bufferSize,
//         uploadOptions.maxBuffers);
// }
// async function showBlobNames(aborter: Aborter, containerURL: ContainerURL) {
//     let response;
//     let marker;
//     do {
//         response = await containerURL.listBlobFlatSegment(aborter);
//         marker = response.marker;
//         for (let blob of response.segment.blobItems) {
//             console.log(` - ${blob.name}`);
//         }
//     } while (marker);
// }
function execute(containerName, blobName, content, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        // const localFilePath = "./readme.md";
        // const containerName = "demo";
        // const blobName = "quickstart.txt";
        // const content = "hello!";
        // const localFilePath = "./readme.md";
        const credentials = new storage_blob_1.SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
        const pipeline = storage_blob_1.StorageURL.newPipeline(credentials);
        const serviceURL = new storage_blob_1.ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);
        const containerURL = storage_blob_1.ContainerURL.fromServiceURL(serviceURL, containerName);
        const blockBlobURL = storage_blob_1.BlockBlobURL.fromContainerURL(containerURL, blobName);
        const aborter = storage_blob_1.Aborter.timeout(30 * ONE_MINUTE);
        console.log("Containers:");
        yield showContainerNames(aborter, serviceURL);
        try {
            yield containerURL.create(aborter);
            console.log(`Container: "${containerName}" is created`);
        }
        catch (error) {
            if (error.statusCode !== 409) {
                console.error(error);
            }
        }
        // const option: IBlockBlobUploadOptions = { blobHTTPHeaders: { blobContentType: "text/xml" } }
        const option = { blobHTTPHeaders: { blobContentType: contentType } };
        yield blockBlobURL.upload(aborter, content, content.length, option);
        console.log(`Blob "${blobName}" is uploaded`);
        return blockBlobURL.url;
    });
}
exports.execute = execute;
// execute().then(() => console.log("Done")).catch((e) => console.log(e));
