import Airtable from 'airtable';

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
    .base(process.env.AIRTABLE_BASE_NAME)

  const body = JSON.parse(event.body)

  try {
    await base.table('Table 1').create({
      'UserId': body.visitorId,
      'Date': body.date,
      'Rating': body.rating,
      'LongForm': body.text,
      'Post Slug': event.headers.referer
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully posted'
      })
    }
  } catch (err) {
    console.log('Error: ', err.toString())
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message })
    }
  }
}