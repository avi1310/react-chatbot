import logging
import boto3
import json
from botocore.vendored import requests

# Initialize logger and set log level
logger = logging.getLogger()
logger.setLevel(logging.INFO)

session = boto3.Session(
    region_name="us-east-1"
)
sns_client = session.client('sns')
sqs_client = boto3.client('sqs')
sqs = boto3.resource('sqs')
queue_url = 'ENTER QUEUE URL HERE'	
queue = sqs.Queue(queue_url)

def lambda_handler(event, context):
    messages = []
    resp = sqs_client.receive_message(
        QueueUrl=queue_url,
        AttributeNames=['All'],
        MaxNumberOfMessages=1,
        VisibilityTimeout=1,
        WaitTimeSeconds=1
    )
    pp=1
    try:
        print("@@#@#@#@#@#@",resp)
        messages.extend(resp['Messages'])
        m=resp["Messages"]
        mid=resp["Messages"][0]["MessageId"]
        a=(m[0]["Body"])
        b=json.loads(a)
        data=b['currentIntent']['slots']
        phone='+1'+data['Phone']
        qty=data['Quantity']
        cuisine = data['Cuisine']
        city = data['City']
        time=data['Time']
        date=data['Date']
    except KeyError:
        pp=0
    
    
    if pp==1:
        city = '+'.join(city.split())
        l=requests.get('https://maps.googleapis.com/maps/api/geocode/json?address='+city+'&key=ENTER_KEY_HERE')
        l1=json.loads(l.content)
        lat=l1['results'][0]['geometry']['location']['lat']
        lng=l1['results'][0]['geometry']['location']['lng']
        
        suggest=requests.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+str(lat)+','+str(lng)+'&radius=1500&type=restaurant&keyword='+cuisine+'&key=ENTER_KEY_HERE')
        res=json.loads(suggest.content)['results']
        op=[]
        i=1
        tosms=''

        for r in res:
            if len(op)>=3:
                break
            op.append(str(i)+". "+ r['name'] +", located at "+r['vicinity'])
            i+=1
        tosms="Hello! Here are my "+cuisine+" restaurant suggestions for "+str(qty)+" people, for "+str(date)+" at "+ str(time)+":\n\n "+'\n\n '.join(op)+".\n\nEnjoy your meal!"
    
    if pp==1:
        entries = [{'Id': msg['MessageId'], 'ReceiptHandle': msg['ReceiptHandle']} for msg in resp['Messages']]
        resp_del = sqs_client.delete_message_batch(QueueUrl=queue_url, Entries=entries)
    if pp==1:
    # Send message
        response = sns_client.publish(
            PhoneNumber=str(phone),
            Message=tosms,
            MessageAttributes={
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': 'SENDERID'
                },
                'AWS.SNS.SMS.SMSType': {
                    'DataType': 'String',
                    'StringValue': 'Promotional'
                }
            }
        )

    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

    table = dynamodb.Table('bookRestaurantDetails')
    
    
    
    response1 = table.put_item(
      Item={
            'mid': mid,
            'info': { tosms, 
                    json.dumps(resp)
            }
        }
    )
    logger.info(tosms)
    return (tosms)