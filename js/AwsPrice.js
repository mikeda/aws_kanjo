/*
 * backgroundで使うAWSの料金取得機能
 */

var AwsPrice = {};

AwsPrice._jsonp_get = function(url, success){
  $.ajax({
    type: "GET",
    url: url,
    dataType: "jsonp",
    jsonpCallback: 'callback',
    success: success
  });
};

AwsPrice.get_ec2_price = function(success){
  var current_url = "https://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js";
  var previous_url = "https://a0.awsstatic.com/pricing/1/ec2/previous-generation/linux-od.min.js";
  var ec2_price = {};

  AwsPrice._jsonp_get(current_url, function(current_data){
    $.each(current_data.config.regions, function(){
      ec2_price[this.region] = this.instanceTypes;
    });

    AwsPrice._jsonp_get(previous_url, function(previous_data){
      $.each(previous_data.config.regions, function(){
        ec2_price[this.region] = ec2_price[this.region].concat(this.instanceTypes);
      });

      success(ec2_price);
    });
  });
};

AwsPrice.get_ec2_price_hash = function(success){
  AwsPrice.get_ec2_price(function(ec2_price){
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
