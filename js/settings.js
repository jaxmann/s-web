function collapsibleCheckboxTree() {
	$('ul#example').collapsibleCheckboxTree({
		checkParents : false, // When checking a box, all parents are checked (Default: true)
		checkChildren : true, // When checking a box, all children are checked (Default: false)
		shiftClickEffectChildren : true, // When shift-clicking a box, all children are checked or unchecked (Default: true)
		uncheckChildren : true, // When unchecking a box, all children are unchecked (Default: true)
		includeButtons : true, // Include buttons to expand or collapse all above list (Default: true)
		initialState : 'collapse' // Options - 'expand' (fully expanded), 'collapse' (fully collapsed) or default
	});
	if ($(window).width() > 992) {
		$("#tree-selector").css("height",
				parseInt($("#mid-block-f").height()) - 270) /*   un-hardcode this*/
	} else {
		$("#tree-selector").css("height",
				parseInt($("#mid-block-f").height()) - 320) /*   un-hardcode this*/
	}

	$("#expand").css("display", "none")
	$("#collapse").css("display", "none")
	$("#default").css("display", "none")

}

function retrievePlayersRequest(callback) {
	console.log("retrievePlayersRequest called")
	$.ajax({
		type : "GET",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		url : serverUrl + "/retrievePlayers",
		success : function(result) {
			//console.log(JSON.parse(result).list)
			generateHTML(JSON.parse(result), function() {
				retrieveFavorites();
				callback();
			})

		}
	});
}

function applyButtonClicked() {
	console.log("apply button clicked")
	var favorites = {}
	favorites.list = []
	var checkedElts = $("#example").find("[checked='checked']")
	for (var i=0; i<checkedElts.length;i++) {
		favorites.list.push(checkedElts[i].parentElement.textContent)
	}
	console.log(JSON.stringify(favorites))
	$.ajax({
		type : "POST",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		url : serverUrl + "/sendFavorites",
		data: {
				favorites: favorites,
				username: "" //username from somewhere   
		},
		success : function() {
			console.log("post favorites success")
		}
	});
	
}

