//function to send a json object
const respondJSON = (request, response, status, object) => {
  //set status code and content type (application/json)
  response.writeHead(status, { 'Content-Type': 'application/json' });
  //stringify the object (so it doesn't use references/pointers/etc)
  //but is instead a flat string object.
  //Then write it to the response.
  response.write(JSON.stringify(object));
  //Send the response to the client
  response.end();
};

/*
 //if the client's most preferred type (first option listed)
  //is xml, then respond xml instead
  if (acceptedTypes[0] === 'text/xml') {
	//create a valid XML string with name and age tags.
    let responseXML = '<response>';
    responseXML = `${responseXML} <name>${response.name}</name>`;
    responseXML = `${responseXML} </response>`;    

	//return response passing out string and content type
    return respond(request, response, responseXML, 'text/xml');
  }
*/

//function to show a success status code
const success = (request, response, acceptedTypes) => {
  //message to send
  const responseJSON = {
    message: 'This is a successful response',
  };

  //send our json with a success status code
  respondJSON(request, response, 200, responseJSON);
};

//function to show a bad request without the correct parameters
const badRequest = (request, response, params) => {
  //message to send
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  //if the request does not contain a valid=true query parameter
  if(!params.valid || params.valid !== 'true') {
    //set our error message
    responseJSON.message = 'Missing valid query parameter set to true';
    //give the error a consistent id 
    responseJSON.id = 'badRequest';
    //return our json with a 400 bad request code
    return respondJSON(request, response, 400, responseJSON);
  }

  //if the parameter is here, send json with a success status code
  return respondJSON(request, response, 200, responseJSON);
};

const unauthorized = (request, response, params) => {
  const responseJSON = {
    message: 'You have sucessfully viewed the content',
  };

  if(!params.loggedIn || params.loggedIn !== 'true') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';
    return respondJSON(request, response, 401, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const forbidden = (request, response, acceptedTypes) => {
  const responseJSON = {
    id: "forbidden",
    message: 'You do not have access to this content.',
  };

  respondJSON(request, response, 200, responseJSON);
};

const internal = (request, response, acceptedTypes) => {
  const responseJSON = {
    id: "internal",
    message: 'Internal Server Error. Something went wrong.',
  };

  respondJSON(request, response, 200, responseJSON);
};

const notImplemented = (request, response, acceptedTypes) => {
  const responseJSON = {
    id: "notImplemented",
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
  };

  respondJSON(request, response, 200, responseJSON);
};

//function to show not found error
const notFound = (request, response) => {
  //error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  //return our json with a 404 not found error code
  respondJSON(request, response, 404, responseJSON);
};

//exports to set functions to public.
//In this syntax, you can do getIndex:getIndex, but if they
//are the same name, you can short handle to just getIndex,
module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};