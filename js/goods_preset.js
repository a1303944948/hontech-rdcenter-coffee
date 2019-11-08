var rawType = 0;
function start(){
	Authority(loginUserName.empcode);

	var Select = c('item_select');

	//为body部分高度布局
	var obody = c('operator_body')[0];
	obody.style.height = window.innerHeight - 119 + 'px';

	//原料阈值初始化获取
	ajax({
		type: 'get',
		url: URLX + '/product/raw/get?rawCode=',
		data: {},
		dataType: 'json',
		success: function(data){
			var operatorBodyRightFootItemTableTbody = c('operator_body_right_foot_item_table_tbody')[0];
			operatorBodyRightFootItemTableTbody.innerHTML = '';
			for(var i = 0; i < data.data.length; i++){
				var tr = creat('tr');
				var tda = creat('td');
				var tdb = creat('td');
				tda.innerHTML = data.data[i].rawName + '：';
				tdb.innerHTML = '<input class="raw_list" type="text" data-value="'+data.data[i].rawId+'" name="'+data.data[i].rawCode+'" value=""/>';
				tr.appendChild(tda);
				tr.appendChild(tdb);
				operatorBodyRightFootItemTableTbody.appendChild(tr);
			}
		}
	})

	//商品预设数据获取
	ajax({
		type: 'get',
		url: URLX + '/product/element/get?code=',
		data: {},
		dataType: 'json',
		success: function(data){
			var bodyLeftListUlLi = c('operator_body_left_ul_li');
			for(var i = bodyLeftListUlLi.length-1;i > -1; i--){
				bodyLeftListUlLi[i].parentNode.removeChild(bodyLeftListUlLi[i]);
			}
			var BodyLeft = c('operator_body_left_ul')[0];
			if(data.data != undefined){
				for(var i = 0; i < data.data.length; i++){
					let li = creat('li');
					li.className = 'operator_body_left_ul_li';
					let button = creat('button');
					button.className = 'operator_body_left_list';
					button.innerHTML = '<img src="image/hd.png"/>' + data.data[i].productName;
					button.name = JSON.stringify(data.data[i]);
					/*let buttonDelete = creat('button');
					buttonDelete.className = 'operator_body_left_list_delete';
					buttonDelete.innerHTML = '<img src="image/sc.png"/>';
					buttonDelete.name = JSON.stringify(data.data[i].rawCode);
					buttonDelete.onclick = function(){
						if(confirm('删除操作会导致所有用户的消息列表中的该条消息被删除！')){
							let buttonDeleteObj = {};
							buttonDeleteObj.id = JSON.parse(this.name).id;
							$.ajax({
								type: 'post',
								url: URLX + '/jf/announcement/delete.json',
								data: {
									obj: JSON.stringify(buttonDeleteObj),
								},
								success: function(data){
									alern(data.msg);
									start();
									d('body_creat').click();
									noticed();
								}
							})
						}
					};*/
					li.appendChild(button);
					BodyLeft.appendChild(li);
				}
			}

			var bodyLeftList = c('operator_body_left_list');
			for(var i = 0; i < bodyLeftList.length; i++){
				(function(q){
					bodyLeftList[q].onclick = function(){
						rawType = 2;
						for(var j = 0; j < bodyLeftList.length; j++){
							bodyLeftList[j].style.backgroundColor = "rgba(0,0,0,0)";
						}
						bodyLeftList[q].style.backgroundColor = "#e5e5e5";
						var rightFootItem = c('operator_body_right_foot_item')[0];
						rightFootItem.style.display = "block";
						var thisName = JSON.parse(this.name);
						var operatorId = d('operator_id');
						operatorId.value = thisName.productName;

						var productId = d('product_id');
						productId.value = thisName.code;
						productId.disabled = true;

						//原料阈值渲染
						var rawList = c('raw_list');
						for(var j = 0; j < thisName.rawMaterialBOs.length; j++){
							for(var k = 0; k < rawList.length; k++){
								if(thisName.rawMaterialBOs[j].rawCode == rawList[k].name){
									thisName.rawMaterialBOs[j].rawQuantity == 0?rawList[k].value = '':rawList[k].value = thisName.rawMaterialBOs[j].rawQuantity;
								};
							}
						}
					}
				})(i)
			}
		}
	})
	//DATAHEAD = listMenu();

	var BottomUl = c('operator_body_right_head_bottom_ul')[0];
	BottomUl.innerHTML = "";
	for(var i = 0; i < DATAHEAD.length; i++){
		var li = creat('li');
		li.innerHTML = DATAHEAD[i].text;
		li.setAttribute('data-menuid',DATAHEAD[i].menuid);
		BottomUl.appendChild(li);
	}
	var divClear = creat('div');
	divClear.className = 'clear';
	BottomUl.appendChild(divClear);


	//渲染右边table切换
	var footList = c('operator_body_right_foot_list');
	var ulLi = c('operator_body_right_head_bottom_ul')[0].children;

	var allNone = 0;
	for(var i = 0; i < DATAHEAD.length; i++){
		if(DATAHEAD[i].value == 1){
			for(var j = 0; j < footList.length; j++){
				footList[j].style.display = 'none';
			}
			footList[i].style.display = 'block';
			ulLi[i].style.borderTop = '2px #16b904 solid';
			ulLi[i].style.borderLeft = '1px #e5e5e5 solid';
			ulLi[i].style.borderRight = '1px #e5e5e5 solid';
			ulLi[i].style.marginTop = '-1px';
			ulLi[i].style.color = '#666666';
			ulLi[i].style.backgroundColor = '#ffffff';
			allNone = 1;
			break;
		}
	}
	if(allNone == 0){
		for(var j = 0; j < footList.length; j++){
			footList[j].style.display = 'none';
		}
	}
}

