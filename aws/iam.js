const{ AssumeRoleCommand, STSClient } = require( "@aws-sdk/client-sts")
const  {S3Client} = require("@aws-sdk/client-s3");
//This function takes the requested temporary credentials  (Line # 37) to re initialize a new STSClient with STS for security workload.
const AssumeRole =  async ()=>{
    
      try{
      const credentials = await GetTemporaryCredentials()
        
      const s3Client = new S3Client({
          "region": "us-west-2",
          "Credentials" : {
              "AccessKeyId": `${credentials.AccessKeyId}`,
              "SecretAccessKey": `${credentials.SecretAccessKey}`,
              "SessionToken": `${credentials.SessionToken}`
          }
      })
      
      return s3Client
        
    }
    catch(error){
      console.log("Problem assuming role")
          console.log(error)
      }

}


//What I think we are doing is that we are using the created user without any hardcoded access key but a STS for secure access by using the AssumeRole method
const GetTemporaryCredentials = async () => {
  try {
    // Returns a set of temporary security credentials that you can use to
    // access Amazon Web Services resources that you might not normally
    // have access to.
    //AssumeRoleComand returns a command object to be sent to the AWS Server. In this case requesting temporary credentials through STS
    const command = new AssumeRoleCommand({
      // The Amazon Resource Name (ARN) of the role to assume.
      //This role has a trust policy attached to it where it says who can use it.
      /*
      {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::311141540042:user/benyamin"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
      */
      RoleArn: "arn:aws:iam::311141540042:role/web-chat-app-role",
      // An identifier for the assumed role session.
      RoleSessionName: "web-chat-app-role",
      // The duration, in seconds, of the role session. The value specified
      // can range from 900 seconds (15 minutes) up to the maximum session
      // duration set for the role.
      DurationSeconds: 900,
    });

    //This creates a STSCliend with credential provider chain in users/LENOVO/.aws/credentials
    const client = new STSClient({
        "region": "us-west-2",
    })
    //Uses the STSClient to request STS. This client is part of the AWS STS Module Library.
    //It Operates with commands and send them to the aws server to perform actions on resources. like assumedroles or buckets.
    const response = await client.send(command);
    //console.log(response);
    return response.Credentials
  } catch (err) {
    console.log("Problem getting credentials")
    console.error(err);
  }
};

module.exports = {AssumeRole}
/* response ==
{
  "AssumedRoleUser": {
    "Arn": "arn:aws:sts::123456789012:assumed-role/demo/Bob",
    "AssumedRoleId": "ARO123EXAMPLE123:Bob"
  },
  "Credentials": {
    "AccessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "Expiration": "2011-07-15T23:28:33.359Z",
    "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY",
    "SessionToken": "AQoDYXdzEPT//////////wEXAMPLEtc764bNrC9SAPBSM22wDOk4x4HIZ8j4FZTwdQWLWsKWHGBuFqwAeMicRXmxfpSPfIeoIYRqTflfKD8YUuwthAx7mSEI/qkPpKPi/kMcGdQrmGdeehM4IC1NtBmUpp2wUE8phUZampKsburEDy0KPkyQDYwT7WZ0wq5VSXDvp75YU9HFvlRd8Tx6q6fE8YQcHNVXAkiY9q6d+xo0rKwT38xVqr7ZD0u0iPPkUL64lIZbqBAz+scqKmlzm8FDrypNC9Yjc8fPOLn9FX9KSYvKTr4rvx3iSIlTJabIQwj2ICCR/oLxBA=="
  },
  "PackedPolicySize": 8
}*/