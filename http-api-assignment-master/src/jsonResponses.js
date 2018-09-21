//function to send a response
const respond = (request, response, status, content, type) => {
  //set status code and content type (application/json)
  response.writeHead(status, { 'Content-Type': type });
  //stringify the object (so it doesn't use references/pointers/etc)
  //but is instead a flat string object.
  //Then write it to the response.
  if (type === 'application/json') {
    response.write(JSON.stringify(content));
  } else {
      response.write(content);
  }
  //Send the response to the client
  response.end();
};

//function to show a success status code
const success = (request, response) => {
  //message to send
  const responseType = {
    message: 'This is a successful response',
  };
  const acceptedType = request.headers.accept;

  //if the client's most preferred type (first option listed)
  //is xml, then respond xml instead
  if (acceptedType === 'text/xml') {
	//create a valid XML string
    const responseXML = `<response> <message>${responseType.message}</message> </response>`;

	//return response passing out string and content type
    return respond(request, response, 200, responseXML, 'text/xml');
  }    
    
  //stringify the json object (so it doesn't use references/pointers/etc)
  //but is instead a flat string object.
  //Then write it to the response.
  const stringJSON = responseType;
    
  //send our json with a success status code
  return respond(request, response, 200, stringJSON, 'application/json');
}; // End of success JSON/XML


//function to show a bad request without the correct parameters
const badRequest = (request, response, params) => {
  //message to send
  const responseJSON = {
    id: 'badRequest',
    message: 'This request has the required parameters',
  };

  const acceptedType = request.headers.accept;
    
  //if the request does not contain a valid=true query parameter
  if(!params.valid || params.valid !== 'true') {
    //set our error message
    responseJSON.message = 'Missing valid query parameter set to true';
    //give the error a consistent id 
    responseJSON.id = 'badRequest';
      
    //if the client's most preferred type (first option listed)
   //is xml, then respond xml instead
   if (acceptedType === 'text/xml') {
      const responseXML = `<response> <id> ${responseJSON.id} </id> <message> ${responseJSON.message} </message> </response>`;
      return respond(request, response, 403, responseXML, 'text/xml');
   }
      
    //return our json with a 400 bad request code
    return respond(request, response, 400, responseJSON, 'application/json');
  }

  //if the parameter is here, send json with a success status code
  return respond(request, response, 200, responseJSON, 'application/json');
};


// unauthorized status
const unauthorized = (request, response, params) => {
  const data = {
    id: "unauthorized",
    message: 'You have sucessfully viewed the content',
  };

  const acceptedType = request.headers.accept;

  //if the request does not contain a valid=true query parameter
  if(!params.loggedIn || params.loggedIn !== 'true') {
    //set our error message
    data.message = 'Missing valid query parameter set to true';
    //give the error a consistent id 
    data.id = 'unauthorized';
      
  //if the client's most preferred type (first option listed)
  //is xml, then respond xml instead
  if (acceptedType === 'text/xml') {
      const responseXML = `<response> <id> ${data.id} </id> <message> ${data.message} </message> </response>`;
      return respond(request, response, 401, responseXML, 'text/xml');
  }
      
//return our json with a 400 bad request code
    return respond(request, response, 401, data, 'application/json');
  }

  return respond(request, response, 200, data, 'application/json');
};


// forbidden status
const forbidden = (request, response) => {
    
  const data = {
    id: "forbidden",
    message: 'You do not have access to this content.',
  };
  const acceptedType = request.headers.accept;

  //if the client's most preferred type (first option listed)
  //is xml, then respond xml instead
  if (acceptedType === 'text/xml') {
      const responseXML = `<response> <id> ${data.id} </id> <message> ${data.message} </message> </response>`;
      return respond(request, response, 403, responseXML, 'text/xml');
  }
    
  return respond(request, response, 403, data, 'application/json');
};

const internal = (request, response) => {
  const responseJSON = {
    id: "internal",
    message: 'Internal Server Error. Something went wrong.',
  };
  const acceptedType = request.headers.accept;

  //if the client's most preferred type (first option listed)
  //is xml, then respond xml instead
  if (acceptedType === 'text/xml') {
      const responseXML = `<response> <id> ${responseJSON.id} </id> <message> ${responseJSON.message} </message> </response>`;
      return respond(request, response, 500, responseXML, 'text/xml');
  }

  return respond(request, response, 500, responseJSON, 'application/json');
};

const notImplemented = (request, response) => {
  const responseJSON = {
    id: "notImplemented",
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
  };
    
  const acceptedType = request.headers.accept;

  //if the client's most preferred type (first option listed)
  //is xml, then respond xml instead
  if (acceptedType === 'text/xml') {
      const responseXML = `<response> <id> ${responseJSON.id} </id> <message> ${responseJSON.message} </message> </response>`;
      return respond(request, response, 501, responseXML, 'text/xml');
  }

  return respond(request, response, 501, responseJSON, 'application/json');
};

//function to show not found error
const notFound = (request, response) => {
  //error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  const acceptedType = request.headers.accept;

  //if the client's most preferred type (first option listed)
  //is xml, then respond xml instead
  if (acceptedType === 'text/xml') {
      const responseXML = `<response> <id> ${responseJSON.id} </id> <message> ${responseJSON.message} </message> </response>`;
      return respond(request, response, 404, responseXML, 'text/xml');
  }

  //return our json with a 404 not found error code
  return respond(request, response, 404, responseJSON, 'application/json');
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