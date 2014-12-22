$(function(){
  function get_ec2_price_hash(callback){
    var ec2_price_hash = {};
    get_ec2_price(function(ec2_price){
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

  $("#footer-content").append('<button id="add-ec2-price" class="btn" style="float:right;">月額チェック</button>');

  $("#add-ec2-price").on("click", function(){
    var region = "ap-northeast-1";
    get_yen_rate(function(yen_rate){
      get_ec2_price_hash(function(ec2_price){
        $("table tbody tr[__gwt_row]").each(function(){
          var td = $(this).find("td").eq(3);
          var instanceType = td.text().trim();

          var state = $(this).find("td:eq(5) span").text().trim();
          var yen_per_month = 0;
          if(state == "running"){
            var usd = ec2_price[region][instanceType];
            var yen_per_month = usd_to_yen_per_month(usd, yen_rate);
          }

          td.attr("width", "400");
          td.text(instanceType + " / ¥" + yen_per_month.toLocaleString());
        });
      });
    });
  });
});
