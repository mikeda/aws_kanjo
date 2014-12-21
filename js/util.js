/*
 * popup、content scriptから使う関数
 */

function get_ec2_price(callback){
  var port = chrome.extension.connect({name: 'get_ec2_price'});
  port.postMessage();
  port.onMessage.addListener(function(message){
    console.log("done");
    if(message.status == 'done'){
      callback(message.ec2_price);
    }
  });
}

function get_yen_rate(callback){
  var port = chrome.extension.connect({name: 'get_yen_rate'});
  port.postMessage();
  port.onMessage.addListener(function(message){
    console.log("done");
    if(message.status == 'done'){
      callback(message.yen_rate);
    }
  });
}
