import json
import urllib.parse
import boto3
import os


def lambda_handler(event, context):
    # Get the bucket name and file/key name
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    try:

        # print(json.dumps(event))

        # Read the file
        print('############# Loading function ################')
        s3 = boto3.client('s3')
        response = s3.get_object(Bucket=bucket, Key=key)

        text = response["Body"].read().decode()
        print('############# Body in the file ################')
        print(text)

        print('############# Reversed words ################')
        body = text.split()
        for i in range(len(body)):
            body[i] = body[i][::-1]

        # creating a string from the list
        reversedWords = (" ").join(body)
        print(reversedWords)

        finalWrite = '############# Loading function ################\n' + \
                     '############# Body in the file ################\n' + text + \
                     '\n############# Reversed words   ################\n' + reversedWords + \
                     '\n############# End of filed     ################\n'

        # writing to the tmp storage
        with open("/tmp/output.txt", "w") as myfile:
            myfile.write(finalWrite)

        # check if the output file got created
        print(os.listdir('/tmp/'))

        # Reading the output file
        with open("/tmp/output.txt", "r") as myfile:
            response = myfile.read()
            print(response)

        return 'Success!'

    except Exception as e:
        print(e)
        raise e