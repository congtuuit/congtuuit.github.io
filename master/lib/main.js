var a = 1200;
var x = setInterval(function(){
	$('#notification_container ul')[0].style = 'left: '+a+'px';
	a--;
	if(a<-1200) a = 1200;
},10);

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};


$('#password1').on('keydown', function(e) {
    if (e.which == 13) {
        login1();
    }
});

// $('a.slot').on('click', showPopupLogin('Vui lòng đăng nhập để chơi'))



function change() {
	debugger;
	showLoading();
	var card_type = $('select[name=telcoName]').val();
	var card_amount = $('select[name=amount]').val();
	var card_seri = $('input[name=cardseri]').val();
	var card_code = $('input[name=cardcode]').val();
	$.ajax({
	    url: 'napthe.php',
	    method: 'post',
	    data: {
	        card_type: card_type,
	        card_amount: card_amount,
	        card_seri: card_seri,
	        card_code: card_code
	    },
	    success: function(result) {
	    	console.log(result);
	    	$('div.row-error')[0].style = '';
	    	console.log(result['msg']);
	    	$('div.row-error')[0].innerHTML = result['msg'];
	    	hideLoading();
	    }
	});
}

function showLoading() {
	$('#divLoading')[0].style = '';
	$('#spinner')[0].style = '';
}

function showPopupLogin(status) {
	$('#regError')[0].innerHTML = status;
	$('#notification_container')[0].style = 'display: none';
	$('#popupLogin')[0].style = '';
}

function hidePopupLogin() {
	$('#popupLogin')[0].style = 'display: none';
	$('#notification_container')[0].style = '';
}
function showPopupLoginOtp(status) {
	$('#regError')[0].innerHTML = status;
	$('#notification_container')[0].style = 'display: none';
	$('#popupLoginOtp')[0].style = '';
}

function hidePopupLoginOtp() {
	$('#popupLoginOtp')[0].style = 'display: none';
	$('#notification_container')[0].style = '';
}

function showPopupNapthe(nickname, gold, coin) {
	$('#popupNapthe')[0].style = '';
	$('#notification_container')[0].style = 'display: none';
	$('#divHeader')[0].style = 'display: none';
	$('#divHeader1')[0].style = '';
	$('#nickname')[0].innerHTML = nickname;
	$('#gold')[0].innerHTML = gold;
	$('#coin')[0].innerHTML = coin;
}

function hideLoading() {
	var x = setInterval(function() {
		$('#divLoading')[0].style = 'display: none';
		$('#spinner')[0].style = 'display: none';
		clearInterval(x);
	},500);
}