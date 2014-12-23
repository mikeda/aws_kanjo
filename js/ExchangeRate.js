/*
 * backgroupdで使う為替相場取得機能
 */

var ExchangeRate = {};

ExchangeRate.get_yen_rate = function(callback){
  $.ajax({
    type: "GET",
    url: "https://rate-exchange.appspot.com/currency?from=usd&to=jpy",
    dataType: "json",
    success: function(data) {
      var yen_rate = data.rate;
      callback(yen_rate);
    }
  });
};
