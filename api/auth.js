/* eslint-disable no-undef */
import Chatkit from '@pusher/chatkit-server';

const chatkit = new Chatkit({
  instanceLocator: 'v1:us1:75934e10-c08d-4be3-827a-5289ca7fddb6',
  key:
    '3532940a-0a8b-4146-b554-1f692f612858:vT82HUjLNMbafQMBbE+7a5ZKUl8SPBXhTgVk9QyHKPs='
});
module.exports = async (req, res) => {
  const { user_id = 'gon' } = req.query;

  const authData = chatkit.authenticate({
    userId: req.query.user_id
  });
  
  res.status(authData.status).send(authData.body);
};
