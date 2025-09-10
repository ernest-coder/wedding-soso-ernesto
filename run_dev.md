

## DOCKER

```bash
source envs/bash_profile_${AUDIT_TOOL_DEV_NAME}.sh
cd config/dev/
docker compose -p=${DEV_PROFILE} up -d
```

## ANGULAR

```bash
source envs/bash_profile_${AUDIT_TOOL_DEV_NAME}.sh
cd angular/wedding-front/
nvm use 16
npm start
```