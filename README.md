# Dequery

## Deploy
### Backend
1) ```$ cd web-api/```
2) ```$ eb deploy```

### Frontend
1) ```$ cd web-client/```
2) ```$ npm run build```
3a) ```$ aws s3 sync build/ s3://dev.dequery.org --profile openzyme``` dev
3b) ```$ aws s3 sync build/ s3://dequery.org --profile openzyme``` prod and make sure to remove temp from .evn.production file
4a) ```$ aws cloudfront create-invalidation --distribution-id E9Z6GXFH4YBCW --paths /index.html``` dev
4b) ```$ aws cloudfront create-invalidation --distribution-id E2E5XU5PPCYHIW --paths /index.html``` prod

### Debugging
1) ```$ eb ssh```
2) ```$ cd ../../var/log```
3) ```$ tail -n 100 -f eb-engine.log```
4) ```$ tail -n 100 -f cfn-init.log```
5) ```$ tail -n 100 -f cfn-init-cmd.log```


### MVP Features
[x] Signup
[x] Login
[x] Logout
[x] Alpha Token Required

-----
[x] Create Prompt Backend
[x] Create Prompt Frontend
[x] Create Prompt UI
[x] View Prompts Backend
[x] View Prompts Frontend
[x] View Prompts UI
[x] View Prompt Detail Backend
[x] View Prompt Detail Frontend
[x] View Prompt Detail Backend


------
[x] Add DEQ Bounty to Prompt Backend
[x] Add DEQ Bounty to Prompt Frontend
[x] Marketing About
[] deploy dev instance
[] deploy prod instance
[] Alias Users
[] Demo Questions with bounties
[] Fivver Logo

-----
[] Add DEQ Bounty to Prompt UI
[] Add DEQ Tokens to User Backend
[] Add DEQ Tokens to User Frontend
[] Add DEQ Tokens to User UI
[] Create Answer Backend
[] Create Answer UI

------
[] Upvote Answer (increases Prompt Bounty) Backend
[] Upvote Answer UI
[] Expire Prompt with Distributed Bounty
[] Marketing FAQ
[] Marketing Whitepaper


### Not in MVP
[x] Session
[] Email confirmation of account
[] Add Tags
[] Filter or Sort prompts
[] User profile of activity
[] Add ammend to prompt
[] Add ammend to answer
[] Save Prompt as draft
[] Save Answer as draft
[] Unit tests
[] Remove Alpha Passcode

### Bugs to Fix
[] No error is shown if prompt title is too long
[] Pagination of DRF is only 15 for prompt list
[] Switch to Accordian View [https://material-ui.com/components/accordion/]