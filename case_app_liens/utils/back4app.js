import Parse from 'parse';

const appId = '9kdguQXyPc3Nhl46o5VdMhgXOgKIb4wgaGb1zUba';
const javascriptKey = 'JaDWJwxMUgde1QBR0fZsJUfa5V6aX9R7Ijpl1dUv';
const serverURL = 'https://parseapi.back4app.com/';

if (!Parse.applicationId) {
    Parse.initialize(appId, javascriptKey);
    Parse.serverURL = serverURL;
  }

export default Parse;