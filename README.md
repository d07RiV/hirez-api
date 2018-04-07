# hirez-api
JS wrapper for HiRez API (Smite and Paladins)

This package provides easy to use bindings for HiRez API based on promises. Session is created automatically and invalidated after 14 minutes.

Example use:

    const hirez = require("hirez-api");
    const api = new hirez.Paladins({
      platform: "PC",
      devId: config.hirez_dev_id,
      authKey: config.hirez_auth_key,
    });
    api.getMatchDetails(123456789).then(console.log);

# Documentation

## Creating API object

    const api = new hirez.Smite(options);

or

    const api = new hirez.Paladins(options);