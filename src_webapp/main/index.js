import './index.less';


// 异步加载
require.ensure([], function(require) {
  require('./test.css');
  var obj = require('./test.js');


  $('#box')
    .on("click", function() {
      console.log("函数内部的执行");

      obj.fn();
    });

}, 'test_js');




// $.ajax({
//     url: "/api/js_demo/font.do",
//     dataType: "json",
//     type: "POST",
//   })
//   .done(function(data) {
//     console.log(data);
//   });