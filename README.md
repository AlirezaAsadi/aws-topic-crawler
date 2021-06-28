# AWS topic crawler

## Setup

Pre-requisites:

- NVM
- Node.js v12.16.1

```sh
nvm use
npm i
```


## Run

```sh
node start.js
```

Example of output:
```sh
node start.js
Crawling https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html...


>Topic:  AWS Accounts -> ./list_awsaccounts.html
Crawling https://docs.aws.amazon.com/service-authorization/latest/reference/list_awsaccounts.html...
>Found Action=DisableRegion ->  ConditionKeys=account:TargetRegion
>Found Action=EnableRegion ->  ConditionKeys=account:TargetRegion
>Found Action=ListRegions ->  ConditionKeys=


>Topic:  AWS Activate -> ./list_awsactivate.html
Crawling https://docs.aws.amazon.com/service-authorization/latest/reference/list_awsactivate.html...
>Found Action=CreateForm ->  ConditionKeys=
>Found Action=GetAccountContact ->  ConditionKeys=
>Found Action=GetContentInfo ->  ConditionKeys=
>Found Action=GetCosts ->  ConditionKeys=
>Found Action=GetCredits ->  ConditionKeys=
>Found Action=GetMemberInfo ->  ConditionKeys=
>Found Action=GetProgram ->  ConditionKeys=
>Found Action=PutMemberInfo ->  ConditionKeys=
```