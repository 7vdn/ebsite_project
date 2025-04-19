const handler = async (event) => {
  try {
    // للطلبات GET (لعملية Polling)
    if (event.httpMethod === 'GET') {
      const orderId = event.queryStringParameters.orderId;
      return {
        statusCode: 200,
        body: JSON.stringify({}),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      };
    }

    // للطلبات POST (من Zapier)
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true,
          code: data.code,
          orderId: data.orderId
        }),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

module.exports = { handler };
