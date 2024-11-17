(function(_={
		/*
		// パラメータ一覧
		'氏名': '-----',
		'タイミング': '',
		'Eメール1': 'hoge@example.com',
		'Eメール2': 'foo@example.com',
		'出発予定時間': '0000',
		'到着予定時間': '0000',
		'開始予定時間': '0000',
		'検温': '36.0',
		'開始時間': '0000',
		'終了時間': '0000',
		'休憩時間': '0000',
		*/
		__PARAMS__ // 置換用パラメータ変数
	}) {
	function getConts(id) {
		return {
			// selectの入力項目はラベルの次の次の要素 <div class='tempContDiv'>
			s: document.getElementById(id).nextElementSibling.nextElementSibling.getElementsByClassName(
				'select2-selection__rendered'),// 表示用要素は <span>
			h: document.getElementById(id).nextElementSibling.nextElementSibling.getElementsByClassName(
				'select2-hidden-accessible')// 送信用要素(隠し要素)は <select>
		}
	}
	function setSelect(id, v, i=0, r=true) { // id、vは値、iは一つの項目に複数の入力枠がある場合のインデックスで基本は0で時間系なら0=時間/1=分、rはtrueでグレーアウト(クラス)の削除
		const c=getConts(id);
		c.s[i].title = c.s[i].children[0].textContent = v; // <span> 表示用として親のtitile属性、子のテキストに値が設定される
		if(r) c.s[i].children[0].classList.remove('drpDwnPlaceholder'); // タイミングと検温で「-select-」(初期)時はグレーアウトしているので通常表示にするために削除
		c.h[i].querySelector(`option[value='${v}']`).selected = true; // <select>フォームで送信するデータの設定
	}
	function setTime(id, hhmm) {
		setSelect(id, hhmm.substring(0,2), 0, false);
		setSelect(id, hhmm.substring(2,4), 1, false);
	}
	function setInput(id, v) {
		document.forms.test.elements[id].value = v;
	}	
	function hideAndShowItems(showItems) {
		
		const s = showItems.toString();
		const items = ['Dropdown1-li','Dropdown2-li','MultiLine-li','Time-li', 'Time1-li','Time2-li','Time3-li','Time4-li','Time5-li','Time6-li', 'Time7-li'];
		
		// タイミングの指定で表示する項目と隠す項目を変更、表示/非常時で入力必須フラグも変更
		items.forEach(id=>{
			let e=document.getElementById(id);
			// 表示する項目を文字列可してその中に指定のID文字列が存在する場合は表示、存在し無い場合は非表示で振り分け
			if(s.indexOf(id) == -1) {
				e.style.display='none';
				e.setAttribute('needdata','false');
			} else {
				e.style.display='';
				e.setAttribute('needdata','true');
			}
		});
	}
		
	if(!!_['タイミング']) {//プロパティ未定義、空文字のチェック
		setSelect('Dropdown-arialabel-cont',_['タイミング']);
		const showItemsTbl = {
			'前日確認':()=>{hideAndShowItems(['Time-li','Time1-li','Time2-li']);},
			'出発':()=>{hideAndShowItems(['Dropdown1-li','Dropdown2-li','Time3-li'].concat(getConts('Dropdown2-arialabel-cont').h[0].selectedOptions[0].value=='問題あり'?['MultiLine-li']:[]));},
			'到着':()=>{hideAndShowItems(['Time4-li']);},
			'入館':()=>{hideAndShowItems(['']);},
			'退館':()=>{hideAndShowItems(['Time5-li','Time6-li','Time7-li']);},
		};
		showItemsTbl[_['タイミング']]?.();
	}
	if(!!_['氏名']) setInput('SingleLine1-arialabel', _['氏名']);
	if(!!_['Eメール1']) setInput('Email-arialabel', _['Eメール1']);
	if(!!_['Eメール2']) setInput('Email1-arialabel', _['Eメール2']);
	if(!!_['出発予定時間']) {
		setTime('Time-arialabel', _['出発予定時間']);
		// 前日確認時の明日の日付
		document.getElementById('Date-date').value = new Date(new Date().setDate(new Date()
			.getDate() + 1)).toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	}
	if(!!_['到着予定時間']) setTime('Time1-arialabel', _['到着予定時間']);
	if(!!_['開始予定時間']) setTime('Time2-arialabel', _['開始予定時間']);
	
	if(!!_['検温']) setSelect('Dropdown1-arialabel-cont',_['検温']);
	
	if(!!_['開始時間']) setTime('Time5-arialabel', _['開始時間']);
	if(!!_['終了時間']) setTime('Time6-arialabel', _['終了時間']);
	if(!!_['休憩時間']) setTime('Time7-arialabel', _['休憩時間']);
})()

