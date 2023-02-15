import frag from './shader/fragment.frag';
import vert from './shader/vertex.vert';
import * as PIXI from 'pixi.js'; // pixi 라이브러리 전부 가져오기.
import TaggedText from 'pixi-tagged-text';
import { Emitter } from '@pixi/particle-emitter';
import emitter_setting from './json/emitter.json'; // 자바스크립트 오브젝트로 import
import { load_all } from './loader';
import { Point } from 'pixi.js';

/**
 * window 를 global로 접근 가능
 */
export const global: any = window as any;

/**
 * pixi application 생성
 * 프로젝트 세팅
 */
export const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x666666,
	width: 800,
	height: 450,
});

//가장 기반이 되는 부분?
//여기에 등록하면 어디에서든 접근 가능?
global.app = app;

// main 함수 실행
main();

/**
 * 메인 함수 실행
 */
async function main() {

	// 비동기로 에셋을 불러옴.
    await load_all();
	
	//컨테이너: 위치, 크기 등 기본 값만있는 객체 껍데기.
	const container_1: PIXI.Container = new PIXI.Container();
	container_1.scale.set(1);
	container_1.position.set(app.screen.width / 2, app.screen.height / 2);
	app.stage.addChild(container_1); //stage에 자식으로 추가. 
	// 모든게 2D로 동작.

	// Container_2는 500, 250위치.
	// const container_2: PIXI.Container = new PIXI.Container();
	// container_2.position.set(500, 250);
	// app.stage.addChild(container_2);

	// Load the shader program
	const vertexShader = vert;
	const fragmentShader = frag;
	// const myShader = Shader.from(vertexShader, fragmentShader);

	// Create a custom filter

	// 버텍스 셰이더와 프래그먼트 셰이더를 추가 가능.
	// undefined 넣으면 기본 셰이더로 들어감.
	const myFilter = new PIXI.Filter(vertexShader, fragmentShader, {
		Resolution: [1920, 1080],
		uTintColor: [1, 0, 0, 1],
		utime: 0,
	});

	// Apply the filter to the sprite

	// sprite 소스는 id나 경로 등으로 부를 수 있음. 여기서는 id로 불러 옴.
	// 컨테이너에 자식 추가 시 가장 마지막에 추가된 놈이 가장 위로 옴.
	// 부모에 셰이더 걸면 자식들한테 전부 적용된다.
	const sprite_1: PIXI.Sprite = PIXI.Sprite.from("dark-blue");
	sprite_1.anchor.set(0.5); //가운데 피벗.

	sprite_1.scale.set(1 / 2.4);
	container_1.addChild(sprite_1);
	sprite_1.filters = [myFilter];

	// const sprite_2: PIXI.Sprite = PIXI.Sprite.from('hos');
	// sprite_2.anchor.set(0.5);
	// container_1.addChild(sprite_2);

	// container_2.addChild(sprite_2);

	// Graphics는 기본 도형 그리는 도구.
	// const graphics: PIXI.Graphics = new PIXI.Graphics();

	// graphics.beginFill(0xff00ff);
	// graphics.lineStyle(10, 0x00ff00);
	// graphics.drawCircle(0, 0, 25);
	// graphics.endFill();

	// app.stage.addChild(graphics);

	//graphics.position.x = 100;
	//graphics.position.y = 100;
	//graphics.position = new Point(100, 100);
	//graphics.position.set(100, 100);


	//텍스트 추가
	// const style = new PIXI.TextStyle({
	// 	fontFamily: 'DungGeunMo',
	// 	fontSize: 36,
	// 	fontStyle: 'italic',
	// 	fontWeight: 'bold',
	// 	fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_HORIZONTAL,
	// 	fillGradientStops: [0, 0.4],
	// 	fill: ['#ffffff', '#00ff99'], // gradient
	// 	stroke: '#4a1850',
	// 	strokeThickness: 5,
	// 	dropShadow: true,
	// 	dropShadowColor: '#000000',
	// 	dropShadowBlur: 4,
	// 	dropShadowAngle: Math.PI / 6,
	// 	dropShadowDistance: 6,
	// 	wordWrap: true,
	// 	wordWrapWidth: 100,
	// 	lineJoin: 'round',
	// });

	// let str = '';
	// const texty: PIXI.Text = new PIXI.Text(str, style);
	// texty.position.set(100, 0);

	// app.stage.addChildAt(texty, 0);

	// 추가로 받은 에셋
	// const t = new TaggedText('aaa <big>Big text</big> aaa', {
	// 	default: {
	// 		fontFamily: 'DungGeunMo',
	// 	},
	// 	big: {
	// 		fontSize: 40,
	// 		color: '#ff0000',
	// 		fontFamily: 'DungGeunMo',
	// 	},
	// }); // renders "Big text" at 25px

	// app.stage.addChild(t);

	//let text_size = 50;
	//let is_ascending = true;
	let time = 0;
	//myFilter.uniforms.Resolution = sprite_1.scale
	// 업데이트 함수 등록.
	// delta는 Time.deltaTime 역할.
	app.ticker.add((delta) => {
		//text_size = is_ascending ? text_size + delta : text_size - delta;
		//if (text_size > 100) is_ascending = false;
		//if (text_size < 50) is_ascending = true;

		time += delta * 0.005;
		myFilter.uniforms.utime = Math.sin(time * Math.PI / 180.0) * 400
		//sprite_2.rotation -= 0.01 * delta;
		//container_1.rotation -= 0.01 * delta;
		// The change to the style wasn't detected. It still renders "Big text" at 25px
		//t.tagStyles.big.fontSize = text_size; // 폰트 사이즈 변경.
		// now it renders correctly.
		//t.update(); //폰트 사이즈 변경 후 업데이트를 별도로 시켜줘야 함.
	});

	// t.getStyleForTag('big').fo

	// t.textFields[0].visible = false; // Makes the word "Big" disappear.

	// t.draw(); // recreates the text fields restoring "Big" //초기값으로 돌림.

	// let time = 0;
	// let updated = 0;
	// app.ticker.add((delta) => {
	// 	time += delta;
	// 	let slow_time = time * 0.01;
	// 	// rotate the container!
	// 	// use delta to create frame-independent transform
	// 	// conty.rotation -= 0 * delta;
	// 	container_2.rotation -= 0.01 * delta;

	// 	if (updated != Math.floor(time)) {
	// 		texty.text = [...`${updated * updated}`].join(' ');
	// 		updated = Math.floor(time);
	// 	}

	// 	// conty2.x = Math.abs(Math.sin(slow_time)) * 400;
		
	// 	// 셰이더 값 변경.
	// 	myFilter.uniforms.uTintColor = [Math.sin(slow_time), 1 - Math.sin(slow_time), Math.sin(slow_time + 2), 1];
	// 	// myFilter.uniforms.utime = Math.sin(slow_time) * 400
	// });

	// // 여러가지 파티클을 담는 컨테이너
	// const particleContainer = new PIXI.ParticleContainer(100);
	// container_1.addChild(particleContainer);

	// // 파티클 컨테이너와 세팅 값을 넣으면 된다.
	// let emitter = new Emitter(particleContainer, emitter_setting);

	// emitter.autoUpdate = true;
	// emitter.updateSpawnPos(100, 200);

	// emit을 true로 해야 실행이 됨.
	// emitter.emit = true;

	// app.ticker.add((delta) => {
	// 	emitter.update(delta * 0.001);
	// });
}