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
    
# Links

* [Hi-Rez Studios API Terms of Use Agreement](http://www.hirezstudios.com/wp-content/themes/hi-rez-studios/pdf/api-terms-of-use-agreement.pdf)
* [Official Hi-Rez API Documentation](https://docs.google.com/document/d/1OFS-3ocSx-1Rvg4afAnEHlT3917MAK_6eJTR6rzr-BM/edit)
* [Hi-Rez API Access Request Form](https://fs12.formsite.com/HiRez/form48/secure_index.html)

# Documentation

## Creating API object

    const api = new hirez.Smite(options);

or

    const api = new hirez.Paladins(options);
    
Options can have the following fields:

* `platform` - `"PC"`, `"Xbox"` or `"PS4"`. Defaults to PC.
* `devId` - your developer ID (4 digit number).
* `authKey` - your authorization key (32 hex digits).
* `lang` - langage used for some requests (see [constants](#Constants) section). Defaults to English.

## API methods

All methods return a promise that resolves to JSON response, unless stated otherwise (most descriptions are copied from [official documentation](https://docs.google.com/document/d/1OFS-3ocSx-1Rvg4afAnEHlT3917MAK_6eJTR6rzr-BM/edit)).

### Connectivity

    api.ping()
    
A quick way of validating access to the Hi-Rez API.

    api.session()
    
Returns a promise that resolves to new or current session ID. Sessions are managed internally, so you do not need to call this method directly.

    api.test()
    
A means of validating that a session is established.

    api.getServerStatus()
    
Function returns UP/DOWN status for the primary game/platform environments.  Data is cached once a minute.

### General information

    api.getDataUsed()
    
Returns API Developer daily usage limits and the current status against those limits.

    api.getItems()
    
Returns all Items and their various attributes.

    api.getPatchInfo()
    
Function returns information about current deployed patch. Currently, this information only includes patch version.

    api.getMOTD()
    
Returns information about the 20 most recent Match-of-the-Days.

    api.getEsportsProLeagueDetails()
    
Returns the matchup information for each matchup for the current eSports Pro League season.  An important return value is “match_status” which represents a match being scheduled (1), in-progress (2), or complete (3)

    api.getTopMatches()
    
Lists the 50 most watched / most recent recorded matches.

### Player information

Here, `player` refers to player name.

    api.getFriends(player)
    
Returns the Smite User names of each of the player’s friends.

    api.getMatchHistory(player)
    
Gets recent matches and high level match statistics for a particular player.

    api.getPlayer(player)
    
Returns league and other high level data for a particular player.

    api.getPlayerStatus(player)
    
Returns player status as follows: 

  0 - Offline  
  1 - In Lobby  (basically anywhere except god selection or in game)  
  2 - god Selection (player has accepted match and is selecting god before start of game)  
  3 - In Game (match has started)  
  4 - Online (player is logged in, but may be blocking broadcast of player state)  
  5 - Unknown (player not found)

    api.getQueueStats(player, queue)
    
Returns match summary statistics for a (player, queue) combination grouped by gods played.

    api.getPlayerAchievements(player)
    
Returns select achievement totals (Double kills, Tower Kills, First Bloods, etc) for the specified playerId.

    api.getGodRanks(player)
    
Returns the Rank and Worshippers value for each God a player has played. \[SmiteAPI only\]

    api.getChampionRanks(player)
    
Returns the Rank and Worshippers value for each Champion a player has played. \[PaladinsAPI only\]

    api.getPlayerLoadouts(player)
    
Returns deck loadouts per Champion. \[PaladinsAPI only\]

### Match information

    api.getDemoDetails(match_id)
    
Returns information regarding a particular match.  Rarely used in lieu of getmatchdetails().

    api.getMatchDetails(match_id)
    
Returns the statistics for a particular completed match.

    api.getMatchPlayerDetails(match_id)
    
Returns player information for a live match.

    api.getMatchDetailsBatch(match_ids)
    
Returns the statistics for a particular set of completed matches. Here, `match_ids` is an array of match IDs.

* NOTE: There is a byte imit to the amount of data returned; please limit the CSV parameter to 5 to 10 matches because of this and for Hi-Rez DB Performance reasons.

### Queue information

For a list of queues, see the [constants](#Constants) section.

    api.getMatchIdsByQueue(queue, date, hour)
    
Lists all Match IDs for a particular Match Queue; useful for API developers interested in constructing data by Queue. To limit the data returned, an `hour` parameter was added (valid values: 0 - 23). An `hour` parameter of -1 represents the entire day, but be warned that this may be more data than we can return for certain queues. Also, a returned “active_flag” means that there is no match information/stats for the corresponding match. Usually due to a match being in-progress, though there could be other reasons.

* NOTE - To avoid HTTP timeouts in the GetMatchIdsByQueue() method, you can now specify a 10-minute window within the specified `hour` field to lessen the size of data returned by appending a “,mm” value to the end of `hour`. For example, to get the match Ids for the first 10 minutes of hour 3, you would specify `hour` as “3,00”.  This would only return the Ids between the time 3:00 to 3:09. Rules below:
  * Only valid values for mm are “00”, “10”, “20”, “30”, “40”, “50”
  * To get the entire third hour worth of Match Ids, call GetMatchIdsByQueue() 6 times, specifying the following values for {hour}: “3,00”, “3,10”, “3,20”, “3,30”, “3,40”, “3,50”. 
  * The standard, full hour format of {hour} = “hh” is still supported.

    api.getLeagueLeaderboard(queue, tier, season)
    
Returns the top players for a particular league (as indicated by the queue/tier/season parameters).

    api.getLeagueSeasons(queue)
    
Provides a list of seasons (including the single active season) for a match queue.

### Team information

    api.getTeamDetails(clanid)
    
Lists the number of players and other high level details for a particular clan.

    api.getTeamMatchHistory(clanid)
    
Gets recent matches and high level match statistics for a particular clan/team.

* DEPRECATED - As of 2.14 Patch, /getteammatchhistory is no longer supported and will return a NULL dataset.

    api.getTeamPlayers(clanid)
    
Lists the players for a particular clan.

    api.searchTeams(searchTeam)
    
Returns high level information for Team names containing the `searchTeam` string.

### Smite-specific methods

These methods are only supported by `hirez.Smite` object.

    api.getGods()
    
Returns all Gods and their various attributes.

    api.getGodSkins(godId)
    
Returns all available skins for a particular God.

    api.getGodRecommendedItems(godId)
    
Returns the Recommended Items for a particular God.

    api.getGodLeaderboard(godId, queue)
    
Returns the current season’s leaderboard for a god/queue combination.  \[queues 440, 450, 451 only\]

### Paladins-specific methods

These methods are only supported by `hirez.Paladins` object.

    api.getChampions()
    
Returns all Champions and their various attributes.

    api.getChampionSkins(godId)
    
Returns all available skins for a particular Champion.

    api.getChampionRecommendedItems(godId)
    
Returns the Recommended Items for a particular Champion. \[Obsolete - no data returned\]

## <a name="Constants"></a>Constants

    hirez.session_duration
    
Maximum session duration, in milliseconds. Currently equal to 14 minutes.

    hirez.language
    
List of supported languages:

* ENGLISH: 1
* GERMAN: 2
* FRENCH: 3
* CHINESE: 5
* SPANISH: 7
* SPANISHLA: 9
* PORTUGUESE: 10
* RUSSIAN: 11
* POLISH: 12
* TURKISH: 13

    hirez.Smite.queue
    
Map of Smite queue IDs. Currently empty - see the list in [official documentation](https://docs.google.com/document/d/1OFS-3ocSx-1Rvg4afAnEHlT3917MAK_6eJTR6rzr-BM/edit).

    hirez.Paladins.queue
    
Map of Paladins queue IDs, as of March 2018.

* CASUAL: 424
* TEAMDEATHMATCH: 469
* ONSLAUGHT: 452
* COMPETITIVE: 428
* CLASSICSIEGE: 465
* SIEGEPRACTICE: 425
* ONSLAUGHTPRACTICE: 453
* TEAMDEATHMATCHPRACTICE: 470
* TESTMAPS: 445
* CUSTOM_T_MAGISTRATESARCHIVES: 472
* CUSTOM_T_TRADEDISTRICT: 468
* CUSTOM_S_STONEKEEP: 423
* CUSTOM_T_FOREMANSRISE: 471
* CUSTOM_S_FROGISLE: 433
* CUSTOM_S_FISHMARKET: 431
* CUSTOM_S_BRIGHTMARSH: 458
* CUSTOM_S_TIMBERMILL: 430
* CUSTOM_S_SERPENTBEACH: 440
* CUSTOM_S_JAGUARFALLS: 438
* CUSTOM_S_SPLITSTONEQUARRY: 459
* CUSTOM_O_MAGISTRATESARCHIVES: 464
* CUSTOM_S_FROZENGUARD: 432
* CUSTOM_O_FOREMANSRISE: 462
* CUSTOM_S_ICEMINES: 439
* CUSTOM_O_PRIMALCOURT: 455
* CUSTOM_O_SNOWFALLJUNCTION: 454
