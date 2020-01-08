require('dotenv').config();
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

const containerName = process.env.AZURE_CONTAINERNAME;

async function main() {
    const containerClient = blobServiceClient.getContainerClient(containerName);
  
    let i = 1;
    let iter = await containerClient.listBlobsFlat();
    for await (const blob of iter) {
        if (i === 1) {
            const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
            const downloadBlockBlobResponse = await blockBlobClient.download(0);
            await downloadBlockBlobResponse.readableStreamBody.pipe(process.stdout)
        }

    }
}
  
main();
