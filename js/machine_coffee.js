var userBodyRightFootItemCommodityaTbody = c('user_body_right_foot_item_commoditya_tbody')[0];	//商品配置主体
function AddCoffee(){
	var userBodyRightFootItemBtncb = c('user_body_right_foot_item_btncb')[0];						//商品配置添加按钮

	//下拉框商品
	var userBodyRightFootItemCommodityaTbodyArr = [];
	ajax({
		type: 'post',
		url: URLS + '/commodityconfig/getGoodsByOperPartyID',
		data: {
			operPartyID: loginUserName.operatorID,
		},
		dataType: 'json',
		success: function(data){
			for(var i = 0; i < data.value.length; i++){
				var userBodyRightFootItemCommodityaTbodyObj = {};
				userBodyRightFootItemCommodityaTbodyObj.name = data.value[i].waresName;
				userBodyRightFootItemCommodityaTbodyObj.value = data.value[i].waresId;
				userBodyRightFootItemCommodityaTbodyObj.code = data.value[i].ingredientCode;
				userBodyRightFootItemCommodityaTbodyArr.push(userBodyRightFootItemCommodityaTbodyObj);
			}

			userBodyRightFootItemBtncb.onclick = function(){
				CoffeeList(userBodyRightFootItemCommodityaTbodyArr);
			}
		}
	})

	/*商品配置保存按钮效果*/
	var itemBtnca = c('user_body_right_foot_item_btnca')[0];
	itemBtnca.onclick = function(){
		var itemCommodityaTbody = c('user_body_right_foot_item_commoditya_tbody')[0];
		var objTbody = [];	//被提交的数据集合
		var objArr = [];	//检测商品是否重复集合（内为纯粹的商品编号）
		var objError = "";	//将所有报错数据汇总到一起提示
		for(var i = 0; i < itemCommodityaTbody.children.length; i++){
			var objTbodys = {};
			if(itemCommodityaTbody.children[i].children[1].children[0].value == ""){
				objError += '第' + itemCommodityaTbody.children[i].children[0].innerHTML + '行商品不能为空!<br/>';
			}
			if(itemCommodityaTbody.children[i].children[2].children[0].value == ""){
				objError += '第' + itemCommodityaTbody.children[i].children[0].innerHTML + '行价格系数不能为空!<br/>';
			}
			objArr.push(itemCommodityaTbody.children[i].children[1].children[0].dataset.value);
			objTbodys.machCode = ItemMachineCode;															//设备编号
			objTbodys.comName = itemCommodityaTbody.children[i].children[1].children[0].value;				//商品名称
			objTbodys.comId = itemCommodityaTbody.children[i].children[1].children[0].dataset.value;		//商品ID
			//获取产品ID
			var itemCommodityaTbodyItemSelect = JSON.parse(itemCommodityaTbody.children[i].children[1].children[0].dataset.select);
			for(var j = 0; j < itemCommodityaTbodyItemSelect.length; j++){
				if(objTbodys.comId == itemCommodityaTbodyItemSelect[j].value){
					objTbodys.comIngredientId = itemCommodityaTbodyItemSelect[j].code;//产品ID
				}
			}
			objTbodys.comPriceCoefficient = itemCommodityaTbody.children[i].children[2].children[0].value;	//价格系数
			objTbody.push(objTbodys);
		};
		var objArrs = [];	//检查是否有商品重复的检查数组
		var objRepeat = '';	//将重复的信息加入到这里
		for(var i = 0; i < objArr.length; i++){
			if(objArr[i]){
				if(objArrs.indexOf(objArr[i]) === -1){
					objArrs.push(objArr[i]);
				}else{
					objRepeat += '第' + (i+1) + '行出现重复商品！<br/>';
				}
			}
		}
		if(objError||objRepeat){
			alern(objError + objRepeat);
			return false;
		}
		console.log(JSON.stringify(objTbody));
		$.ajax({
			type: 'post',
			url: URLS + '/commodityconfig/saveCommodityConfig',
			data: {
				machCode: ItemMachineCode,
				jsData: JSON.stringify(objTbody),
			},
			success: function(data){
				if(data.code == 10001){
					alern(data.msg);
				}else{
					alern('操作失败！');
				}
			},
			error: function(){
				alern('其他错误！');
			}
		})
	}
}
AddCoffee();

