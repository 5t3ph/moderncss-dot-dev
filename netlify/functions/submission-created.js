const fetch = require("node-fetch");

exports.handler = async (event) => {
  const ckID = process.env.CKFORMID;
  const ckUrl = `https://api.convertkit.com/v3/forms/${ckID}/subscribe`;
  const { form_name, first_name, email } = JSON.parse(event.body).payload;

  console.log(`Recieved a submission: ${email}`);

  if (form_name === "newsletter") {
    return fetch(ckUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.CKAPIKEY,
        first_name: first_name,
        email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Submitted to ConvertKit:\n ${data}`);
      })
      .catch((error) => ({ statusCode: 422, body: String(error) }));
  }
};
