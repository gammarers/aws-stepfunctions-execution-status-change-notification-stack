# AWS Step Functions Execution Status Change Notification Stack

[![GitHub](https://img.shields.io/github/license/gammarers/aws-stepfunctions-execution-status-change-notification-stack?style=flat-square)](https://github.com/gammarers/aws-stepfunctions-execution-status-change-notification-stack/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarers/aws-stepfunctions-execution-status-change-notification-stack?style=flat-square)](https://www.npmjs.com/package/@gammarers/aws-stepfunctions-execution-status-change-notification-stack)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers/aws-stepfunctions-execution-status-change-notification-stack/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers/aws-stepfunctions-execution-status-change-notification-stack/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers/aws-stepfunctions-execution-status-change-notification-stack?sort=semver&style=flat-square)](https://github.com/gammarers/aws-stepfunctions-execution-status-change-notification-stack/releases)

[![View on Construct Hub](https://constructs.dev/badge?package=@gammarers/aws-stepfunctions-execution-status-change-notification-stack)](https://constructs.dev/packages/@gammarers/aws-stepfunctions-execution-status-change-notification-stack)

This AWS CDK Stack retrieves the status of Step Functions via EventBridge and sends notifications accordingly. Currently, it only detects and notifies when the status of any machine is either "Failed" or "TimeOut."

### TypeScript

#### install by npm

```shell
npm install @gammarers/aws-stepfunctions-execution-status-change-notification-stack
```

#### install by yarn

```shell
yarn add @gammarers/aws-stepfunctions-execution-status-change-notification-stack
```

## Example

### Code

```typescript
import { RDSDatabaseAutoRunningProtectionStack } from '@gammarers/aws-stepfunctions-execution-status-change-notification-stack';

new StepFunctionsExecutionStatueChangeNotificationStack(app, 'StepFunctionsExecutionStatueChangeNotificationStack', {
  enableRule: true,
  notifications: {
    emails: [
      'foo@example.com',
      'bar@example.net',
    ],
  },
});
```

## License

This project is licensed under the Apache-2.0 License.
