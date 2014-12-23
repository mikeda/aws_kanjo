/*
 * popup、content scriptから使う関数
 */

var FrontUtil = {};

FrontUtil.get_ec2_price = function(callback){
  var port = chrome.extension.connect({name: 'get_ec2_price'});
  port.postMessage();
  port.onMessage.addListener(function(message){
    if(message.status == 'done'){
      callback(message.ec2_price);
    }
  });
}

// {
//   "ap-northeast-1": {
//     "t2.micro": 0.02,
//     "t2.small": 0.04,
//     ...
FrontUtil.get_ec2_price_hash = function(callback){
  var ec2_price_hash = {};
  FrontUtil.get_ec2_price(function(ec2_price){
    $.each(ec2_price, function(region, instanceTypes){
      if(!ec2_price_hash[region]) ec2_price_hash[region] = {};
      $.each(instanceTypes, function(i, instanceType){
        $.each(instanceType.sizes, function(i, size){
          ec2_price_hash[region][size.size] = parseFloat(size.valueColumns[0].prices.USD);
        });
      });
    });
    callback(ec2_price_hash);
  });
}

FrontUtil.get_yen_rate = function(callback){
  var port = chrome.extension.connect({name: 'get_yen_rate'});
  port.postMessage();
  port.onMessage.addListener(function(message){
    if(message.status == 'done'){
      callback(message.yen_rate);
    }
  });
}

FrontUtil.usd_to_yen_per_month = function(usd, yen_rate){
  return Math.ceil(usd * 24 * 30 * yen_rate);
}
