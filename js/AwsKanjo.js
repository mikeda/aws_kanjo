/*
 * とりあえずbackgroupdから利用する外部通信系をまとめている
 */

var AwsKanjo = {
  region: "ap-northeast-1"
};

AwsKanjo.get_yen_rate = function(callback){
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

AwsKanjo._jsonp_get = function(url, success){
  $.ajax({
    type: "GET",
    url: url,
    dataType: "jsonp",
    jsonpCallback: 'callback',
    success: success
  });
};

AwsKanjo.get_ec2_price = function(success){
  var current_url = "https://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js";
  var previous_url = "https://a0.awsstatic.com/pricing/1/ec2/previous-generation/linux-od.min.js";
  var ec2_price = {};

  AwsKanjo._jsonp_get(current_url, function(current_data){
    $.each(current_data.config.regions, function(){
      ec2_price[this.region] = this.instanceTypes;
    });

    AwsKanjo._jsonp_get(previous_url, function(previous_data){
      $.each(previous_data.config.regions, function(){
        ec2_price[this.region] = ec2_price[this.region].concat(this.instanceTypes);
      });

      success(ec2_price);
    });
  });
};

AwsKanjo.get_ec2_price_hash = function(success){
  AwsKanjo.get_ec2_price(function(ec2_price){
    var ec2_price_hash = {};
    $.each(ec2_price, function(region, instanceTypes){
      $.each(instanceTypes, function(i, instanceType){
        $.each(instanceType.sizes, function(i, size){
          ec2_price_hash[size.size] = parseFloat(size.valueColumns[0].prices.USD)
        });
      });
    });
    callback(ec2_price_hash);
  });
};
