# Dequery

## Deploy
### Backend
1) ```$ cd web-api/```
2) ```$ eb deploy```

### Debugging
1) ```$ eb ssh```
2) ```$ cd ../../var/log```
3) ```$ tail -n 100 -f eb-engine.log```
4) ```$ tail -n 100 -f cfn-init.log```
5) ```$ tail -n 100 -f cfn-init-cmd.log```
