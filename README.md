# Dequery

## Deploy
### Backend
1) ```$ cd web-api/```
2a) ```$ eb deploy``` dev
2b_ ```$eb deploy dequery``` prod

### Frontend
1) ```$ cd web-client/```
2) ```$ npm run build```
3a) ```$ aws s3 sync build/ s3://dev.dequery.org --profile openzyme``` dev
3b) ```$ aws s3 sync build/ s3://dequery.org --profile openzyme``` prod and make sure to remove temp from .evn.production file
4a) ```$ aws cloudfront create-invalidation --distribution-id E9Z6GXFH4YBCW --paths /index.html``` dev
4b) ```$ aws cloudfront create-invalidation --distribution-id E2E5XU5PPCYHIW --paths /index.html``` prod

### Debugging
1) ```$ eb ssh```
3) ```$ tail -n 100 -f /var/log/eb-engine.log```
4) ```$ tail -n 100 -f /var/log/cfn-init.log```
5) ```$ tail -n 100 -f /var/log/cfn-init-cmd.log```
6) ```source /var/app/venv/*/bin/activate```
7) ```cd ..```
8) ````cd /var/app/current/```

### Create Admin User SSH


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
[x] Session


------
[x] Add DEQ Bounty to Prompt Backend
[x] Add DEQ Bounty to Prompt Frontend
[x] Marketing About
[x] deploy dev instance
[x] deploy prod instance
[x] Fivver Logo

-----
[x] Add DEQ Tokens to User Backend
[x] Add DEQ Tokens to User Frontend
[x] Add DEQ Tokens to User UI
[x] Create Answer Backend
[x] Create Answer UI

------
[x] answer with another account
[x] request alpha
[x] Marketing Whitepaper
[x] Create Prompt costs 10 DEQ and user must have enough DEQ
[x] Add DEQ Bounty to Prompt UI

[x] Spend Upvotes on Answer
[x] Upvote Answer UI
[x] Expire Prompt with Distributed Bounty


----------------------------------------------
[x] create deq_transaction
    [x] enough balance (include gas if TO_ETH)
    [x] add enough data to extra

## Foresight Launch
[x] Switch cashout to DAI or Paypal
[] password min 6 charecters
[] confirm password twice
[] put in user name after re-route
[] answer time linkedin post
[] add more helper texts
[] update about page
[] better helper text
[] create example video



[] Announce in Bankless shill your project
[] Invite James to ask a question
[x] Invite Douglas to ask a question



### Not in MVP
[x] Marketing FAQ
[x] Make pretty
[x] test auth/tokens on app render logout if needed
[x] asker's cut backend
[] Email confirmation of account
[] Add Tags
[] Filter or Sort prompts
[] User profile of activity
[] Add ammend to prompt
[] Add ammend to answer
[] Save Prompt as draft
[] Save Answer as draft
[x] Unit tests
[x] Remove Alpha Passcode

### Bugs to Fix
[x] fix refresh not loading app
[x] No error is shown if prompt title is too long
[] fix field erros showing up as dict general errors
[x] Pagination of DRF is only 15 for prompt list
[] Double check error handling on form submissions
[] Double check Asnc buttons disable while fetching
