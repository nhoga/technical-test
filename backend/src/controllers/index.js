const { Pool } = require("pg");
const axios = require("axios");
require("dotenv").config();

const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: "ucamp",
});

const getStart = (req, res) => {
  res.send("U Camp Technical Test / Back-End");
};

const getResults = async (req, res) => {
  if (req.query.sort && !req.query.condition) {
    console.log("sort");
    const name = req.query.query;
    const offset = req.query.offset;
    const sort = req.query.sort;

    axios
      .get(
        (await "https://api.mercadolibre.com/sites/MLA/search?q=") +
          name +
          "&limit=30" +
          "&offset=" +
          offset +
          "&sort=" +
          sort
      )
      .then((response) => {
        let allData = {};
        const newData = [];
        response.data.results.map((result) =>
          newData.push({
            id: result.id,
            title: result.title,
            price: result.price,
            currency_id: result.currency_id,
            available_quantity: result.available_quantity,
            thumbnail: result.thumbnail,
            condition: result.condition,
          })
        );
        allData = {
          total: response.data.paging.total,
          results: newData,
        };

        return res.send(allData);
      })
      .catch((error) => console.log("ERROR", error));
  } else if (req.query.condition && !req.query.sort) {
    const name = req.query.query;
    const offset = req.query.offset;
    const condition = req.query.condition;
    console.log("condition");
    axios
      .get(
        (await "https://api.mercadolibre.com/sites/MLA/search?q=") +
          name +
          "&limit=30" +
          "&offset=" +
          offset +
          "&item_condition=" +
          condition
      )
      .then((response) => {
        let allData = {};
        const newData = [];
        response.data.results.map((result) =>
          newData.push({
            id: result.id,
            title: result.title,
            price: result.price,
            currency_id: result.currency_id,
            available_quantity: result.available_quantity,
            thumbnail: result.thumbnail,
            condition: result.condition,
          })
        );
        allData = {
          total: response.data.paging.total,
          results: newData,
        };

        return res.send(allData);
      })
      .catch((error) => console.log("ERROR", error));
  } else if (
    req.query.condition &&
    req.query.sort &&
    req.query.query &&
    req.query.offset
  ) {
    const name = req.query.query;
    const offset = req.query.offset;
    const sort = req.query.sort;
    const condition = req.query.condition;
    console.log("all");
    axios
      .get(
        (await "https://api.mercadolibre.com/sites/MLA/search?q=") +
          name +
          "&limit=30" +
          "&offset=" +
          offset +
          "&item_condition=" +
          condition +
          "&sort=" +
          sort
      )
      .then((response) => {
        let allData = {};
        const newData = [];
        response.data.results.map((result) =>
          newData.push({
            id: result.id,
            title: result.title,
            price: result.price,
            currency_id: result.currency_id,
            available_quantity: result.available_quantity,
            thumbnail: result.thumbnail,
            condition: result.condition,
          })
        );
        allData = {
          total: response.data.paging.total,
          results: newData,
        };

        return res.send(allData);
      })
      .catch((error) => console.log("ERROR", error));
  } else if (req.query) {
    console.log("query");
    const name = req.query.query;
    const offset = req.query.offset;
    axios
      .get(
        (await "https://api.mercadolibre.com/sites/MLA/search?q=") +
          name +
          "&limit=30" +
          "&offset=" +
          offset
      )
      .then((response) => {
        let allData = {};
        const newData = [];
        response.data.results.map((result) =>
          newData.push({
            id: result.id,
            title: result.title,
            price: result.price,
            currency_id: result.currency_id,
            available_quantity: result.available_quantity,
            thumbnail: result.thumbnail,
            condition: result.condition,
          })
        );
        allData = {
          total: response.data.paging.total,
          results: newData,
        };

        return res.send(allData);
      })
      .catch((error) => console.log("ERROR", error));
  }
};

module.exports = {
  getStart,
  getResults,
};
