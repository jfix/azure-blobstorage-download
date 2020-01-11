require('dotenv').config();
const stream = require('stream');
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

// Enter your storage account name and shared key
const account = process.env.AZURE_STORAGEACCOUNT;
const accountKey = process.env.AZURE_ACCESSKEY;


// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only avaiable in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

async function downloadBlob(containerName, blobName) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        if (!(await containerClient.exists())) {
            throw new Error(`No container exists with this name: ${containerName}`);
        }
        const blobClient = containerClient.getBlobClient(blobName);
        if (!(await blobClient.exists())) {
            throw new Error(`No blob exists with this name: ${blobName}`);
        }
        const buffer = await blobClient.downloadToBuffer();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(process.stdout);
    } catch(e) {
        console.log(`${e}`);
        return e;
    }
}
  
downloadBlob('archives-prepress-199', '419413-1.7');
