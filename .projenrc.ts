import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.189.0',
  typescriptVersion: '5.9.x',
  jsiiVersion: '5.9.x',
  defaultReleaseBranch: 'main',
  name: '@gammarers/aws-stepfunctions-execution-status-change-notification-stack',
  description: 'This AWS CDK Stack retrieves the status of Step Functions via EventBridge and sends notifications accordingly. Currently, it only detects and notifies when the status of any machine is either "Failed" or "TimeOut."',
  majorVersion: 2,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/aws-stepfunctions-execution-status-change-notification-stack.git',
  deps: [
    '@gammarers/aws-stepfunctions-execution-status-change-detection-event-rule@^1.0.0',
  ],
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '18.0.0',
  workflowNodeVersion: '24.x',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['11 20 * * 3']),
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();