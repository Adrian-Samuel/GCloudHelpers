const {
  Storage
} = require('@google-cloud/storage');
const stream = require('stream');
  // Credentials for G-storage API access generated as JSON from IAM permissions of Google APIs 
 // https://cloud.google.com/iam/docs/overview

const project_ID = require('./credentials.json').project_id;
const getPublicURL = async (bucketName, fileName, fileType) => `https://storage.googleapis.com/${bucketName}/${fileName}.${fileType}`;

const uploadFile = async (bucketName, fileName, fileExtension, fileMetaType) => {
  
  const storage = new Storage({
    projectId: project_ID, //G-Cloud project name
    keyFilename: 'credentials.json'
  });
  const bucket = storage.bucket(bucketName);
  const uploadDocument = bucket.file(`${fileName}.${fileExtension}`);
  const bufferStream = new stream.PassThrough();
  bufferStream.end('hello, what here, who');

  // stream the files into the cloud, specify types and 
  bufferStream.pipe(uploadDocument.createWriteStream({
    // Meta data defined here: https://cloud.google.com/storage/docs/metadata  
    metadata: {
        contentType: fileMetaType,
      },
      public: true, // Makes the document publicly available, other options are available
    }))
    .on('error', async (err) => {
      console.log("There was an error", err);
      // Handle errors here
    })
    .on('finish', async () => {
      console.log("The file has been successfully uploaded to google");
      
      // Logging out file URL here
      console.log(await getPublicURL(bucketName, fileName, fileExtension));

    });

}

uploadFile('bucket-name', 'file-name', 'csv', 'text/csv')
