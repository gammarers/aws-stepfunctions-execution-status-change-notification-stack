import { StepFunctionsExecutionStatusChangeDetectionEventRule } from '@gammarers/aws-stepfunctions-execution-status-change-detection-event-rule';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import { NotificationStateMachine } from './resources/notification-state-machine';

export interface Notifications {
  readonly emails?: string[];
  // readonly slack?: Slack;
}

export interface StepFunctionsExecutionStatueChangeNotificationStackProps extends StackProps {
  // readonly targetResource: TargetResource;
  readonly enableRule?: boolean;
  readonly notifications?: Notifications;
  // readonly resourceNamingOption?: ResourceNamingOption;
}

export class StepFunctionsExecutionStatueChangeNotificationStack extends Stack {
  constructor(scope: Construct, id: string, props: StepFunctionsExecutionStatueChangeNotificationStackProps) {
    super(scope, id, props);

    // 👇 SNS Topic for notifications
    const topic: sns.Topic = new sns.Topic(this, 'NotificationTopic', {
      // topicName: names.notificationTopicName,
      // displayName: names.notificationTopicDisplayName,
    });

    // 👇 Subscribe an email endpoint to the topic
    const emails = props.notifications?.emails ?? [];
    for (const email of emails) {
      topic.addSubscription(new subscriptions.EmailSubscription(email));
    }

    // 👇 Create State Machine
    const stateMachine = new NotificationStateMachine(this, 'StateMachine', {
      stateMachineName: undefined,
      timeout: Duration.minutes(1),
      notificationTopic: topic,
    });

    // @ts-ignore
    new StepFunctionsExecutionStatusChangeDetectionEventRule(this, 'StepFunctionsExecutionStatusChangeDetectionEventRule', {
      targets: [
        new targets.SfnStateMachine(stateMachine, {
          input: events.RuleTargetInput.fromObject({
            event: events.EventField.fromPath('$'),
            params: {
              // tagKey: props.targetResource.tagKey,
              // tagValues: props.targetResource.tagValues,
            },
          }),
        }),
      ],
    });
  }
}