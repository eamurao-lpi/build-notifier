import { DotNetFunction, DotNetFunctionProps } from "@xaaskit-cdk/aws-lambda-dotnet";
import { CfnOutput, aws_iam } from "aws-cdk-lib";
import { IResource, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { urlCombiner } from "./StringUtils";
import { HttpMethod } from "aws-cdk-lib/aws-events";

export interface ApiProps {
    apiGwResource: IResource;
    restApi: RestApi;
    isProxy: boolean;
    httpMethod?: HttpMethod;
};

export interface CustomDotnetLambdaProps{
    dotNetFunctionProps: DotNetFunctionProps;
    api?: ApiProps;
    awsManagedPolicyNames? : string[];
}

export class CustomDotnetLambda {

    name: string;
    lambda: DotNetFunction;
    lambdaIntegration?: LambdaIntegration;

    constructor(scope: Construct, id: string, props: CustomDotnetLambdaProps) {

        this.name = id + "LambdaFunction";
        this.lambda = new DotNetFunction(scope, this.name, props.dotNetFunctionProps)
        

        if(props.api != undefined){
            if(!(props.api.restApi.restApiId === props.api.apiGwResource.api.restApiId)){
                throw Error("`props.restApi.restApiId` is not equal to `props.apiGwResource.api.restApiId`");
            }

            this.lambdaIntegration = new LambdaIntegration(this.lambda, { proxy: true })

            if(!props.api.isProxy && props.api.httpMethod != undefined){
                props.api.apiGwResource.addMethod(props.api.httpMethod, this.lambdaIntegration)
            }else{
                props.api.apiGwResource.addMethod("ANY", this.lambdaIntegration) //Proxy used for Web API Projects
            }

            if(props.api.isProxy){
                props.api.apiGwResource.addProxy({
                    defaultIntegration: this.lambdaIntegration
                })
            }

            new CfnOutput(scope, `${this.name}ApiGatewayOutput`, {
                description: `Api Output for ${props.dotNetFunctionProps.description}`,
                value: urlCombiner(props.api.restApi.url, props.api.apiGwResource.path)
            });
        }

        new CfnOutput(scope, `${this.name}Arn`, {
            description: `ARN for ${props.dotNetFunctionProps.description}`,
            value: this.lambda.functionArn
        });

        new CfnOutput(scope, `${this.name}WebConsoleURL`, {
            description: `ARN for ${this.name}`,
            value: `https://${this.lambda.env.region}.console.aws.amazon.com/lambda/home?region=${this.lambda.env.region}#/functions/${this.lambda.functionName}`
        });

        if(props.awsManagedPolicyNames != undefined){
            props.awsManagedPolicyNames.forEach(name => this.lambda.role?.addManagedPolicy(aws_iam.ManagedPolicy.fromAwsManagedPolicyName(name)))
        }
        
    }
}