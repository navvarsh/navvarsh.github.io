'use strict';

(function() {

	// web developer console signature
	console.log('%c Happy New Year, 2020', 'background:#000;color:#fff;padding:0.5em 1em;line-height:2;');

	// defines some design constants
	const colors = {
		green: '#00ffd3',
		white: '#fff',
		yellow: '#f6cc00',
		blue: '#00c3f4',
		orange: '#ff8b26',
		magenta: '#ff2de3',
		red: '#f31250'
	};

	// linear easing path (1:1)
	const linearCurve = mojs.easing.path('M0, -100 C0, -100 100, 0 100, 0');

	// firework explosion blast
	let blast = new mojs.Shape({
		parent: '.canvas',
		radius: { 0 : 'rand(100, 200)' },
		fill: 'transparent',
		stroke: colors.white,
		strokeWidth: { 10 : 0 },
		opacity: { 0.8 : 0 },
		duration: 700,
		isShowEnd: false,
		isForce3d: true
	});

	// firework explosion sparks
	let sparks = new mojs.Burst({
		parent: '.canvas',
		count: 'rand(20, 50)',
		radius: { 0 : 'rand(100, 200)' },
		degree: 400,
		children: {
			fill: [ colors.green, colors.white, colors.yellow ],
			duration: 'rand(1000, 2000)',
			radius: { 5 : 0 }
		},
		isShowEnd: false,
		isForce3d: true
	});

	// firework explosion trails
	let trails = new mojs.Burst({
		parent: '.canvas',
		count: 'rand(20, 30)',
		radius: { 0 : 'rand(150, 250)' },
		degree: 400,
		children: {
			shape: 'line',
			stroke: [ colors.green, colors.white, colors.yellow ],
			strokeWidth: { 3 : 1 },
			duration: 'rand(1500, 2500)',
			radius: { 5 : 'rand(50, 100)' }
		},
		isShowEnd: false,
		isForce3d: true,
		onStart: function() {
			let audio = './audio/explosion-{sound}.mp3';

			let sounds = [
				'particles-long',
				'particles-short'
			];

			new Audio(audio.replace('{sound}', sounds[Math.floor(Math.random() * sounds.length)])).play();
		}
	});

	// firework particles
	let particle = mojs.stagger(mojs.Burst);
	let particles = new particle({
		parent: '.canvas',
		quantifier: 12,
		count: 'rand(5, 10)',
		children: {
			fill: colors.white,
			opacity: { 1 : 0, curve: linearCurve },
			duration: 'rand(1000, 2000)',
			radius: { 'rand(1, 2)' : 0 },
			delay: 'rand(800, 1200)'
		},
		isShowEnd: false,
		isForce3d: true
	});

	// trajectory of the projectile
	let rocket = new mojs.ShapeSwirl({
		parent: '.canvas',
		shape: 'circle',
		fill: colors.white,
		x: 'rand(-400, 400)',
		y: { 200 : 'rand(-100, -300)' },
		radius: 2,
		swirlSize: 3,
		swirlFrequency: 10,
		degreeShift: 'rand(-45, 45)',
		direction: -1,
		scale: { 1 : 0, curve: linearCurve },
		duration: 1400,
		easing: mojs.easing.quad.out,
		isShowEnd: false,
		isForce3d: true,
		onStart: function() {
			let explosion = trails._props.radius;
			let audio = './audio/rocket-{sound}.mp3';

			if (explosion < 180) {
				audio = audio.replace('{sound}', 'short');
			} else if (explosion >= 180 && explosion < 200) {
				audio = audio.replace('{sound}', 'medium');
			} else if (explosion >= 200) {
				audio = audio.replace('{sound}', 'long');
			}

			new Audio(audio).play();
		},
		onProgress: function(p) {

			// fixes a small bug
			if (Math.round(p*100) < 5) {
				return;
			}

			// smoke of the projectile
			new mojs.Shape({
				parent: '.canvas',
				x: rocket._props.x,
				y: rocket._props.y,
				fill: colors.yellow,
				radius: { 1 : 0, curve: linearCurve },
				duration: 500,
				delay: 'stagger(10, 250)',
				isShowEnd: false,
				isForce3d: true,
				onComplete: function() {
					this.el.parentNode.removeChild(this.el);
				}
			}).play();
		},
		onComplete: function() {
			let x = parseInt(rocket._props.x.replace('px', ''));
			let y = parseInt(rocket._props.y.replace('px', ''));
			let r = trails._props.radius;

			sparks.tune({
				x: x,
				y: y
			}).generate().replay();

			blast.tune({
				x: x,
				y: y
			}).generate().replay();

			trails.tune({
				x: x,
				y: y
			}).generate().replay();

			particles.tune({
				x: 'rand(' + (x - 100) + ', ' + (x + 100) + ')',
				y: 'rand(' + (y - 100) + ', ' + (y + 100) + ')',
				radius: 'stagger(rand(0, ' + r * 0.2 + '), 1)'
			}).play();

			setTimeout(function() {
				rocket.generate().play();
			}, Math.floor((Math.random() * 2200) + 1800));
		}
	});

	// defines the base shapes for "2018" word
	class Number2 extends mojs.CustomShape {
		getShape() {
			return '<path d="M34.16 17.58c3.94-4.03 9.4-6.05 16.4-6.05s12.44 1.85 16.3 5.55c3.87 3.7 5.8 8.89 5.8 15.55 0 5.65-1.22 10.7-3.67 15.11-2.44 4.42-5.95 9.1-10.5 14.01L44.47 76.73h28.88v10.6h-45.1v-9.8l21.5-23c4.27-4.53 7.17-8.2 8.7-11 1.54-2.8 2.3-6.26 2.3-10.4 0-3.4-.86-6.08-2.6-8.05-1.73-1.96-4.16-2.95-7.3-2.95-7.13 0-10.76 4.34-10.9 13l-11.9-.7c.14-7.2 2.17-12.81 6.1-16.85z"/>';
		}
	}

	class Number0 extends mojs.CustomShape {
		getShape() {
			return '<path d="M29.76 20.42c5-6.7 11.7-10.05 20.1-10.05 8.4 0 15.09 3.35 20.05 10.05 4.97 6.7 7.45 16.15 7.45 28.35 0 12.13-2.5 21.56-7.5 28.3-5 6.73-11.66 10.1-20 10.1-8.4 0-15.1-3.37-20.1-10.1-5-6.74-7.5-16.17-7.5-28.3 0-12.2 2.5-21.65 7.5-28.35zm20.1.55c-10.33 0-15.5 9.27-15.5 27.8s5.17 27.8 15.5 27.8c10.27 0 15.4-9.27 15.4-27.8 0-18.54-5.13-27.8-15.4-27.8z"/>';
		}
	}

	


	

	// adds all custom shapes to the library
	mojs.addShape('number-2', Number2);
	mojs.addShape('number-0', Number0);
	

	// animates the "2018" word
	const number_options = {
		parent: '.canvas',
		radius: { 0 : 50 },
		fill: colors.white,
		scaleX: { 10 : 1 },
		angle: { 'rand(-90, 90)' : 0 },
		opacity: { 0 : 1 },
		duration: 'rand(1000, 1400)',
		easing: mojs.easing.elastic.out,
		isForce3d: true
	};

	// trails for "2018" word
	const number_trails_options = {
		parent: '.canvas',
		count: 'rand(5, 10)',
		radius: { 50 : 'rand(100, 200)' },
		children: {
			shape: 'line',
			stroke: [ colors.green, colors.white, colors.yellow ],
			duration: 'rand(1000, 2000)',
			radius: { 5 : 'rand(50, 100)' }
		},
		isForce3d: true,
		onStart: function() {
			new Audio('./audio/explosion-short.mp3').play();
		}
	};

	let number2 = new mojs.Shape(
		mojs.helpers.extend({
			x: -200,
			shape: 'number-2',
			delay: 'rand(100, 200)',
			onStart: function() {
				new mojs.Burst(
					mojs.helpers.extend({
						x: -200
					}, number_trails_options)
				).play();
			}
		}, number_options)
	);

	let number0 = new mojs.Shape(
		mojs.helpers.extend({
			x: -60,
			shape: 'number-0',
			delay: 'rand(200, 300)',
			onStart: function() {
				new mojs.Burst(
					mojs.helpers.extend({
						x: -60
					}, number_trails_options)
				).play();
			}
		}, number_options)
	);

	
	// creates the timeline
	const timeline = new mojs.Timeline();

	// adds shapes to the timeline
	timeline.add(
		rocket,
		number2,
		number0,
		number2,
		number0,
	);

	// binds the load event to completely wait for the experiment to load
	window.addEventListener('load', function() {

		// exits the experiment for small screens
		if (window.innerWidth < 640) {
			return;
		}

		document.querySelector('body').classList.add('go');

		// plays the background music in loop
		let music = new Audio('audio/background-music.mp3');
		music.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);

		music.play();

		// plays the timeline
		setTimeout(function() {
			timeline.play();
		}, 5000);

		// creates a color palette
		let effect = [
			colors.green,
			colors.blue,
			colors.yellow,
			colors.orange,
			colors.magenta,
			colors.red
		];

		// allows user interaction
		setTimeout(function() {
			window.pipe = 0;

			document.querySelector('.canvas').addEventListener('click', function(e) {
				if (window.pipe > 4) {
					return;
				}

				new mojs.Shape({
					parent: '.canvas',
					left: e.clientX,
					top: e.clientY,
					radius: { 0 : 'rand(50, 100)' },
					fill: 'transparent',
					stroke: colors.white,
					strokeWidth: { 10 : 0 },
					opacity: { 0.8 : 0 },
					duration: 700,
					isShowEnd: false,
					isForce3d: true,
					onComplete: function() {
						this.el.parentNode.removeChild(this.el);
					}
				}).play();

				new mojs.Burst({
					parent: '.canvas',
					left: e.clientX,
					top: e.clientY,
					count: 'rand(10, 15)',
					radius: { 0 : 'rand(100, 200)' },
					children: {
						shape: 'line',
						stroke: [ effect[Math.floor(Math.random() * effect.length)], colors.white ],
						duration: 'rand(1000, 1500)',
						radius: { 5 : 'rand(50, 100)' }
					},
					isShowEnd: false,
					isForce3d: true,
					onStart: function() {
						new Audio('./audio/explosion-short.mp3').play();
					},
					onComplete: function() {
						this.el.parentNode.removeChild(this.el);
						window.pipe--;
					}
				}).play();

				window.pipe++;
			});
		}, 7000);

		// allows the user to entire the fullscreen mode
		document.querySelector('[for="fullscreen"]').addEventListener('click', function() {
			if (!document.querySelector('#fullscreen').checked) {
				const element = document.querySelector('body');

				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		});

		// binds the fullscreenchange event to refresh the fullscreen command icon
		['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(function(e) {
			window.addEventListener(e, function() {
				if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
					document.querySelector('#fullscreen').checked = false;
				}
			});
		});

		// allows the user to switch on/off the background music
		document.querySelector('[for="sound"]').addEventListener('click', function() {
			if (document.querySelector('#sound').checked) {
				music.pause();
			} else {
				music.play();
			}
		});

		// displays the information box
		document.querySelector('[for="info"]').addEventListener('click', function() {
			if (!document.querySelector('#info').checked) {
				new mojs.Html({
					el: '.info',
					scale: { 0.7 : 1 },
					opacity: { 0 : 1 },
					duration: 800,
					easing: mojs.easing.elastic.out,
					onStart: function() {
						this.el.style.visibility = 'visible';
					}
				}).play();
			} else {
				new mojs.Html({
					el: '.info',
					scale: { 1 : 0.8 },
					opacity: { 1 : 0 },
					duration: 500,
					easing: mojs.easing.expo.out,
					onComplete: function() {
						this.el.style.visibility = 'hidden';
					}
				}).play();
			}
		});
	});
})();