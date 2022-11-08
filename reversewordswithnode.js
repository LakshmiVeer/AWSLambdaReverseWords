console.log('############# Loading function ################')
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const fsPromises = require('fs').promises;
const path = require('path')


function reverseString(str) {
      var words = [];
      words = str.match(/\S+/g);
      var result = "";
      for (var i = 0; i < words.length; i++) {
         result += words[i].split('').reverse().join('') + " ";
      }
  return result
}


exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    
    try {
        // const { ContentType } = await s3.getObject(params).promise();
        // console.log('CONTENT TYPE:', ContentType);
        const response = await s3.getObject(params).promise(); // await the promise
        const text = response.Body.toString('utf-8');

//      const text = await fsPromises.readFile(path.join(__dirname, 'transaction.txt'), 'utf8');

        console.log('############# Body in the file ################');
        console.log(text);

//      Reverse the words
        console.log('############# Reversed words ################');
        const reversedWords = reverseString(text);
        console.log(reversedWords);

        let finalWrite = '############# Body in the file ################\n' + text +
           '\n############# Reversed words   ################\n' + reversedWords +
           '\n############# End of file      ################\n';

        await fsPromises.writeFile(path.join(__dirname, '../../tmp/outputNode.txt'), finalWrite);
        const outputText = await fsPromises.readFile(path.join(__dirname, '../../tmp/outputNode.txt'), 'utf8');
        console.log(outputText);

    } catch (err) {
        console.log(err);
    }
};