/*
 * content scriptとpopupでJSONP、CORS周りの挙動が一致しないので、
 * 面倒だけど外部通信はbackgroundに統一
 */

chrome.extension.onConnect.addListener(function(port) {
  switch(port.name){
    case "get_ec2_price":
      port.onMessage.addListener(function(message) {
        AwsPrice.get_ec2_price(function(ec2_price){
          port.postMessage({status: "done", ec2_price: ec2_price});
        }); 
      });
      break;
    case "get_yen_rate":
      port.onMessage.addListener(function(message) {
        ExchangeRate.get_yen_rate(function(yen_rate){
          port.postMessage({status: "done", yen_rate: yen_rate});
        }); 
      });
      break;
  }
});
