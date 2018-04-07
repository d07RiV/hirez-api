const moment = require('moment');
const fetch = require('node-fetch');
const md5 = require('md5');

const HiRezApi = {
  session_duration: 14 * 60 * 1000,
  language: {
    ENGLISH: 1,
    GERMAN: 2,
    FRENCH: 3,
    CHINESE: 5,
    SPANISH: 7,
    SPANISHLA: 9,
    PORTUGUESE: 10,
    RUSSIAN: 11,
    POLISH: 12,
    TURKISH: 13,
  },
};

class HiRezAbstractApi {
  constructor(baseUrl, devId, authKey, lang) {
    this.baseUrl = baseUrl;
    this.devId = devId;
    this.authKey = authKey;
    this.format = 'Json';
    this.lang = (lang || HiRezApi.language.ENGLISH);
  }

  timestamp_() {
    return moment().utc().format('YYYYMMDDHHmmss');
  }
  signature_(method) {
    return md5(this.devId + method + this.authKey + this.timestamp_());
  }
  fetch_(path) {
    return fetch(this.baseUrl + path).then(response => response.json());
  }
  session() {
    if (this.session_) {
      return this.session_;
    } else {
      return this.session_ = this.fetch_(`/createsession${this.format}/${this.devId}/${this.signature_('createsession')}/${this.timestamp_()}`).then(data => {
        setTimeout(() => { delete this.session_; }, HiRezApi.session_duration);
        return data.session_id;
      }, () => {
        delete this.session_;
        return this.session();
      });
    }
  }
  request_(method, ...args) {
    return this.session().then(id => this.fetch_(`/${method}${this.format}/${this.devId}/${this.signature_(method)}/${id}/${this.timestamp_()}${[...args].map(x => '/' + encodeURI(x)).join('')}`));
  }

  ping() {
    return this.fetch_(`/ping${this.format}`);
  }

  test() { return this.request_('testsession'); }
  getServerStatus() { return this.request_('gethirezserverstatus'); }

  getDataUsed() { return this.request_('getdataused'); }
  getItems() { return this.request_('getitems', this.lang); }
  getPatchInfo() { return this.request_('getpatchinfo'); }
  getMOTD() { return this.request_('getmotd'); }
  getEsportsProLeagueDetails() { return this.request_('getesportsproleaguedetails'); }
  getTopMatches() { return this.request_('gettopmatches'); }

  getFriends(player) { return this.request_('getfriends', player); }
  getMatchHistory(player) { return this.request_('getmatchhistory', player); }
  getPlayer(player) { return this.request_('getplayer', player); }
  getPlayerStatus(player) { return this.request_('getplayerstatus', player); }
  getQueueStats(player, queue) { return this.request_('getqueuestats', player, queue); }
  getPlayerAchievements(player) { return this.request_('getplayerachievements', player); }

  getDemoDetails(match_id) { return this.request_('getdemodetails', match_id); }
  getMatchDetails(match_id) { return this.request_('getmatchdetails', match_id); }
  getMatchPlayerDetails(match_id) { return this.request_('getmatchplayerdetails', match_id); }
  getMatchDetailsBatch(match_ids) { return this.request_('getmatchdetailsbatch', match_ids.join(',')); }

  getMatchIdsByQueue(queue, date, hour) { return this.request_('getmatchidsbyqueue', queue, date, hour); }
  getLeagueLeaderboard(queue, tier, season) { return this.request_('getleagueleaderboard', queue, tier, season); }
  getLeagueSeasons(queue) { return this.request_('getleagueseasons', queue); }

  getTeamDetails(clanid) { return this.request_('getteamdetails', clanid); }
  getTeamMatchHistory(clanid) { return this.request_('getteammatchhistory', clanid); }
  getTeamPlayers(clanid) { return this.request_('getteamplayers', clanid); }

  searchTeams(searchTeam) { return this.request_('searchteams', searchTeam); }
}

class SmiteApi extends HiRezAbstractApi {
  constructor(options) {
    super(SmiteApi.endpoint[options.platform || 'PC'], options.devId, options.authKey, options.lang);
  }

  getGods() { return this.request_('getgods', this.lang); }
  getGodSkins(godId) { return this.request_('getgodskins', godId, this.lang); }
  getGodRecommendedItems(godId) { return this.request_('getgodrecommendeditems', godId, this.lang); }
  getGodLeaderboard(godId, queue) { return this.request_('getgodleaderboard', godId, queue); }

  getGodRanks(player) { return this.request_('getgodranks', player); }
}

class PaladinsApi extends HiRezAbstractApi {
  constructor(options) {
    super(PaladinsApi.endpoint[options.platform || 'PC'], options.devId, options.authKey, options.lang);
  }

  getChampions() { return this.request_('getchampions', this.lang); }
  getChampionSkins(godId) { return this.request_('getchampionskins', godId, this.lang); }
  getChampionRecommendedItems(godId) { return this.request_('getchampionrecommendeditems', godId, this.lang); }

  getChampionRanks(player) { return this.request_('getchampionranks', player); }
  getPlayerLoadouts(player) { return this.request_('getplayerloadouts', player, this.lang); }
}

SmiteApi.endpoint = {
  PC: 'http://api.smitegame.com/smiteapi.svc',
  Xbox: 'http://api.xbox.smitegame.com/smiteapi.svc',
  PS4: 'http://api.ps4.smitegame.com/smiteapi.svc',
};
SmiteApi.queue = {
};

PaladinsApi.endpoint = {
  PC: 'http://api.paladins.com/paladinsapi.svc',
  Xbox: 'http://api.xbox.paladins.com/paladinsapi.svc',
  PS4: 'http://api.ps4.paladins.com/paladinsapi.svc',
};
PaladinsApi.queue = {
  CASUAL: 424,
  TEAMDEATHMATCH: 469,
  ONSLAUGHT: 452,
  COMPETITIVE: 428,
  CLASSICSIEGE: 465,
  SIEGEPRACTICE: 425,
  ONSLAUGHTPRACTICE: 453,
  TEAMDEATHMATCHPRACTICE: 470,
  TESTMAPS: 445,
//  PAYLOAD: 437,
//  PAYLOADPRACTICE: 427,
  CUSTOM_T_MAGISTRATESARCHIVES: 472,
  CUSTOM_T_TRADEDISTRICT: 468,
  CUSTOM_S_STONEKEEP: 423,
  CUSTOM_T_FOREMANSRISE: 471,
  CUSTOM_S_FROGISLE: 433,
  CUSTOM_S_FISHMARKET: 431,
  CUSTOM_S_BRIGHTMARSH: 458,
  CUSTOM_S_TIMBERMILL: 430,
  CUSTOM_S_SERPENTBEACH: 440,
  CUSTOM_S_JAGUARFALLS: 438,
  CUSTOM_S_SPLITSTONEQUARRY: 459,
  CUSTOM_O_MAGISTRATESARCHIVES: 464,
  CUSTOM_S_FROZENGUARD: 432,
  CUSTOM_O_FOREMANSRISE: 462,
  CUSTOM_S_ICEMINES: 439,
  CUSTOM_O_PRIMALCOURT: 455,
  CUSTOM_O_SNOWFALLJUNCTION: 454,
//  CUSTOM_P_OUTPOST: 442,
//  CUSTOM_P_HIDDENTEMPLE: 441,
//  CUSTOM_P_FROSTBITECAVERNS: 443,
//  CUSTOM_O_JAGUARFALLS: 461,
};

HiRezApi.Smite = SmiteApi;
HiRezApi.Paladins = PaladinsApi;

module.exports = HiRezApi;
