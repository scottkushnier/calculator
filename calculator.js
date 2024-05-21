function numsToList(numsAsString) {
  return numsAsString.split(",").map((x) => +x);
}

function numsGood(numsAsString) {
  return !numsAsString.split(",").find((x) => isNaN(x));
}

class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    console.error(this.stack);
  }
}

function mean(nums) {
  let acc = 0;
  let count = 0;
  for (let num of nums) {
    acc += num;
    count++;
  }
  return acc / count;
}

function numSort(nums) {
  return nums.sort((x, y) => x - y);
}

function median(nums) {
  const sorted = numSort(nums);
  const len = nums.length;
  if (len % 2 == 1) {
    return sorted[(len - 1) / 2];
  } else {
    return (sorted[len / 2 - 1] + sorted[len / 2]) / 2;
  }
}

function mode(nums) {
  // get frequencies
  const freqs = {};
  for (let num of nums) {
    if (freqs[num]) {
      freqs[num]++;
    } else {
      freqs[num] = 1;
    }
  }
  // get highest frequency
  let max = 0;
  for (let key of Object.keys(freqs)) {
    if (freqs[key] > max) {
      max = freqs[key];
    }
  }
  // collect all keys with that freq
  let acc = [];
  for (let key of Object.keys(freqs)) {
    if (freqs[key] == max) {
      acc.push(key);
    }
  }
  return acc;
}

////////////////////////////////////////////////////////////////

const express = require("express");

const app = express();

app.get("/mean", function (request, response) {
  if (!request.query.nums) {
    throw new ExpressError("nothing sent to mean function!", 400);
  }
  if (!numsGood(request.query.nums)) {
    throw new ExpressError("bad numbers list", 400);
  }
  const val = mean(numsToList(request.query.nums));
  return response.json({
    response: {
      operation: "mean",
      value: val,
    },
  });
});

app.get("/median", function (request, response) {
  if (!request.query.nums) {
    throw new Error("nothing sent to median function!");
  }
  if (!numsGood(request.query.nums)) {
    throw new ExpressError("bad numbers list", 400);
  }
  const val = median(numsToList(request.query.nums));
  return response.json({
    response: {
      operation: "median",
      value: val,
    },
  });
});

app.get("/mode", function (request, response) {
  if (!request.query.nums) {
    throw new Error("nothing sent to mode function!");
  }
  if (!numsGood(request.query.nums)) {
    throw new ExpressError("bad numbers list", 400);
  }
  let val = mode(numsToList(request.query.nums));
  if (val.length == 1) {
    val = val[0];
  }
  return response.json({
    response: {
      operation: "mode",
      value: val,
    },
  });
});

app.use(function (req, res) {
  throw new ExpressError("no route found", 404);
});

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Errorlet status = err.status || 500;
  let message = err.message;
  let status = err.status || 500;
  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, function () {
  console.log("App on port 3000");
});
