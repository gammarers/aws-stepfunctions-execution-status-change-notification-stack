import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { NotificationStateMachine } from './resources/notification-state-machine';
import { StepFunctionsExecutionStatusChangeDetectionEventRule } from '/Users/y-higa/Workspace/@gammarers/aws-cdk-construct-libs/aws-stepfunctions-execution-status-change-detection-event-rule/lib';

export class StepFunctionsExecutionStatueChangeNotificationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 👇 Create State Machine
    const stateMachine = new NotificationStateMachine(this, 'StateMachine', {
      stateMachineName: undefined,
      timeout: Duration.minutes(1),
      // notificationTopic: topic,
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