function generateHTML(result, callback) {

	console.log("generate html called")

	var timerStart = Date.now();
	for (var i=0; i<result.list.length; i++) {
		if ($("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).length > 0) {
			if ($("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#" + result.list[i].team.split(" ").join("").replace("/","").replace(".","")).length > 0) {
				if ($("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#" + result.list[i].team.split(" ").join("").replace("/","").replace(".","")).find("#player").find("#" + result.list[i].player.split(" ").join("").replace("/","").replace("'", "").replace(".","").replace("?","")).length > 0) {
					//do nothing
				} else {
					$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#" + result.list[i].team.split(" ").join("").replace("/","").replace(".","")).find("#player").append("<li id='" + result.list[i].player.split(" ").join("").replace("'", "").replace(".","").replace("?","") + "'><input type='checkbox' name='' />" + result.list[i].player + "</li>")
				}
			} else {
				$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").append("<li id='" + result.list[i].team.split(" ").join("").replace(".","") + "'><input type='checkbox' name=''  />" + result.list[i].team + "<ul id='player'></ul></li>")
				$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#" + result.list[i].team.split(" ").join("").replace("/","").replace(".","")).find("#player").append("<li id='" + result.list[i].player.split(" ").join("").replace("'","").replace(".","").replace("?","") + "'><input type='checkbox' name='' />" + result.list[i].player + "</li>")
			}
		} else {
			$("#example").append("<li id='" + result.list[i].league.split(" ").join("").replace("/","").replace(".","") + "'><input type='checkbox' name='' />" + result.list[i].league + "<ul id='team'></ul></li>")
			$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").append("<li id='" + result.list[i].team.split(" ").join("").replace(".","") + "'><input type='checkbox' name='' />" + result.list[i].team + "<ul id='player'></ul></li>")
			$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#player").append("<li id='" + result.list[i].player.split(" ").join("").replace("'","").replace(".","").replace("?","") + "'><input type='checkbox' name='' />" + result.list[i].player + "</li>")
		}
	}
	$('ul#example').collapsibleCheckboxTree({
		checkParents : false, // When checking a box, all parents are checked (Default: true)
		checkChildren : true, // When checking a box, all children are checked (Default: false)
		shiftClickEffectChildren : true, // When shift-clicking a box, all children are checked or unchecked (Default: true)
		uncheckChildren : true, // When unchecking a box, all children are unchecked (Default: true)
		includeButtons : true, // Include buttons to expand or collapse all above list (Default: true)
		initialState : 'collapse' // Options - 'expand' (fully expanded), 'collapse' (fully collapsed) or default
	});
	$("button#expand").css("display", "none")
	$("button#collapse").css("display", "none")
	$("button#default").css("display", "none")
	console.log("table generated in", Date.now() - timerStart)

	callback();
} 

function retrieveFavorites() {
	console.log("retrieve favorites called")
	$.ajax({
		type : "GET",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data: jQuery.param({
			userName: "example"
		}),
		url : serverUrl + "/retrieveFavorites",
		success : function(result) {
			console.log(JSON.parse(result))
			checkBoxes(JSON.parse(result).list)
		}
	});
}

function checkBoxes(favorites) {

	console.log("checkboxes called")
	var boxTimer = Date.now();


	var favs = []
	favorites.forEach(function(f) {
		favs.push(f.player)
	})


	console.log(favs)
	window.$log = favs
	var allBoxes = $("#example").find("[type='checkbox']")
	for (var i=0; i<allBoxes.length; i++) {
		if (favs.indexOf(allBoxes[i].parentElement.textContent.trim()) > -1) {
			console.log("found a match" + allBoxes[i].parentElement.textContent.trim())
			console.info($(allBoxes[i]).prop('checked',"'checked'"))
		}
	}

	console.log("boxes checked in", Date.now() - boxTimer)

}

function btnLeftClicked() {
	console.log("btn left clicked")
	if (!leftExpanded) {
		leftExpanded = true;
		$('.btn-left').toggleClass('clicked');
		$('.btn-left').toggleClass('hovered');
		$("#btn_cont").css("border", "none")
		$(".btn-right").hide();
		$(".about-box").hide();
		$(".btn-left").animate({
			top : "-=" + (parseInt($(".btn-left").offset().top) - parseInt($(
			".header-row")
			.height()))
			+ "px",
			left : "-="
				+ (parseInt($(
				".btn-left")
				.offset().left))
				+ "px"
		})
		$("#mid-block-f").css("display", "block")
		$("#mid-block-f")
		.css(
				"height",
				(parseInt($(window).height())
						- parseInt($(
						".header-row")
						.height()) - parseInt($(
						".footer").height()))
						/ 2
						+ $(window).height()
						/ 4)
						$("#mid-block-f")
						.css(
								"top",
								parseInt($(".header-row")
										.height())
										+ (parseInt($(window)
												.height()
												- (parseInt($(
												".header")
												.height())
												+ parseInt($(
												".footer")
												.height()) + ((parseInt($(
														window)
														.height())
														- parseInt($(
																".header-row")
																.height()) - parseInt($(
																".footer")
																.height())) / 2 + $(
																		window)
																		.height() / 4))) / 2))
																		$("#mid-block-f").css(
																				"width",
																				$(window).width() - $(window).width()
																				/ 5)
																				$("#mid-block-f").css("left",
																						$(window).width() / 10)

	} else {
		leftExpanded = false;
		$('.btn-left').toggleClass('clicked');
		$('.btn-left').toggleClass('hovered');
		$("#btn_cont").css("border", "2px solid #fff")
		$(".btn-right").show();
		$(".about-box").show();

		$("#mid-block-f").hide();
		$(".btn-left")
		.animate(
				{
					top : "+="
						+ (parseInt(leftInitOffset.top)
								- parseInt($(
								".header-row")
								.height()) - 2)
								+ "px",
								left : "+="
									+ (parseInt(leftInitOffset.left) - 2)
									+ "px"
				})
	}

}

function btnRightClicked() {
	console.log("btn right clicked")
	if (!rightExpanded) {
		rightExpanded = true;
		$(".btn-right").toggleClass('clicked');
		$(".btn-right").toggleClass('hovered');
		$("#btn_cont").css("border", "none")
		$(".btn-left").hide();
		$(".about-box").hide();

		$(".btn-right").animate({
			top : "-=" + (parseInt($(".btn-right").offset().top + parseInt($("#btn_cont").height()) - parseInt($(".footer").offset().top) + 20)) + "px",
			left : "+=" + (parseInt($(window).width() - parseInt($(".btn-right").offset().left) - parseInt($(".btn-right").width()) - 80)) + "px"
		})
		$("#mid-block-s").css("display", "block")
		$("#mid-block-s").css("height", (parseInt($(window).height()) - parseInt($(".header-row").height()) - parseInt($(".footer").height())) / 2 + $(window).height() / 4)
		$("#mid-block-s")
		.css(
				"top",
				parseInt($(".header-row").height())
				+ (parseInt($(window).height()
						- (parseInt($(".header").height()) + parseInt($(".footer").height()) + ((parseInt($(window).height())
								- parseInt($(".header-row").height()) - parseInt($(".footer").height())) / 2 + $(window).height() / 4))) / 2))
								$("#mid-block-s").css("width", $(window).width() - $(window).width() / 5)
								$("#mid-block-s").css("left", $(window).width() / 10)

	} else {
		rightExpanded = false;
		$(".btn-right").toggleClass('clicked');
		$(".btn-right").toggleClass('hovered');
		$("#btn_cont").css("border", "2px solid #fff");
		$(".btn-left").show();
		$(".about-box").show();

		$("#mid-block-s").hide();
		$(".btn-right")
		.animate(
				{
					top : "-="
						+ (parseInt($(window).height()) - parseInt(rightInitOffset.top) - parseInt($(".footer").height()) - parseInt($(".header-row").height()) + ((parseInt($(
								window).width()) < 1641) ? 11 : -5)) + "px",
								left : "-=" + (parseInt(rightInitOffset.left) - parseInt($(".btn-right").width()) - 80) + "px"
				})
	}
}

function btnCancelClicked() {
	console.log("btn cancel clicked")
	if (leftExpanded) {
		leftExpanded = false;
		$('.btn-left').toggleClass('clicked');
		$('.btn-left').toggleClass('hovered');
		$("#btn_cont").css("border", "2px solid #fff")
		$(".btn-right").show();
		$(".about-box").show();

		$("#mid-block-f").hide();
		$(".btn-left").animate({
			top : "+=" + (parseInt(leftInitOffset.top) - parseInt($(".header-row").height())) + "px",
			left : "+=" + (parseInt(leftInitOffset.left)) + "px"
		})
	}
	if (rightExpanded) {
		rightExpanded = false;
		$(".btn-right").toggleClass('clicked');
		$(".btn-right").toggleClass('hovered');
		$("#btn_cont").css("border", "2px solid #fff");
		$(".btn-left").show();
		$(".about-box").show();

		$("#mid-block-s").hide();
		$(".btn-right").animate(
				{
					top : "-="
						+ (parseInt($(window).height()) - parseInt(rightInitOffset.top) - parseInt($(".footer").height()) - parseInt($(".header-row").height()) + ((parseInt($(
								window).width()) < 1641) ? 11 : -5)) + "px",
								left : "-=" + (parseInt(rightInitOffset.left) - parseInt($(".btn-right").width()) - 80) + "px"
				})
	}
}
