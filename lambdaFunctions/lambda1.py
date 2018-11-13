import boto3
import json
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client('sqs')

def lambda_handler(event, context):
    logger.info('@@@@@##',event)
    # TODO implement
    sqsurl = "ENTER QUEUE URL"
    print(event)
    
    try:
        sqs_return = sqs.send_message(QueueUrl=sqsurl, MessageBody=json.dumps(event))
    except:
        return {
            'statusCode': 501,
            'body': 'error'
        }
    
    a = {
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": "Booking Done"
                }
            }
        }
    return a
    