//渲染商品配置效果
function CoffeeList(obj,object){//obj为下拉框选择数据 object为需要渲染的数据
	var tr = creat('tr');
	var tda = creat('td');
	var tdb = creat('td');
	var tdc = creat('td');
	var tdd = creat('td');
	if(object){
		tda.innerHTML = userBodyRightFootItemCommodityaTbody.children.length+1;
		tdb.innerHTML = '<input class="user_body_right_foot_item_commoditya_tbody_intd wm_select" data-select=\''+JSON.stringify(obj)+'\' data-value="'+object.comId+'" value="'+object.comName+'" placeholder="请选择..." type="text"/>';
		tdc.innerHTML = '<input class="user_body_right_foot_item_commoditya_tbody_inte" type="number" value="'+object.comPriceCoefficient+'"/>';
		tdd.innerHTML = '<button class="user_body_right_foot_item_commoditya_tbody_delete" onclick="deleteCoffee(this)"><img src="image/sc.png"/>删除</button>';
	}else{
		tda.innerHTML = userBodyRightFootItemCommodityaTbody.children.length+1;
		tdb.innerHTML = '<input class="user_body_right_foot_item_commoditya_tbody_intd wm_select" data-select=\''+JSON.stringify(obj)+'\' placeholder="请选择..." type="text"/>';
		tdc.innerHTML = '<input class="user_body_right_foot_item_commoditya_tbody_inte" type="number" value="1"/>';
		tdd.innerHTML = '<button class="user_body_right_foot_item_commoditya_tbody_delete" onclick="deleteCoffee(this)"><img src="image/sc.png"/>删除</button>';
	}
	tr.setAppend([tda,tdb,tdc,tdd]);
	userBodyRightFootItemCommodityaTbody.appendChild(tr);
	WindowOnResize();
	WmStartSelect();
}

//获取商品配置
function GetCoffee(){
	userBodyRightFootItemCommodityaTbody.innerHTML = '';
	ajax({
		type: 'post',
		url: URLS + '/commodityconfig/getCommodityConfigList',
		data: {
			machCode: ItemMachineCode,
		},
		dataType: 'json',
		success: function(data){
			//下拉框商品
			var userBodyRightFootItemCommodityaTbodyArr = [];
			ajax({
				type: 'post',
				url: URLS + '/commodityconfig/getGoodsByOperPartyID',
				data: {
					operPartyID: loginUserName.operatorID,
				},
				dataType: 'json',
				success: function(msg){
					for(var i = 0; i < msg.value.length; i++){
						var userBodyRightFootItemCommodityaTbodyObj = {};
						userBodyRightFootItemCommodityaTbodyObj.name = msg.value[i].waresName;
						userBodyRightFootItemCommodityaTbodyObj.value = msg.value[i].waresId;
						userBodyRightFootItemCommodityaTbodyObj.code = msg.value[i].ingredientCode;
						userBodyRightFootItemCommodityaTbodyArr.push(userBodyRightFootItemCommodityaTbodyObj);
					}

					for(var i = 0; i < data.value.length; i++){
						CoffeeList(userBodyRightFootItemCommodityaTbodyArr,data.value[i])
					}
				}
			})
		}
	})
}
function deleteCoffee(that){
	var userBodyRightFootItemCommodityaTbody = c('user_body_right_foot_item_commoditya_tbody')[0];	//商品配置主体
	that.parentNode.parentNode.parentNode.removeChild(that.parentNode.parentNode);
	for(var i = 0; i < userBodyRightFootItemCommodityaTbody.children.length; i++){
		userBodyRightFootItemCommodityaTbody.children[i].children[0].innerHTML = i+1;
	}
}

//原料配置主体
var userBodyRightFootItemCommoditycTbody = c('user_body_right_foot_item_commodityc_tbody')[0];

