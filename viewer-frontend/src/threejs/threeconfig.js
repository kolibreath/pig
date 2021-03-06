import * as THREE from 'three';
import OrbitControls from 'three-orbit-controls';

let camera, scene, renderer, controls;

export function init(length, division) {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
	// camera.position.set(0, 0, 1.5).setLength(100);
	camera.position.x = length;
	camera.position.y = length;
	camera.position.z = length;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	//renderer.setClearColor(0xcccccc);
	document.body.appendChild(renderer.domElement);

	controls = new OrbitControls(camera, renderer.domElement);

	let gridXz = new THREE.GridHelper(length, division, 0xeed5b7, 0xeed5b7);
	gridXz.position.x = length / 2;
	gridXz.position.y = 0;
	gridXz.position.z = length / 2;
	scene.add(gridXz);

	let gridXy = new THREE.GridHelper(length, division, 0xeed5b7, 0xeed5b7);
	gridXy.rotation.x = Math.PI / 2;
	gridXy.position.x = length / 2;
	gridXy.position.y = length / 2;
	gridXy.position.z = 0;
	scene.add(gridXy);

	let gridYz = new THREE.GridHelper(length, division, 0xeed5b7, 0xeed5b7);
	gridYz.rotation.z = Math.PI / 2;
	gridYz.position.x = 0;
	gridYz.position.y = length / 2;
	gridYz.position.z = length / 2;
	scene.add(gridYz);

	let axes = new THREE.AxesHelper(3);
	scene.add(axes);

	initAxisNumber(length, division);
	initLineOfRealm(length);
	initParticles(length);
}

//绘制刻度
function initAxisNumber(length, division) {
	let loader = new THREE.FontLoader();

	loader.load('../assets/helvetiker_regular.typeface.json', function(font) {
		//渲染x y z轴
		for (let i = 0; i <= division; i++) {
			let x = length / division * i;
			let content = i + '';
			let geometry = new THREE.TextGeometry(content, {
				font: font,
				size: 3,
				height: 0.1
			});
			//创建法向量材质
			let meshMaterial = new THREE.MeshNormalMaterial({
				flatShading: THREE.FlatShading,
				transparent: true,
				opacity: 0.9
			});
			let meshX = new THREE.Mesh(geometry, meshMaterial);
			let meshY = new THREE.Mesh(geometry, meshMaterial);
			let meshZ = new THREE.Mesh(geometry, meshMaterial);
			meshX.position.set(x, 0, 0);
			meshY.position.set(0, x, 0);
			meshZ.position.set(0, 0, x);

			scene.add(meshX);
			scene.add(meshY);
			scene.add(meshZ);
		}
	});
}

//绘制边缘加粗的直线
function initLineOfRealm(length) {
	let lineMaterial = new THREE.LineBasicMaterial({
		vertexColors: THREE.VertexColors,
		linewidth: 3
	});
	let color1 = new THREE.Color(0xee00dd),
		color2 = new THREE.Color(0xeec0b0);

	//Y轴
	let starts = [ new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0) ];
	let ends = [ new THREE.Vector3(0, 0, length), new THREE.Vector3(0, length, 0), new THREE.Vector3(length, 0, 0) ];

	for (let i = 0; i < 3; i++) {
		let geom = new THREE.Geometry();
		geom.vertices.push(starts[i]);
		geom.vertices.push(ends[i]);
		geom.colors.push(color1, color2);

		let line = new THREE.Line(geom, lineMaterial);
		console.log(line);
		scene.add(line);
	}
}

function initParticles(length) {
	let particles = receiveParticles();
	for (let i = 0; i < particles.length; i++) {
		let gemometry = new THREE.SphereGeometry(1, 16, 16);
		let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		let sphere = new THREE.Mesh(gemometry, material);

		sphere.position.x = particles[i].x * length;
		sphere.position.y = particles[i].y * length;
		sphere.position.z = particles[i].z * length;

		scene.add(sphere);
	}
}

function receiveParticles() {
	//test random
	let particles = [];
	for (let i = 0; i < 200; i++) {
		let x = Math.random();
		let y = Math.random();
		let z = Math.random();

		let object = {
			x: x,
			y: y,
			z: z
		};
		particles[i] = object;
	}
	return particles;
}

export function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	renderer.render(scene, camera);
}
