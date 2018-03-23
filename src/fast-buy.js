document.addEventListener("DOMContentLoaded", () => {
  // api url
  const API = 'api/catalog_system/pub/products/variations/';
  // create session
  sessionStorage.setItem('heckel', JSON.stringify({'lastState':0}));
  // style
  const style = `<style>
    .tamanhos{border:1px solid #c8c8c8;padding:10px;max-width:208px;margin:0 auto;box-sizing:border-box}
    .tamanho-sku-fast-buy{border:1px solid #f4f4f4;padding:4px;text-decoration:none;box-sizing:border-box;font-size:1.3em;}
    .tamanho-sku-fast-buy:hover{background:#6a6a6a;border:1px solid #6a6a6a;color:#fff;}
    .tamanho-content{display: flex;justify-content: center;margin-top: 10px;}
  </style>`;
  // add style header
  document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', style);

  const removeFastBuyAndAddFastBuy2 = () => {

    const search = 'btn-fast-buy';
    const btnNameAdd = 'btn-fast-buy2';
    const element = document.querySelectorAll(`.${search}`);

    for(var i = 0; i < element.length; i++) {
      element[i].classList.remove(search);
      element[i].classList.add(btnNameAdd);
    }

  };

  const markup = (item) => {
    let els = `
      <div class="tamanhos">;
        <p>Escolha o tamanho</p>
        <div class="tamanho-content">${item}</div>
      </div>`;
    return els;
  };

  const mountLinks = (tamanho, sku) => {
    return `<a href="#" data-link="/checkout/cart/add?sku=${sku}&qty=1&seller=1&redirect=false" class="tamanho-sku-fast-buy">${tamanho}</a> &nbsp;`;
  };

  $(document).on('click', '.tamanho-sku-fast-buy', (event) => {
    event.preventDefault();

    let url = $(event.currentTarget).data("link");

    $.get(url, (data) => {

      vtexjs.checkout.getOrderForm().done((orderForm) => {

        $("html, body").animate({scrollTop: 0}, 300);

        $(".tamanhos").remove();

      });

    });

  });

  $(document).on('click','.btn-fast-buy2', (event) => {
    event.preventDefault();
    $(event.currentTarget).prop('disabled', true);

    let id = $(event.currentTarget).data('id');
    let obj = sessionStorage.getItem('heckel');

    $(".tamanhos").remove();

    if(obj) {
      obj = JSON.parse(obj);

      if(obj.state && obj.lastState == id) {

        sessionStorage.setItem('heckel', JSON.stringify({'lastState':0}));

      } else {

        $.get(`${API}${id}`, (dados) => {

          let item = '';
          let i = `.btn-fast-buy2[data-id=${id}]`;
          let quantidade_items = $(".tamanhos").length;

          $.each(dados.skus, (k, v) => {
            item += (mountLinks(v.dimensions.Tamanho, v.sku))
          });

          if(quantidade_items <= 0) {

            $(i).after(markup(item));

            let fk = {'state': id, 'lastState': id};

            sessionStorage.setItem('heckel', JSON.stringify(fk));

          }

        })
        .fail((err) => {
          console.log(err);
        });
      }
    }
    $(event.currentTarget).prop('disabled', false);
  })

  removeFastBuyAndAddFastBuy2();

  let prateleira = 0;

  setTimeout(() => {
    prateleira = $('.prateleira li').length;
  },3000);

  $(window).on('scroll', () => {
    if($('.prateleira li').length > prateleira) {
      removeFastBuyAndAddFastBuy2();
      prateleira = $('.prateleira li').length;
    }
  });

});
