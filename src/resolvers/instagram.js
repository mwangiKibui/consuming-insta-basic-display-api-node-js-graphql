const { UserInputError } = require("apollo-server-express");
const { get } = require("axios").default;
const { post } = require("request");
const { promisify } = require("util");
require("dotenv").config();

const postAsync = promisify(post);

// getting a short lived access token

async function getShortLivedAccessToken() {
  // send request to the API
  let { body, statusCode } = await postAsync({
    url: `https://api.instagram.com/oauth/access_token `,
    formData: {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      redirect_uri: "https://httpstat.us/200",
      code: process.env.AUTHORIZATION_CODE,
      grant_type: "authorization_code",
    },
    headers: {
      "content-type": "multipart/form-data",
      host: "api.instagram.com",
    },
  });

  let response = JSON.parse(body);

  // check if there is an error, if there is, send it.
  if (statusCode !== 200) {
    let error_message = response.error_message;
    return new UserInputError(error_message);
  }

  // return the response
  return response;
}

// getting a long lived access token
async function getLongLivedAccessToken() {
  let response;

  // send request to the API
  try {
    response = await get("https://graph.instagram.com/access_token", {
      params: {
        grant_type: "ig_exchange_token",
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        access_token: process.env.SHORT_LIVED_AT,
      },
      headers: {
        host: "graph.instagram.com",
      },
    });
  } catch (error) {
    // Catch an error and return it.
    return new UserInputError(error);
  }

  // If no error, return the response.
  response = response["data"];
  return response;
}

// getting profile data
async function getProfileData() {
  let response;

  // send request to the API
  try {
    response = await get("https://graph.instagram.com/me", {
      params: {
        fields: "id,username,media_count,account_type",
        access_token: process.env.LONG_LIVED_AT,
      },
      headers: {
        host: "graph.instagram.com",
      },
    });
  } catch (error) {
    // Catch an error and return it.
    return new UserInputError(error);
  }

  // If no error, return the response.
  response = response["data"];
  return response;
}

// getting media data
async function getUserMediaData() {
  let response;

  // Send request to the API
  try {
    response = await get("https://graph.instagram.com/me/media", {
      params: {
        fields:
          "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username",
        access_token: process.env.LONG_LIVED_AT,
      },
      headers: {
        host: "graph.instagram.com",
      },
    });
  } catch (error) {
    // Catch an error and return it.
    return new UserInputError(error);
  }

  // If no error, return the response.
  response = response["data"];
  return response.data;
}

// getting a single media
async function getSingleMediaData(media_id) {
  let response;

  // send request to the API
  try {
    response = await get(`https://graph.instagram.com/${media_id}`, {
      params: {
        fields:
          "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,username",
        access_token: process.env.LONG_LIVED_AT,
      },
      headers: {
        host: "graph.instagram.com",
      },
    });
  } catch (error) {
    // Catch an error, and return it
    return new UserInputError(error);
  }

  // If no error, return the response
  response = response["data"];
  return response;
}

// getting album content
async function getAlbumData(album_id) {
  let response;

  // sending request to API
  try {
    response = await get(`https://graph.instagram.com/${album_id}/children`, {
      params: {
        fields: "id,media_url,media_type,permalink,timestamp,username",
        access_token: process.env.LONG_LIVED_AT,
      },
      headers: {
        host: "graph.instagram.com",
      },
    });
  } catch (error) {
    // Catch an error and return it.
    return new UserInputError(error);
  }

  // If no error, return the result.
  response = response["data"];
  return response.data;
}

module.exports = {
  getShortLivedAccessToken,
  getLongLivedAccessToken,
  getProfileData,
  getUserMediaData,
  getSingleMediaData,
  getAlbumData,
};
