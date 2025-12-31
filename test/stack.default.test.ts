import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StepFunctionsExecutionStatusChangeNotificationStack } from '../src';

describe('Stack Default Testing', () => {

  const app = new App();

  const stack = new StepFunctionsExecutionStatusChangeNotificationStack(app, 'StepFunctionsExecutionStatusChangeNotificationStack', {});

  const template = Template.fromStack(stack);

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});
