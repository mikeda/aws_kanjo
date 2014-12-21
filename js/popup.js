$(function(){
  function update_ec2_price(ec2_price, yen_rate){
    var region = "ap-northeast-1";
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
      $("#ec2-price").append(table);
    });
  }

  get_yen_rate(function(yen_rate){
    $(".yen-rate").text(yen_rate);

    get_ec2_price(function(ec2_price){
      update_ec2_price(ec2_price, yen_rate);
    });

  });
});
