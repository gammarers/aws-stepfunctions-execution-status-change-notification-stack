// import { Stack } from 'aws-cdk-lib';
// import * as sns from 'aws-cdk-lib/aws-sns';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
// import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface NotificationStateMachineProps extends sfn.StateMachineProps {
  // notificationTopic: sns.ITopic;
}

export class NotificationStateMachine extends sfn.StateMachine {
  constructor(scope: Construct, id: string, props: NotificationStateMachineProps) {
    super(scope, id, {
      ...props,
      definitionBody: (() => {

        // 👇 Get Account
        // const account = Stack.of(scope).account;

        const succeed: sfn.Succeed = new sfn.Succeed(scope, 'Succeed');

        const initDefinition: sfn.Pass = new sfn.Pass(scope, 'InitDefinition', {
          result: sfn.Result.fromObject(
            {
              Statues: [
                { key: 'RUNNING', value: 'Running', emoji: '🥳' },
                { key: 'SUCCEEDED', value: 'Succeeded', emoji: '🤩' },
                { key: 'FAILED', value: 'Failed', emoji: '😫' },
                { key: 'TIMED_OUT', value: 'TimeOut', emoji: '🤔' },
                { key: 'ABORTED', value: 'Aborted', emoji: '😮' },
                { key: 'PENDING_REDRIVE', value: 'PenfdingRedrive', emoji: '🧐' },
              ],
            },
          ),
          resultPath: '$.Definition',
        });

        const prepareTopicValue = new sfn.Pass(scope, 'PrepareTopicValue', {
          resultPath: '$.Prepare.Topic.Values',
          parameters: {
            StateMachieName: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.event.detail.stateMachineArn'), ':'), 6), // machine name
            ExecutionName: sfn.JsonPath.stringAt('$.event.detail.name'), // execution name
            ExecutionArn: sfn.JsonPath.stringAt('$.event.detail.executionArn'), // execution arn
            Emoji: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.Definition.Statues[?(@.key == $.event.detail.status)].emoji'), 0),
            Status: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.Definition.Statues[?(@.key == $.event.detail.status)].value'), 0),
            ContextStateMachineId: sfn.JsonPath.stringAt('$$.StateMachine.Id'),
          },
        });

        // 👇 Generate topic message
        const generateTopicValue = new sfn.Pass(scope, 'GenerateTopicValue', {
          resultPath: '$.Generate.Topic',
          parameters: {
            Subject: sfn.JsonPath.format('{} [{}] AWS Step Functions Execution State Notification [{}][{}]',
              sfn.JsonPath.stringAt('$.Prepare.Topic.Values.Emoji'),
              sfn.JsonPath.stringAt('$.Prepare.Topic.Values.Status'),
              sfn.JsonPath.stringAt('$.event.account'),
              sfn.JsonPath.stringAt('$.event.region'),
            ),
            TextMessage: sfn.JsonPath.format('Account : {}\nRegion : {}\nState Machine : {}\nExecution Name : {}\n\n{}',
              sfn.JsonPath.stringAt('$.event.account'),
              sfn.JsonPath.stringAt('$.event.region'),
              sfn.JsonPath.stringAt('$.Prepare.Topic.Values.StateMachieName'),
              sfn.JsonPath.stringAt('$.Prepare.Topic.Values.ExecutionName'),
              sfn.JsonPath.format('https://console.aws.amazon.com/states/home?{}#/v2/executions/details/{}',
                sfn.JsonPath.stringAt('$.event.region'),
                sfn.JsonPath.stringAt('$.Prepare.Topic.Values.ExecutionArn'),
              ),
            ),
          },
        });

        prepareTopicValue.next(generateTopicValue);
        generateTopicValue.next(succeed);

        // 👇 Choice state for message
        const isNotMe: sfn.Choice = new sfn.Choice(scope, 'isNotMe')
          .when(
            sfn.Condition.not(sfn.Condition.stringEqualsJsonPath('$$.StateMachine.Id', '$.event.detail.stateMachineArn')),
            prepareTopicValue,
          )
          .otherwise(new sfn.Pass(scope, 'Skip').next(succeed));

        initDefinition.next(isNotMe);

        //
        //        // 👇 Send notification task
        //        const sendNotification: tasks.SnsPublish = new tasks.SnsPublish(scope, 'SendNotification', {
        //          topic: props.notificationTopic,
        //          subject: sfn.JsonPath.stringAt('$.Generate.Topic.Subject.Value'),
        //          message: sfn.TaskInput.fromJsonPathAt('$.Generate.Topic.Message.Value'),
        //          resultPath: '$.snsResult',
        //        });
        //
        //        generateTopicTextMessage.next(sendNotification);
        //
        //        sendNotification.next(succeed);

        return sfn.DefinitionBody.fromChainable(initDefinition);

      })(),
    });
  }
}