function AddMaterial(){
	var userBodyRightFootItemCommoditycAdd = c('user_body_right_foot_item_commodityc_add')[0];	//原料配置添加按钮

	//添加原料
	ajax({
		type: 'get',
		url: URLX + '/product/raw/get?rawCode=',
		data: {},
		dataType: 'json',
		success: function(data){
			//下拉框原料
			var userBodyRightFootItemCommoditycAddArr = [];
			for(var i = 0; i < data.data.length; i++){
				var userBodyRightFootItemCommoditycAddObj = {};
				userBodyRightFootItemCommoditycAddObj.name = data.data[i].rawName;
				userBodyRightFootItemCommoditycAddObj.value = data.data[i].rawCode;
				userBodyRightFootItemCommoditycAddArr.push(userBodyRightFootItemCommoditycAddObj);
			}
			userBodyRightFootItemCommoditycAdd.onclick = function(){
				MaterialList(userBodyRightFootItemCommoditycAddArr);
			}
		}
	})

	//保存原料
	var userBodyRightFootItemCommoditycBtn = c('user_body_right_foot_item_commodityc_btn')[0];
	userBodyRightFootItemCommoditycBtn.onclick = function(){
		var objArr = [];	//要提交的数据集合
		var objError = "";	//弹出的错误提示
		var objRepeat = [];	//检查是否有重复原料
		for(var i = 0; i < userBodyRightFootItemCommoditycTbody.children.length; i++){
			if(userBodyRightFootItemCommoditycTbody.children[i].children[1].children[0].value == ""){
				objError += '第' + (i+1) + '行的原料不能为空！<br/>';
			}
			if(userBodyRightFootItemCommoditycTbody.children[i].children[2].children[0].value == ""){
				objError += '第' + (i+1) + '行的数量不能为空！<br/>';
			}
			if(userBodyRightFootItemCommoditycTbody.children[i].children[3].children[0].value == ""){
				objError += '第' + (i+1) + '行的警报值不能为空！<br/>';
			}
			if(userBodyRightFootItemCommoditycTbody.children[i].children[4].children[0].value == ""){
				objError += '第' + (i+1) + '行的停售值不能为空！<br/>';
			}
			objRepeat.push(userBodyRightFootItemCommoditycTbody.children[i].children[1].children[0].dataset.value);
			var objObj = {};
			objObj.rawCode = userBodyRightFootItemCommoditycTbody.children[i].children[1].children[0].dataset.value;	//原料编号
			objObj.rawName = userBodyRightFootItemCommoditycTbody.children[i].children[1].children[0].value;			//原料名称
			objObj.rawConfigQuantity = userBodyRightFootItemCommoditycTbody.children[i].children[2].children[0].value;	//原料数量
			objObj.rawCaveatQuantity = userBodyRightFootItemCommoditycTbody.children[i].children[3].children[0].value;	//警报量
			objObj.rawStopQuantity = userBodyRightFootItemCommoditycTbody.children[i].children[4].children[0].value;	//停售量
			objObj.machCode = ItemMachineCode;																			//设备编号
			objArr.push(objObj);
		}

		var objArrs = [];	//检查是否有商品重复的检查数组
		var objRepeats = '';	//将重复的信息加入到这里
		for(var i = 0; i < objRepeat.length; i++){
			if(objRepeat[i]){
				if(objArrs.indexOf(objRepeat[i]) === -1){
					objArrs.push(objRepeat[i]);
				}else{
					objRepeats += '第' + (i+1) + '行出现重复原料！<br/>';
				}
			}
		}
		if(objError||objRepeats){
			alern(objError + objRepeats);
			return false;
		}
		console.log(JSON.stringify(objArr));
		ajax({
			type: 'post',
			url: URLS + '/rawmaterialconfig/saveRawmaterialConfig',
			data: {
				machCode: ItemMachineCode,
				jsData: JSON.stringify(objArr),
			},
			dataType: 'json',
			success: function(data){
				console.log(data);
				if(data.code == 10001){
					alern(data.msg);
				}else{
					alern('操作失败！');
				}
			},
			error: function(){
				alern('其他错误！');
			}
		})
	}
}
AddMaterial();


