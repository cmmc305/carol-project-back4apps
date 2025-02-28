import Parse from 'parse';

const APP_ID = 'eiE9EYPU5UgRG6Aj1lcEhU9kzMZGbvR1Ew66gCfg';
const JAVASCRIPT_KEY = 'gIpkEnNfIGBYDUn5bwbJaZMQMQD8Uoy9mBYwaoFt';
const SERVER_URL = 'https://parseapi.back4app.com/';

Parse.initialize(APP_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;
