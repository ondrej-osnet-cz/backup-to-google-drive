<?php
require __DIR__ . '/vendor/autoload.php';

const debug = true;

if (php_sapi_name() != 'cli') {
    throw new Exception('This application must be run on the command line.');
}

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient()
{
    $client = new Google_Client();
    $client->setApplicationName('Google Drive Server backup');
    $client->setScopes(Google_Service_Drive::DRIVE_FILE);
    $client->setAuthConfig('credentials.json');
    $client->setAccessType('offline');

    // Load previously authorized credentials from a file.
    $credentialsPath = 'token.json';
    if (file_exists($credentialsPath)) {
        $accessToken = json_decode(file_get_contents($credentialsPath), true);
    } else {
        // Request authorization from the user.
        $authUrl = $client->createAuthUrl();
        printf("Open the following link in your browser:\n%s\n", $authUrl);
        print 'Enter verification code: ';
        $authCode = trim(fgets(STDIN));

        // Exchange authorization code for an access token.
        $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);

        // Store the credentials to disk.
        if (!file_exists(dirname($credentialsPath))) {
            mkdir(dirname($credentialsPath), 0700, true);
        }
        file_put_contents($credentialsPath, json_encode($accessToken));
        printf("Credentials saved to %s\n", $credentialsPath);
    }
    $client->setAccessToken($accessToken);

    // Refresh the token if it's expired.
    if ($client->isAccessTokenExpired()) {
        $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
    }
    return $client;
}

function UploadFile($name, $parentsId, $filePath, $service) {
    $fileMetadata = new Google_Service_Drive_DriveFile(array(
        'name' => $name,
        'parents' => array($parentsId)
    ));
    $content = file_get_contents($filePath);
    $file = $service->files->create($fileMetadata, array(
        'data' => $content,
        'uploadType' => 'resumable',
        'mimeType' => 'application/tar+gzip',
        'fields' => 'id'));
    return $file->id;     
}


// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Drive($client);

$files = json_decode(file_get_contents('config.json'), true);
foreach ($files['files'] as $file) {
    $fileSourceDir = $file['sourceFolder'];
    $filesNames = scandir($fileSourceDir);
    foreach ($filesNames as $fileName) {
        if ($fileName == '.' || $fileName == '..') continue;
        $filePath = $fileSourceDir . '/' . $fileName;
        $maxFileAge = time() - (60 * 60 * 24) * $file['maxFileAgeInDay'];
        $fileAge = filemtime($filePath);
        if ($fileAge > $maxFileAge) {            
            echo 'Upload file: ' . $fileName . ' - ' . $filePath . ' to ' . $file['targetFolderGoogleId'];
            if (!debug) UploadFile($fileName, $file['targetFolderGoogleId'], $filePath, $service);            
        }
    }
}


