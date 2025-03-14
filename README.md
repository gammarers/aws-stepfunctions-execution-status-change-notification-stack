# AWS Step Functions Execution Status Change Notification Stack

This AWS CDK Stack retrieves the status of Step Functions via EventBridge and sends notifications accordingly. Currently, it only detects and notifies when the status of any machine is either "Failed" or "TimeOut."

