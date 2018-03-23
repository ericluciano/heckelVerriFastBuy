'use strict';

document.addEventListener("DOMContentLoaded", function () {

  var API = 'api/catalog_system/pub/products/variations/';

  sessionStorage.setItem('heckel', JSON.stringify({ 'lastState': 0 }));

  var style = '<style>\n    .tamanhos{border:1px solid #c8c8c8;padding:10px;max-width:208px;margin:0 auto;box-sizing:border-box}\n    .tamanho-sku-fast-buy{border:1px solid #f4f4f4;padding:4px;text-decoration:none;box-sizing:border-box;font-size:1.3em;}\n    .tamanho-sku-fast-buy:hover{background:#6a6a6a;border:1px solid #6a6a6a;color:#fff;}\n    .tamanho-content{display: flex;justify-content: center;margin-top: 10px;}\n  </style>';

  document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', style);

  var removeFastBuyAndAddFastBuy2 = function removeFastBuyAndAddFastBuy2() {

    var search = 'btn-fast-buy';
    var btnNameAdd = 'btn-fast-buy2';
    var element = document.querySelectorAll('.' + search);

    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove(search);
      element[i].classList.add(btnNameAdd);
      element[i].href = "#";
    }
  };

  var markup = function markup(item) {
    var els = '\n      <div class="tamanhos">;\n        <p>Escolha o tamanho</p>\n        <div class="tamanho-content">' + item + '</div>\n      </div>';
    return els;
  };

  var mountLinks = function mountLinks(tamanho, sku) {
    return '<a href="#" data-link="/checkout/cart/add?sku=' + sku + '&qty=1&seller=1&redirect=false" class="tamanho-sku-fast-buy">' + tamanho + '</a> &nbsp;';
  };

  $(document).on('click', '.tamanho-sku-fast-buy', function (event) {
    event.preventDefault();

    var url = $(event.currentTarget).data("link");

    $.get(url, function (data) {

      vtexjs.checkout.getOrderForm().done(function (orderForm) {

        $("html, body").animate({ scrollTop: 0 }, 300);

        $(".tamanhos").remove();
      });
    });
  });

  var removeElementsByClass = function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };

  document.body.addEventListener("click", function (event) {
    event.preventDefault();

    var target = event.target;

    while (target) {
      if (target.classList && target.classList.contains('btn-fast-buy2')) {
        break;
      }
      // Note: May want parentElement here instead.
      target = target.parentNode;
    }

    if (!target) {
      return;
    }

    fastBuyButtonClicked(target);
  });

  //$(document).on('click', '.fast-buy-2', function(e){});
  function fastBuyButtonClicked(target) {
    var self = target;
    var id = self.getAttribute('data-id');
    console.log(id);
    var obj = sessionStorage.getItem('heckel');
    self.disabled = true;

    var div_tamanhos_disponiveis = document.getElementsByTagName('tamanhos');

    removeElementsByClass('tamanhos');

    if (obj) {
      obj = JSON.parse(obj);

      if (obj.state && obj.lastState == id) {
        sessionStorage.setItem('heckel', JSON.stringify({ 'lastState': 0 }));
      } else {

        $.get('' + API + id, function (dados) {

          var item = '';
          var i = '.btn-fast-buy2[data-id=' + id + ']';
          var quantidade_items = $(".tamanhos").length;

          dados.skus.forEach(function (v) {
            item += mountLinks(v.dimensions.Tamanho, v.sku);
          });

          if (quantidade_items <= 0) {

            $(i).after(markup(item));

            var fk = { 'state': id, 'lastState': id };

            sessionStorage.setItem('heckel', JSON.stringify(fk));
          }
        }).fail(function (err) {
          console.log(err);
        });
      }
    }
    self.disabled = false;
  };

  removeFastBuyAndAddFastBuy2();
  console.log('chamou');

  var prateleira = 0;

  setTimeout(function () {
    prateleira = $('.prateleira li').length;
  }, 3000);

  $(window).on('scroll', function () {
    if ($('.prateleira li').length > prateleira) {
      removeFastBuyAndAddFastBuy2();
      prateleira = $('.prateleira li').length;
    }
  });
});
