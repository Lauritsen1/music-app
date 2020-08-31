document.addEventListener('DOMContentLoaded', () => {
	
	let audioPlayer = document.querySelector('audio');

	let audioPlay = document.querySelector('.player__play');
	let playing = false;
	let playPause = document.querySelector('.play-pause');
	audioPlay.addEventListener('click', () => {
		if (playing == false) {
			playing = true;
			audioPlayer.play();
			playPause.classList.replace('fa-play', 'fa-pause')
		} else {
			playing = false;
			audioPlayer.pause();
			playPause.classList.replace('fa-pause', 'fa-play')
		}
	});

});