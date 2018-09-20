//function to send a response
const respond = (request, response, status, content, type) => {
  //set status code and content type (application/json)
  response.writeHead(status, { 'Content-Type': type });
  //stringify the object (so it doesn't use references/pointers/etc)
  //but is instead a flat string object.
  //Then write it to the response.
  response.write(content);
  //Send the response to the client
  response.end();
};

//function to show a success status code
const success = (request, response, acceptedTypes) => {
  //message to send
  const responseType = {
    message: 'This is a successful response',
  };

  //if the client's most preferred type (first option listed)
  //is xml, then respond xml instead
  if (acceptedTypes[0] === 'text/xml') {
	//create a valid XML string
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${response.name}</message>`;
    responseXML = `${responseXML} </response>`;    

	//return response passing out string and content type
    return respond(request, response, responseXML, 'text/xml');
  }    
    
  //stringify the json object (so it doesn't use references/pointers/etc)
  //but is instead a flat string object.
  //Then write it to the response.
  const stringJSON = JSON.stringify(responseType);
    
  //send our json with a success status code
  return respond(request, response, stringJSON, 'application/json');
}; // End of success JSON/XML


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
    return respond(request, response, 400, responseJSON);
  }

  //if the parameter is here, send json with a success status code
  return respond(request, response, 200, responseJSON);
};

const unauthorized = (request, response, params) => {
  const responseJSON = {
    message: 'You have sucessfully viewed the content',
  };

  if(!params.loggedIn || params.loggedIn !== 'true') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';
    return respond(request, response, 401, responseJSON);
  }

  return respond(request, response, 200, responseJSON);
};

const forbidden = (request, response, acceptedTypes) => {
  const responseJSON = {
    id: "forbidden",
    message: 'You do not have access to this content.',
  };

  respond(request, response, 403, responseJSON);
};

const internal = (request, response, acceptedTypes) => {
  const responseJSON = {
    id: "internal",
    message: 'Internal Server Error. Something went wrong.',
  };

  return respond(request, response, 500, responseJSON);
};

const notImplemented = (request, response, acceptedTypes) => {
  const responseJSON = {
    id: "notImplemented",
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
  };

  return respond(request, response, 501, responseJSON);
};

//function to show not found error
const notFound = (request, response) => {
  //error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  //return our json with a 404 not found error code
  return respond(request, response, 404, responseJSON);
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