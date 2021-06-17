class BoxMove {
	constructor(ref) {
		this.ref = ref;
	}
	boxSet = () => {
		let parentBody = $(".container-fluid");

		this.h = parentBody.innerHeight();
		this.w = parentBody.innerWidth();
		this.left = this.w / 2 - this.ref.innerHeight() / 2;
		this.top = this.h / 2 - this.ref.innerHeight() / 2;
		this.ref.offset({ top: this.top, left: this.left });
	};
	boxPos = (top, left) => {
		this.top += top;
		this.left += left;
		this.ref.offset({ top: this.top, left: this.left });
	};
}
let newBox = new BoxMove($("#boxtomove"));
newBox.boxSet();
let command = ["left", "right", "up", "down", "start"];
let grammer =
	"#JSGF V1.0; grammar command; public <direct> = " +
	command.join(" | ") +
	" ;";

let recog = new webkitSpeechRecognition();
let recogList = new webkitSpeechGrammarList();

recogList.addFromString(grammer, 1);
recog.grammer = recogList;
recog.lang = "en-IN";

let flag = true;
$("#start").click(function () {
	if ($(this).hasClass("btn-success")) {
		$(this).removeClass("btn-success").addClass("btn-danger");
		$(this).html("Stop");
		recog.start();
		console.log("READY FOR COMMAND");
		flag = true;
	} else {
		$(this).removeClass("btn-danger").addClass("btn-success");
		$(this).html("Start");
		recog.stop();
		console.log("STOPPED MIC");
		flag = false;
	}
});
recog.addEventListener("end", function () {
	if (flag == true) {
		console.log("TRIGGERED AUTOSTART");
		recog.start();
	} else {
		recog.stop();
		console.log("TRIGGERED STOP");
	}
});

recog.onresult = (e) => {
	var direct = e.results[0][0].transcript;
	console.log("Sounded: " + direct);
	console.log("MATCH(%): " + e.results[0][0].confidence);
	if (direct == "up") {
		newBox.boxPos(-100, 0);
	} else if (direct == "down") {
		newBox.boxPos(100, 0);
	} else if (direct == "right") {
		newBox.boxPos(0, 100);
	} else if (direct == "left") {
		newBox.boxPos(0, -100);
	} else if (direct == "start") {
		newBox.boxSet();
	}
};

$(window).resize(function () {
	newBox.boxSet();
});
