# Backup to Google Drive (Alpha)


## Use as Docker image
1. Create project at Google Developer console and download configuration
- Go to this URL: https://developers.google.com/drive/api/v3/quickstart/nodejs#step_1_turn_on_the
- Click to the "ENABLE THE DRIVE API" button.
- On the dialog click on "DOWNLOAD CLIENT CONFIGURATION" button and save the configuration.

2. Run Docker image first time
Use Docker image [ondrejosnetcz/backup-to-google-drive](https://hub.docker.com/r/ondrejosnetcz/backup-to-google-drive).
Example:
```
docker run -v /path/to/client_secret.json:/home/node/secret/client_secret.json -v /path/to/safe/directory:/home/node/secret -v /path/to/folder/to/be/backuped:/home/node/backup/choose-name-of-folder ondrejosnetcz/backup-to-google-drive
```
This is a minimum config of the image. The image needs 3 volumes:
- /path/to/client_secret.json: Is file downloaded from Goole in first step.
- /path/to/safe/directory: Is folder where will be store Google access tokens. Keep it secure!
- /path/to/folder/to/be/backuped: Content of this folder will be backup to Google Drive. Each file and folder separatly as 7zip file. In exaple below in Google Drive will be created "server_backup/choose-name-of-folder" and in the folde will be store file called "choose-name-of-folder_DD_MM_YYYY-hh_mm_ss.7z". This file contants all content in /path/to/folder/to/be/backuped on your server



## Use this software at your own risk!!!

