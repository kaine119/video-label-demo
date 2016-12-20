var shots = []

document.getElementById('player').playbackRate = 0.5

fetch('./2014-05-10_2300_US_KABC_Eyewitness_News_4PM_clip.sht')
.then(function(res){
	return res.text()
})
.then(function(text){
	for (var i = text.split("\n").length - 1; i >= 0; i--) {
		dataArray = text.split("\n")[i].split("|")
		if (dataArray.length === 1 || dataArray[0] === "SHT_01") {
			continue;
		}
		shots.push({
			"timeStart": parseFloat(dataArray[0].slice(12)) + 60 * parseInt(dataArray[0].slice(10, 12)),
			"timeEnd": parseFloat(dataArray[1].slice(12)) + 60 * parseInt(dataArray[1].slice(10, 12)),
			"primaryTag": dataArray[3],
			"extraData": dataArray.slice(4)
		})
	}
})


var callback = function(frame){
	currentTime = video.toMilliseconds() / 1000
	var data = shots.filter(function(obj){
		// make the boundaries slightly wider, b/c video timing isn't all that accurate
		return currentTime >= obj.timeStart - 0.1 && currentTime <= obj.timeEnd + 0.1
	});
	console.log(data, currentTime)
	showInInfobox(data)
};

var infoHeader = document.getElementById('infobox-header');
var infoDetails = document.getElementById('infobox-details');

var showInInfobox = function(data){
	if (data.length == 1 && data[0].primaryTag == "SHOT_DETECTED") {
		return;
	}
	infoDetails.innerHTML = ""
	for (var i = data.length - 1; i >= 1; i--) {
		// not the first item
		if (i != data.length - 1 && data[i].primaryTag == "SHOT_DETECTED") {
			continue
		}
		infoDetails.innerHTML += data[i].primaryTag + ": " +  data[i].extraData + "<br/>"
	}
}

var video = VideoFrame({
	id: 'player',
	callback: callback
});

video.listen('frame', 1);