//初始化渲染布局
window.onresize = function(){
	var obody = c('operator_body')[0];
	obody.style.height = window.innerHeight - 119 + 'px';
}

function submit(){
	var bodyCreat = d('body_creat');		//创建按钮
	var bodySubmit = d('body_submit');		//保存按钮
	var productId = d('product_id');		//产品ID
	var operatorId = d('operator_id');		//商品名称
	var rawList = c('raw_list');			//原料阈值
	bodyCreat.onclick = function(){
		rawType = 1;
		d('body_submit').style.display = '';
		var rightFootItem = c('operator_body_right_foot_item')[0];
		rightFootItem.style.display = "block";
		operatorId.value = "";

		var rawList = c('raw_list');
		for(var j = 0; j < rawList.length; j++){
			rawList[j].value = '';
		}//清空原料阈值内容

		//清空产品ID内容
		productId.value = '';
		productId.disabled = false;
		
		var bodyLeftList = c('operator_body_left_list');
		for(var j = 0; j < bodyLeftList.length; j++){
			bodyLeftList[j].style.backgroundColor = "rgba(0,0,0,0)";
		}
	}
	bodySubmit.onclick = function(){
		if(productId.value == ""){
			alern('产品ID不能为空！');
			return false;
		}
		if(operatorId.value == ""){
			alern('原料名称不能为空！');
			return false;
		}
		let noticeObj = {};
		noticeObj.code = productId.value;
		noticeObj.productName = operatorId.value;
		noticeObj.operatorId = '';
		var rawListArr = [];
		for(var j = 0; j < rawList.length; j++){
			console.log(rawList[j].value);
			var rawListObj = {};
			if(rawList[j].value != ""){
				rawListObj.rawCode = rawList[j].name;
				rawListObj.rawId = rawList[j].dataset.value;
				rawListObj.rawQuantity = rawList[j].value;
				rawListArr.push(rawListObj);
			}else{
				rawListObj.rawCode = rawList[j].name;
				rawListObj.rawId = rawList[j].dataset.value;
				rawListObj.rawQuantity = 0;
				rawListArr.push(rawListObj);
			}
		}
		noticeObj.rawMaterialVOs = rawListArr;
		console.log(JSON.stringify(noticeObj));
		if(rawType == 1){
			ajax({
				type: 'post',
				url: URLX + '/product/element/add',
				data: {
					obj: JSON.stringify(noticeObj),
				},
				success: function(data){
					start();
					bodyCreat.click();
					noticed();
				}
			})
		}else{
			ajax({
				type: 'post',
				url: URLX + '/product/element/update',
				data: {
					obj: JSON.stringify(noticeObj),
				},
				success: function(data){
					console.log(data);
					start();
					bodyCreat.click();
					noticed();
				}
			})
		}
	}
}
start();
submit();