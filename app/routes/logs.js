var express = require('express');
var router = express.Router();
var pg = require('pg');

/* GET logs listing. */
router.get('/', function (req, res, next) {
	//----------------------------------------------------------------------------
	//构造连接数据库的连接字符串："tcp://用户名:密码@ip/相应的数据库名"
	var conString = "tcp://用户名:密码@ip/相应的数据库名";

	var client = new pg.Client(conString);  //构造一个数据库对象

	var resData = req.query;
	console.log('====查询数据:' + JSON.stringify(resData));
	var orderBySql = ' order by ' + '"' + resData.order.key + '"' + ' ' + resData.order.value;
	var whereSql = 'where ';
	resData.conditions && resData.conditions.forEach(function (condition) {
		condition.symbol == 'like' ? condition.value = "'%" + condition.value + "%'" : '';
		whereSql += '"' + condition.key + '" ' + condition.symbol + ' ' + condition.value;
	});
	whereSql == 'where ' ? whereSql = '' : whereSql;
	var sql = "select * from sso_crashlog " + whereSql + orderBySql + " limit " + resData.num + " offset 0";

	//连接数据库，连接成功，执行回调函数
	client.connect(function (error, results) {
		if (error) {
			console.log('数据库连接失败: ' + error.message);
			client.end();
		}
		console.log("数据库连接成功\n");
	});

	//执行相应的sql语句
	client.query(sql, function (error, results) {
		console.log("in callback function.\n");
		if (error) {
			console.log("error");
			console.log('GetData Error: ' + error.message);
			client.end();
			return next(error);
		}
		// if (results.rowCount > 0) {
		// //callback(results);
		// //指定为json格式输出
		// res.writeHead(200, {"Content-Type": "application/json"});
		// //先将results 字符串内容转化成json格式，然后响应到浏览器上
		// res.write(JSON.stringify(results));
		// res.end();
		res.json(results);
		// }
	});
	//----------------------------------------------------------------------------
});


module.exports = router;

