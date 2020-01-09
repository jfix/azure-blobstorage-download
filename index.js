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
            console.log(`NO container exists with this name: ${containerName}`);
            return;
        }
        const blobClient = containerClient.getBlobClient(blobName);
        if (!(await blobClient.exists())) {
            console.log(`NO blob exists with this name: ${blobName}`);
            return;
        }
        const buffer = await blobClient.downloadToBuffer();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(process.stdout);
    } catch(e) {
        console.log(`ERROR: ${e}`)
    }
}
  
downloadBlob('archives-prepress-1994', '419413-1.7');
