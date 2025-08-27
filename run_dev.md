

## DOCKER

```bash
source envs/bash_profile_${AUDIT_TOOL_DEV_NAME}.sh
cd config/dev/
docker compose -p=${DEV_PROFILE} up -d
```

## DJANGO

```bash
source envs/bash_profile_${AUDIT_TOOL_DEV_NAME}.sh
cd django
conda activate ${AUDIT_TOOL_CONDA_ENV}
python manage.py runserver 0:$DJANGO_PORT
```


## ANGULAR

```bash
source envs/bash_profile_${AUDIT_TOOL_DEV_NAME}.sh
cd angular/wedding-front/
nvm use 16
npm start
```