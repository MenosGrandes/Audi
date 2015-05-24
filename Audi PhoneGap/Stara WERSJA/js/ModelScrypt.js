	function createModel(nameofModel) {
	var canvas = document.getElementById('cv');
	console.log(canvas);
	var viewer = new JSC3D.Viewer(canvas);
	viewer.setParameter('SceneUrl', 'models/'+nameofModel+'.obj');
	viewer.setParameter('InitRotationX', -15);
	viewer.setParameter('InitRotationY', 135);
	viewer.setParameter('InitRotationZ', 0);
	viewer.setParameter('ModelColor', '#57524C');
	viewer.setParameter('BackgroundColor1', '#383840');
	viewer.setParameter('BackgroundColor2', '#000000');
	viewer.setParameter('RenderMode', 'texturesmooth');
	viewer.setParameter('MipMapping', 'on');
	viewer.setParameter('Renderer', 'webgl');
	viewer.init();
	viewer.update();
	}