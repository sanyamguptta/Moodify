const ImageKit = require("@imagekit/nodejs").default;

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

// function for uploading file to the imagkit
async function uploadFile({buffer, filename, folder=""}) {

    const file = await client.files.upload({
        file: await ImageKit.toFile(Buffer.from(buffer)),
        fileName: filename,
        folder
    })

    // returning file
    return file;
}





module.exports = {
    uploadFile
}