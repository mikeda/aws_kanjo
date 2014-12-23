$(function(){
  $("#footer-content").append('<button id="add-ec2-price" class="btn" style="float:right;">月額チェック</button>');

  $("#add-ec2-price").on("click", function(){
    var region = "ap-northeast-1";
    FrontUtil.get_yen_rate(function(yen_rate){
      FrontUtil.get_ec2_price_hash(function(ec2_price){
        $("table tbody tr[__gwt_row]").each(function(){
          var td = $(this).find("td").eq(3);
          var instanceType = td.text().trim();

          var state = $(this).find("td:eq(5) span").text().trim();
          var yen_per_month = 0;
          if(state == "running"){
            var usd = ec2_price[region][instanceType];
            var yen_per_month = FrontUtil.usd_to_yen_per_month(usd, yen_rate);
          }

          td.attr("width", "400");
          td.text(instanceType + " / ¥" + yen_per_month.toLocaleString());
        });
      });
    });
  });
});
