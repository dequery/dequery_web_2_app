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


[] create example video


[] Announce in Bankless shill your project
[] Invite James to ask a question
[x] Invite Douglas to ask a question


[] Add Tags
[] Filter or Sort prompts
[] User profile of activity
[] Add ammend to prompt
[] Add ammend to answer
[] Save Prompt as draft
[] Save Answer as draft
