/**
 * Created by uncle on 16/6/30.
 */
function doSelect() {
	//获取条件
	var resData = {};
	var orderColumn = $('#orderColumn').val();
	var orderType = $('#orderType').val();
	resData.order = {key: orderColumn, value: orderType};//排序
	resData.num = $('#num').val();
	var conditions = $('.condition');
	var conditionsArr = [];
	var condition = {};
	$.each(conditions, function (index, con) {
		if ($(con).find('.conditionOn').is(':checked')) {
			condition.key = $(con).find('.whereColumn').val();
			condition.symbol = $(con).find('.whereSymbol').val();
			condition.value = $(con).find('.whereValue').val();
			conditionsArr.push(condition);
		}
	});
	resData.conditions = conditionsArr;
	console.log(resData);
	$.ajax({
		type: 'GET',
		url: '/logs',
		data: resData,
		dataType: 'json',
		cache: false,
		success: function (returnData) {
			pack(returnData.rows);
		},
		error: function (returnData) {
			showError(returnData.responseText);
		}
	})
}

function pack(datas) {
	if (datas.length == 0) {
		$('#result').html('无结果');
		return;
	}
	var tdsHtml = '';
	datas.forEach(function (item) {
		tdsHtml += '<tr>' +
			'<td>' + item.id + '</td>' +
			'<td>' + item.appUserId + '</td>' +
			'<td>' + item.crashTime + '</td>' +
			'<td>' + item.devType + '</td>' +
			'<td>' + item.appVersionName + '</td>' +
			'<td>' + item.appVersionCode + '</td>' +
			'<td>' + item.androidSdkVersion + '</td>' +
			'<td>' + item.androidOsVersion + '</td>' +
			'<td>' + item.iosVersion + '</td>' +
			'<td>' + item.stackTrace + '</td>' +
			'<td>' + item.deviceInfo + '</td>' +
			'<td>' + item.manufacturer + '</td>' +
			'</tr>'
	});
	$('#result').html(tdsHtml);
	$('td').click(function (e) {
		console.log(this.innerHTML);
		show(this.innerHTML);
	})
}
function show(text) {
	$('#detail').val(text);
}
function doClear() {
	// $('#detail').val('');
	$('#detail').css({'height': '60px'});
}
function doExpand() {
	$('#detail').css({'height': '500px'});
}
function showError(error) {
	$('#result').html(error);
}
function doAddConditions() {
	$('.conditions').append(' AND ');
	$($('.condition')[0]).clone().appendTo('.conditions');
	//重置高度
	var height = $('#head').height();
	$('#table-container').css('top', height);
}