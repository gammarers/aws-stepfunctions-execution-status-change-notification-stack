import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StepFunctionsExecutionStatueChangeNotificationStack } from '../src';

describe('Stack Default Testing', () => {

  const app = new App();

  const stack = new StepFunctionsExecutionStatueChangeNotificationStack(app, 'StepFunctionsExecutionStatueChangeNotificationStack');

  const template = Template.fromStack(stack);

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});
