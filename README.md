# CALCUL SOME INSTAGRAM USER ENGAGEMENT RATE

## Stack

typescript

## Installation

You will need node js (https://nodejs.org/fr/download/).

```bash
# install dependencies
npm i

# launch script
npm run start

# your file is generated in the ./files folder
```

Set in the ./src/variables, the accounts, you want to get the data from. It must be the account names.

## Result

An excel file with a sheet for each account with the following columns :

- url
- description
- date
- likesCounter
- commentsCounter // if enables
- viewsCounter // only on video
- engagementRate // if possible

## Disclaimer

Not sure about its legality. Use it at your own risk.
Requests often end up in 429. You may need to retrieve the data one account by one account. A better throttling must be initialized.
Still not working ? maybe :

- Try later
- Update the QUERY_HASH in ./sc/variables (you can get one folllowing an instagram query when scrolling posts, check method "getPageUrl" to know where the hash is displayed in the url)
- Project is not maintained (probably)
