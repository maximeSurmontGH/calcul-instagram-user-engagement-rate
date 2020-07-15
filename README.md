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
You can also change the different parameters from this file, such as the throttle paameters, etc.

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

Requests often end up in 429. You should try to play with the different parameters "NUMBER_OF_CONCURRENT_REQUEST", "DELAY_BETWEEN_TWO_PAGE", "NUMBER_OF_MAXIMUM_RETRY" and "DELAY_BETWEEN_TWO_RETRY". Default values were the ones working for me.

Still not working ? maybe :

- Try later
- Update the QUERY_HASH in ./sc/variables (you can get one folllowing an instagram query when scrolling posts, check method "getPageUrl" to know where the hash is displayed in the url)
- Project is not maintained (probably)
