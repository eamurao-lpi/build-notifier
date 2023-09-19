import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CustomDotnetLambda } from '../_shared/CustomDotnetLambda';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkNotifierStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const defaultTimeOut = cdk.Duration.seconds(30);
    const memorySize = 1024;

    const spUiNotifierFunction = new CustomDotnetLambda(this,
      `${id}-Lambda-SpUi-Build-Notifier`,
      {
        dotNetFunctionProps: {
          runtime: Runtime.DOTNET_6,
          functionName: `${id}-Lambda-SpUi-Build-Notifier`,
          projectDir: "../SP-UI-GChat-Notif/",
          handler: "SP-UI-GChat-Notif::SP_UI_GChat_Notif.Function::FunctionHandler",
          description: "Build notifier for sp ui",
          timeout: defaultTimeOut,
          memorySize: memorySize,
          environment: {
            gWebhook: "https://chat.googleapis.com/v1/spaces/AAAAMHZG3CY/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=pkXs2RzQahn8PK5fxJ7Y3_Pg1xMuy-W1MehJSSpmqxs"
          }
        }
      });
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
