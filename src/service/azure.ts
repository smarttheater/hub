import {
    Aborter,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    SharedKeyCredential,
    StorageURL,
    IBlockBlobUploadOptions,
    // uploadStreamToBlockBlob,
    // uploadFileToBlockBlob
} from '@azure/storage-blob'
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

async function showContainerNames(aborter: Aborter, serviceURL: ServiceURL) {

    let response;
    let marker;

    do {
        response = await serviceURL.listContainersSegment(aborter, marker);
        marker = response.marker;
        for (let container of response.containerItems) {
            console.log(` - ${container.name}`);
        }
    } while (marker);
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

export async function execute(containerName: string, blobName: string, content: string | Buffer, contentType: string) {

    // const localFilePath = "./readme.md";

    // const containerName = "demo";
    // const blobName = "quickstart.txt";
    // const content = "hello!";
    // const localFilePath = "./readme.md";

    const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
    const pipeline = StorageURL.newPipeline(credentials);
    const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);

    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);

    const aborter = Aborter.timeout(30 * ONE_MINUTE);

    console.log("Containers:")
    await showContainerNames(aborter, serviceURL);

    try {
        await containerURL.create(aborter);
        console.log(`Container: "${containerName}" is created`);
    } catch (error) {
        if (error.statusCode !== 409) {
            console.error(error)
        }
    }

    // const option: IBlockBlobUploadOptions = { blobHTTPHeaders: { blobContentType: "text/xml" } }
    const option: IBlockBlobUploadOptions = { blobHTTPHeaders: { blobContentType: contentType } }
    await blockBlobURL.upload(aborter, content, content.length, option);
    console.log(`Blob "${blobName}" is uploaded`);

    return blockBlobURL.url
}


// execute().then(() => console.log("Done")).catch((e) => console.log(e));
