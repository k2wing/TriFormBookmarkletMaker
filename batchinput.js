/*
トライアンフ入退館フォーム一括入力ブックマークレット
https://github.com/k2wing/triumphform-bookmarklet-generator

Copyright (c) 2024 K.N/k2wing
Released under the MIT license
https://github.com/k2wing/triumphform-bookmarklet-generator/blob/main/LICENSE
*/
(function() {
	function getSelectContents(id) {
		return {
			// selectの入力項目はラベルの次の次の要素 <div class='tempContDiv'>
			select: document.getElementById(id).nextElementSibling.nextElementSibling.getElementsByClassName(
				'select2-hidden-accessible'),// 送信用要素(隠し要素)は <select>
			span: document.getElementById(id).nextElementSibling.nextElementSibling.getElementsByClassName(
				'select2-selection__rendered')// 表示用要素は <span>
		}
	}
	function setSelect(id, value, i=0, isRemoveGrayoutClass=true) { // id、vは値、iは一つの項目に複数の入力枠がある場合のインデックスで基本は0で時間系なら0=時間/1=分、rはtrueでグレーアウト(クラス)の削除
		const selectContents = getSelectContents(id);
		const option = selectContents.select[i].querySelector(`option[value='${value}']`);
		// オプション選択で入力した値が存在しなかった場合は誤まったデータの送信がされないように強制終了
		if(option == null) {
			
			alert(`リストに存在しないデータ(${value})が入力されたためエラーが発生しました。\n該当のブックマークレットを修正してください。`);
			throw new Error;
		}
		selectContents.select[i].querySelector(`option[value='${value}']`).selected = true; // <select>フォームで送信するデータの設定
		selectContents.span[i].title = selectContents.span[i].children[0].textContent = value; // <span> 表示用として親のtitile属性、子のテキストに値が設定される
		if(isRemoveGrayoutClass) selectContents.span[i].children[0].classList.remove('drpDwnPlaceholder'); // タイミングとtemperatureCheckで「-select-」(初期)時はグレーアウトしているので通常表示にするために削除
	}
	function setTime(id, hhmm) {
		setSelect(id, hhmm.substring(0,2), 0, false);
		setSelect(id, hhmm.substring(2,4), 1, false);
	}
	function setInput(id, value) {
		document.forms.test.elements[id].value = value;
	}	
	function hideAndShowItems(showItems) {
		
		const s = showItems.toString();
		const items = ['Dropdown1-li','Dropdown2-li','MultiLine-li','Time-li', 'Time1-li','Time2-li','Time3-li','Time4-li','Time5-li','Time6-li', 'Time7-li'];
		
		// タイミングの指定で表示する項目と隠す項目を変更、表示/非常時で入力必須フラグも変更
		items.forEach(id=>{
			let e = document.getElementById(id);
			// 表示する項目を文字列可してその中に指定のID文字列が存在する場合は表示、存在し無い場合は非表示で振り分け
			// ※タイミングの選択によって入力必須項目が変化するためフラグを初期設定をする
			if(s.indexOf(id) == -1) {
				e.style.display='none';
				e.setAttribute('needdata','false');
			} else {
				e.style.display='';
				e.setAttribute('needdata','true');
			}
		});
	}
	
	/*
		// パラメータ一覧
		name: '-----', 					//氏名
		timing: '', 					//タイミング
		email: 'hoge@example.com', 		//Eメール1
		email1: 'foo@example.com', 		//Eメール2
		scheduledDepartureTime: '0000', //出発予定時間
		estimatedArrivalTimes: '0000', 	//到着予定時間
		scheduledStartTime: '0000', 	//開始予定時間
		temperatureCheck: '36.0', 		//検温結果
		startTime: '0000', 				//開始時間
		endTime: '0000', 				//終了時間
		breakTime: '0000', 				//休憩時間
	*/
	// コードのメンテナンス性を考えて利用者側からはこのスクリプトを外部サーバーから読み込むようにする。
	// データの引き渡しを引数にすると無名関数ではなくなり関数名の衝突が発生する事も考えられるため従来の方法(即時)で関数を実行する。
	// データの引き渡しはセッションストレージに一時的にデータを保存しここで取り出す。
	// セッションストレージのキーはGUIDにしてブックマークレットを実行するページ内のキーと衝突しないようにする。
	const params = Object.freeze(JSON.parse(sessionStorage.getItem('ebde39226ae24807bee2567dc4c19c8e')));

	//プロパティ未定義、空文字の場合はフォームに入力しない
	if(!!params.timing) {

		const showItemsTbl = {
			'前日確認':()=>{hideAndShowItems(['Time-li','Time1-li','Time2-li']);},
			// 体調が問題ありを選択していた場合にタイミングの切り替えによる症状入力蘭を再表示
			'出発':()=>{hideAndShowItems(['Dropdown1-li','Dropdown2-li','Time3-li'].concat(getSelectContents('Dropdown2-arialabel-cont').select[0].selectedOptions[0].value=='問題あり'?['MultiLine-li']:[]));},
			'到着':()=>{hideAndShowItems(['Time4-li']);},
			'入館':()=>{hideAndShowItems(['']);},
			'退館':()=>{hideAndShowItems(['Time5-li','Time6-li','Time7-li']);},
		};

		setSelect('Dropdown-arialabel-cont', params.timing);
		
		showItemsTbl[params.timing]?.();
	}

	if(!!params.name) setInput('SingleLine1-arialabel', params.name);
	if(!!params.email) setInput('Email-arialabel', params.email);
	if(!!params.email1) setInput('Email1-arialabel', params.email1);
	if(!!params.scheduledDepartureTime) {
		setTime('Time-arialabel', params.scheduledDepartureTime);
		// 前日確認時の明日の日付
		document.getElementById('Date-date').value = new Date(new Date().setDate(new Date()
			.getDate() + 1)).toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	}
	if(!!params.estimatedArrivalTimes) setTime('Time1-arialabel', params.estimatedArrivalTimes);
	if(!!params.scheduledStartTime) setTime('Time2-arialabel', params.scheduledStartTime);
	
	if(!!params.temperatureCheck) setSelect('Dropdown1-arialabel-cont', params.temperatureCheck);
	
	if(!!params.startTime) setTime('Time5-arialabel', params.startTime);
	if(!!params.endTime) setTime('Time6-arialabel', params.endTime);
	if(!!params.breakTime) setTime('Time7-arialabel', params.breakTime);
})()

