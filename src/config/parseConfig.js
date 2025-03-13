import Parse from 'parse';

const APP_ID = '9kdguQXyPc3Nhl46o5VdMhgXOgKIb4wgaGb1zUba';
const JAVASCRIPT_KEY = 'JaDWJwxMUgde1QBR0fZsJUfa5V6aX9R7Ijpl1dUv';
const SERVER_URL = 'https://parseapi.back4app.com/';

Parse.initialize(APP_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;
