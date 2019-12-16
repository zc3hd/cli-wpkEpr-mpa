import './index.less';
console.log("-----------16----------");

$('#box')
  .on("click", function() {
    // 异步加载
    require.ensure([], function(require) {
      require('./async_test.css');
    }, 'async_test_css');

    require.ensure([], function(require) {
      var async_test = require('./async_test.js');
      console.log(async_test);
    }, 'async_test_js');
  })



$.ajax({
    url: "/api/js_demo/font.do",
    dataType: "json",
    type: "POST",
  })
  .done(function(data) {
    console.log(data);
  });