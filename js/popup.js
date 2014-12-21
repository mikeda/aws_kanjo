$(function(){
  var regions = [
    "us-east-1",
    "us-west-2",
    "us-west-1",
    "eu-west-1",
    "eu-central-1",
    "ap-southeast-1",
    "ap-northeast-1",
    "ap-southeast-2",
    "sa-east-1"
  ];
  var default_region = "ap-northeast-1";
  var ec2_price = null;
  var yen_rate = null;

  function update_ec2_price(ec2_price, region, yen_rate){
    $("#ec2-price-list").empty();

    $.each(ec2_price[region], function(i, instanceType){
      var table = $('<table class="table table-striped table-condensed">');
      table.append('<caption class="text-left">' + instanceType.type + '</caption>');
      var th = $('<tr>')
        .append('<th>サイズ</th>')
        .append('<th>CPU</th>')
        .append('<th>メモリ</th>')
        .append('<th>月額</th>');
      table.append($('<thead>').append(th));
      var tbody = $('<tbody>');
      $.each(instanceType.sizes, function(i, size){
        var usd = parseFloat(size.valueColumns[0].prices.USD);
        var yen = Math.ceil(usd * yen_rate);
        var yen_per_month = yen * 24 * 30;
        var td = $('<tr>')
          .append('<th ">' + size.size + '</th>')
          .append('<td align="right">' + size.vCPU + '</td>')
          .append('<td align="right">' + size.memoryGiB + '</td>')
          .append('<td align="right">¥' + yen_per_month.toLocaleString() + '</td>');

        tbody.append(td);
      });
      table.append(tbody);
      $("#ec2-price-list").append(table);
    });
  }

  function update_ec2_price_csv(ec2_price, region, yen_rate){
    $("#ec2-price-csv").empty();

    var lines = [
      "サイズ,CPUコア数,メモリ,ストレージ,月額"
    ];
    $.each(ec2_price[region], function(i, instanceType){
      $.each(instanceType.sizes, function(i, size){
        var usd = parseFloat(size.valueColumns[0].prices.USD);
        var yen = Math.ceil(usd * yen_rate);
        var yen_per_month = yen * 24 * 30;
        lines.push( [
          size.size,
          size.vCPU,
          size.memoryGiB,
          size.storageGB,
          yen_per_month
        ].join(","));
      });
    });
    $("#ec2-price-csv").text(lines.join("\n"));
  }

  $.each(regions, function(){
    $("#region-list").append('<li><a href="#">' + this + '</a></li>');
  });
  $("#region-btn").html(default_region + ' <span class="caret"></span>');
  $("#region-list li").on("click", function(){
    var region = $(this).text();
    $("#region-btn").html(region + ' <span class="caret"></span>');
    update_ec2_price(ec2_price, region, yen_rate);
    update_ec2_price_csv(ec2_price, region, yen_rate);
  });

  get_yen_rate(function(_yen_rate){
    yen_rate = _yen_rate;
    $(".yen-rate").text(yen_rate);

    get_ec2_price(function(_ec2_price){
      ec2_price = _ec2_price;
      update_ec2_price(ec2_price, default_region, yen_rate);
      update_ec2_price_csv(ec2_price, default_region, yen_rate);
    });

  });
});