//渲染原料配置效果
function MaterialList(obj,object){//obj为下拉框选择数据 object为需要渲染的数据
	var tr = creat('tr');
	var tda = creat('td');
	var tdb = creat('td');
	var tdc = creat('td');
	var tdd = creat('td');
	var tde = creat('td');
	var tdf = creat('td');
	if(object){
		tda.innerHTML = userBodyRightFootItemCommoditycTbody.children.length+1;
		tdb.innerHTML = '<input class="user_body_right_foot_item_commodityc_tbody_intd wm_select" data-select=\''+JSON.stringify(obj)+'\' placeholder="请选择..." data-value="'+object.rawCode+'" value="'+object.rawName+'" type="text"/>';
		tdc.innerHTML = '<input class="user_body_right_foot_item_commodityc_tbody_inte" value="'+object.rawConfigQuantity+'" type="number"/>';
		tdd.innerHTML = '<input class="user_body_right_foot_item_commodityc_tbody_intf" value="'+object.rawCaveatQuantity+'" type="number"/>';
		tde.innerHTML = '<input class="user_body_right_foot_item_commodityc_tbody_intg" value="'+object.rawStopQuantity+'" type="number"/>';
		tdf.innerHTML = '<button class="user_body_right_foot_item_commodityc_tbody_delete" onclick="deleteMaterial(this)"><img src="image/sc.png"/>删除</button>';
	}else{
		tda.innerHTML = userBodyRightFootItemCommoditycTbody.children.length+1;
		tdb.innerHTML = '<input class="user_body_right_foot_item_commodityc_tbody_intd wm_select" data-select=\''+JSON.stringify(obj)+'\' placeholder="请选择..." type="text"/>';
		tdc.innerHTML = '<input class="user_body_right_foot_item_commodityc_tbody_inte" type="number"/>';
		tdd.innerHTML = '<input class="user_body_right_foot_item_commodityc_tbody_intf" type="number"/>';
		tde.innerHTML = '<input class="user_body_right_foot_item_commodityc_tbody_intg" type="number"/>';
		tdf.innerHTML = '<button class="user_body_right_foot_item_commodityc_tbody_delete" onclick="deleteMaterial(this)"><img src="image/sc.png"/>删除</button>';
	}
	tr.setAppend([tda,tdb,tdc,tdd,tde,tdf]);
	userBodyRightFootItemCommoditycTbody.appendChild(tr);
	WmStartSelect();
}

function deleteMaterial(that){
	var userBodyRightFootItemCommoditycTbody = c('user_body_right_foot_item_commodityc_tbody')[0];	//商品配置主体
	that.parentNode.parentNode.parentNode.removeChild(that.parentNode.parentNode);
	for(var i = 0; i < userBodyRightFootItemCommoditycTbody.children.length; i++){
		userBodyRightFootItemCommoditycTbody.children[i].children[0].innerHTML = i+1;
	}
}

function GetMaterial(){
	userBodyRightFootItemCommoditycTbody.innerHTML = "";
	ajax({
		type: 'post',
		url: URLS + '/rawmaterialconfig/getRawmaterialConfigList',
		data: {
			machCode: ItemMachineCode,
		},
		dataType: 'json',
		success: function(data){
			ajax({
				type: 'get',
				url: URLX + '/product/raw/get?rawCode=',
				data: {},
				dataType: 'json',
				success: function(msg){
					var userBodyRightFootItemCommoditycAddArr = [];
					for(var i = 0; i < msg.data.length; i++){
						var userBodyRightFootItemCommoditycAddObj = {};
						userBodyRightFootItemCommoditycAddObj.name = msg.data[i].rawName;
						userBodyRightFootItemCommoditycAddObj.value = msg.data[i].rawCode;
						userBodyRightFootItemCommoditycAddArr.push(userBodyRightFootItemCommoditycAddObj);
					}
					for(var i = 0; i < data.value.length; i++){
						var objObj = {};
						objObj.rawCode = data.value[i].rawCode;			//原料编号
						objObj.rawName = data.value[i].rawName;			//原料名称
						objObj.rawConfigQuantity = data.value[i].rawConfigQuantity;	//原料数量
						objObj.rawCaveatQuantity = data.value[i].rawCaveatQuantity;	//警报量
						objObj.rawStopQuantity = data.value[i].rawStopQuantity;	//停售量
						MaterialList(userBodyRightFootItemCommoditycAddArr,objObj);
					}
				}
			})
		}
	})
}