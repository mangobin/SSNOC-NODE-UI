var host_url = process.env.REST_API_URL || "http://ec2-54-68-51-131.us-west-2.compute.amazonaws.com:5454/ssnoc";

var RestAPI = {
  'get_all_users' : host_url + '/users',
  'is_password_valid' : host_url + '/user/',
  'get_user' : host_url + '/user/',
  'get_status' : host_url + '/status/userName/',
  'post_new_user' : host_url + '/user/signup'
};

RestAPI.authenticate_user = function(userName){
  return host_url + '/user/' + userName + '/authenticate'
}

RestAPI.post_status = function(userName){
  return host_url + '/status/' + userName; 
}

module.exports = RestAPI;
