async function getPriceOfStockComponent(stockCode, stockType) {
  // when stock type is Index: stockType = index
  // else stockType = null
  if (!stockType || stockType === null) {
    stockType = "";
  }
  // Define the API URL
  const apiUrl =
    "https://api.simplize.vn/api/historical/quote/" +
    stockCode +
    "?type=" +
    stockType;
  let jsonDatas = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());
  await sleep(SLEEP_TIME_AFTER_CALL_INTEGRATE_API); // sleep 0.5s for prevent spam api
  // console.log(jsonDatas);
  return jsonDatas;
}

async function getAllIndex() {
  // Define the API URL
  const apiUrl =
    "https://simplize.vn/_next/data/LYb7L7zgii63RvDfZ3o7P/chi-so.json";
  let jsonDatas = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());
  await sleep(SLEEP_TIME_AFTER_CALL_INTEGRATE_API); // sleep 0.5s for prevent spam api
  // console.log(jsonDatas);
  return jsonDatas;
}

async function getAllStock() {
  // Define the API URL
  const apiUrl =
    "https://simplize.vn/_next/data/LYb7L7zgii63RvDfZ3o7P/co-phieu.json";
  let jsonDatas = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());
  await sleep(SLEEP_TIME_AFTER_CALL_INTEGRATE_API); // sleep 0.5s for prevent spam api
  // console.log(jsonDatas);
  return jsonDatas;
}
