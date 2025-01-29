import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CodePipelineExecutionStateChangeNotificationStack } from '../src';

describe('Stack Default Testing', () => {

  const app = new App();

  const stack = new CodePipelineExecutionStateChangeNotificationStack(app, 'CodePipelineExecutionStateChangeNotificationStack');

  const template = Template.fromStack(stack);

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

});
