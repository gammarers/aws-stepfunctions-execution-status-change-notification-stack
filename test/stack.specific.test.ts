import { App, Duration } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StepFunctionsExecutionStatueChangeNotificationStack } from '../src';

describe('Stack Specific Testing', () => {

  const app = new App();

  const stack = new StepFunctionsExecutionStatueChangeNotificationStack(app, 'StepFunctionsExecutionStatueChangeNotificationStack', {
    enableRule: true,
    notifications: {
      emails: [
        'foo@example.com',
        'bar@example.net',
      ],
    },
    timeoutOption: {
      stateMachineTimeout: Duration.minutes(10),
    },
  });

  const template = Template.fromStack(stack);

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});
