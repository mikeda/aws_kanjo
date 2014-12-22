/*
 * popup、content scriptから使う関数
 */

function get_ec2_price(callback){
  var port = chrome.extension.connect({name: 'get_ec2_price'});
  port.postMessage();
  port.onMessage.addListener(function(message){
    if(message.status == 'done'){
      callback(message.ec2_price);
    }
  });
}

function get_yen_rate(callback){
  var port = chrome.extension.connect({name: 'get_yen_rate'});
  port.postMessage();
  port.onMessage.addListener(function(message){
    if(message.status == 'done'){
      callback(message.yen_rate);
    }
  });
}

function usd_to_yen_per_month(usd, yen_rate){
  return Math.ceil(usd * 24 * 30 * yen_rate);
}
