//首页圆环显示百分比设备状态
/**首页销售图数据来源**/

var groupitemKit = groupitem(4);
var groupitemArray = [];	//图表清单
var groupitemArrays = [];	//状态清单
for(var i = 0; i < groupitemKit.length; i++){
	groupitemArray.push(groupitemKit[i].devicecode);
	console.log(groupitemKit[i]);
	if(groupitemKit[i].stop == 1){
		groupitemArrays.push(groupitemKit[i].devicecode);
	}
}

$.ajax({
	url: URLS + '/networkstate/getHomePage',
	type: 'post',
	data: {
		strArray: JSON.stringify(groupitemArrays),
	},
	success: function(data){
		canvas(data.value);
	}
})
function canvas(allData){
	/*var context = d('canvas');
	var cxt = context.getContext('2d');
	cxt.beginPath();
	cxt.strokeStyle = '#e5e5e5';
	cxt.lineWidth = 10;
	cxt.arc(40,40,35,0,Math.PI*2);
	cxt.stroke();*/
	var total = allData.totalNum;
	var nornal = allData.NornalNum;
	var bad = allData.AbnormalNum;

	var topTotal = c('index_status_list_left_top_total')[0];
	var topNornal = c('index_status_list_left_top_nornal')[0];
	var topBad = c('index_status_list_left_top_bad')[0];
	topTotal.innerHTML = total;
	topNornal.innerHTML = nornal;
	topBad.innerHTML = bad;

	var listNornal = c('index_status_list_right_item_nornal')[0];
	var listBad = c('index_status_list_right_item_bad')[0];
	listNornal.innerHTML = Math.round((nornal)/total*100) + '%';
	listBad.innerHTML = Math.round(bad/total*100) + '%';

	var context1 = d('canvas1');
	var cxt1 = context1.getContext('2d');
	cxt1.beginPath();
	cxt1.strokeStyle = '#4BB622';
	cxt1.lineWidth = 10;
	cxt1.arc(32,32,26,Math.PI*1.5,Math.PI*(1.5 + nornal/total*2),false);
	cxt1.stroke();
	cxt1.beginPath();
	cxt1.strokeStyle = '#FFAE68';
	cxt1.lineWidth = 10;
	cxt1.arc(32,32,26,Math.PI*(1.5 + nornal/total*2),Math.PI*(1.5 + (nornal)/total*2),false);
	cxt1.stroke();

	var context2 = d('canvas2');
	var cxt2 = context2.getContext('2d');
	cxt2.beginPath();
	cxt2.strokeStyle = '#ffc000';
	cxt2.lineWidth = 10;
	cxt2.arc(32,32,26,Math.PI*1.5,Math.PI*(1.5 + bad/total*2),false);
	cxt2.stroke();
}

function Start(){
	var viewDate = new Date();
	ajax({
		type: 'post',
		url: URLS + '/home/show',
		data: {
			objs: JSON.stringify(groupitemArrays),
		},
		dataType: 'json',
		success: function(data){
			console.log(data);
			var indexInventoryTbody = c('index_inventory_tbody')[0];
			console.dir(viewDate);
			if(data.code == 10001){
				for(var i = 0; i < data.data.length; i++){
					var tr = creat('tr');
					var tdArr = creats(8,'td');
					tdArr[0].innerHTML = i+1;
					tdArr[1].innerHTML = data.data[i].machName;
					tdArr[2].innerHTML = data.data[i].machCode;
					tdArr[3].innerHTML = data.data[i].useAddr;
					tdArr[4].innerHTML = data.data[i].outofstock == 1?'在售':'停售';
					tdArr[5].innerHTML = data.data[i].status == 1?'库存不足':'缺货';
					tdArr[6].innerHTML = viewDate.getFullYear() + '-' + (viewDate.getMonth()+1) + '-' + viewDate.getDate() + ' ' + viewDate.getHours() + ':' + viewDate.getMinutes() + ':' + viewDate.getSeconds();
					tdArr[7].innerHTML = '<button onclick="inventoryView(\''+data.data[i].machCode+'\')">查看详情</button>';
					tr.setAppend(tdArr);
					indexInventoryTbody.appendChild(tr);
				}
			}else{
				var tr = creat('tr');
				var td = creat('td');
				td.innerHTML = data.msg;
				td.colSpan = 8;
				td.style.color = '#a4a4a4';
				tr.appendChild(td);
				indexInventoryTbody.appendChild(tr);
			}
		}
	})
}
Start();

function inventoryView(machcode){
	console.log(machcode);
	var indexFixed = c('index_fixed')[0];
	loading();
	ajax({
		type: 'get',
		url: URLS + '/home/show/detailed?machCode=' + machcode,
		dataType: 'json',
		success: function(data){
			console.log(data);
			loadingClear();
			indexFixed.style.display = 'block';
			var indexFixedTbody = c('index_fixed_tbody')[0];
			indexFixedTbody.innerHTML = "";
			for(var i = 0; i < data.data.length; i++){
				var tr = creat('tr');
				var tds = creats(6,'td');
				tds[0].innerHTML = data.data[i].rawName;
				tds[1].innerHTML = data.data[i].rawConfigTotalQuantity;
				tds[2].innerHTML = data.data[i].rawCaveatQuantity;
				tds[3].innerHTML = data.data[i].rawRemainderQuantity;
				tds[4].innerHTML = data.data[i].rawConfigTotalQuantity;
				if(data.data[i].outofstock == 0){
					tds[5].innerHTML = '充足';
				}else if(data.data[i].outofstock == 1){
					tds[5].innerHTML = '库存不足';
				}else if(data.data[i].outofstock == 2){
					tds[5].innerHTML = '缺货';
				}
				tr.setAppend(tds);
				indexFixedTbody.appendChild(tr);
			}
		}
	})
}