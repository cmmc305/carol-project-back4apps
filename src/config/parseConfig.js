import Parse from 'parse';

const APP_ID = '2NDD1ZpiL8vDCXeIOGfVlDCsYSDH1Pnl23Qazy17';
const JAVASCRIPT_KEY = 'zdysUdPok7hl1X3hH6xnfbr48X35J0Fl734HjroY';
const SERVER_URL = 'https://parseapi.back4app.com/';

Parse.initialize(APP_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;
