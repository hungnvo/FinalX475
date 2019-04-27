let choosefile, extract;
let firstcanvas, secondcanvas;
let img;
function preload() {
	img = loadOpencvImage('spiderman.jpg');
}
function setup() {
	createCanvas(windowWidth, windowHeight);
	firstcanvas = createOpencvCanvas(0,0);
	let dsize = new cv.Size(640,480);
	let dst = new cv.Mat();
	cv.resize(img,dst,dsize,0,0,cv.INTER_AREA);
	cv.resize(img,img,dsize,0,0,cv.INTER_AREA);
	cv.imshow(firstcanvas, img);
	secondcanvas = createOpencvCanvas(img.cols,0);
	cv.imshow(secondcanvas, grabcut(dst));
}

function draw() {
}


function grabcut(image) {
	cv.cvtColor(image, image, cv.COLOR_RGBA2RGB, 0);
	let mask = new cv.Mat();
	let bgdModel = new cv.Mat();
	let fgdModel = new cv.Mat();
	let rect = new cv.Rect(200, 30, 250, 400);
	cv.grabCut(image, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);
	for (let i = 0; i < image.rows; i++) {
    for (let j = 0; j < image.cols; j++) {
			let pixel = mask.ucharPtr(i, j);
        if (pixel[0] == 0 || pixel[0] == 2) {
            image.ucharPtr(i, j)[0] = 0;
            image.ucharPtr(i, j)[1] = 0;
            image.ucharPtr(i, j)[2] = 0;
        }
		}
	}
	let color = new cv.Scalar(0, 0, 255);
	let point1 = new cv.Point(rect.x, rect.y);
	let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
	cv.rectangle(image, point1, point2, color);
	return image;
}

function swap(image,bg,mask){
	let pixel
	for (let i = 0; i < image.rows; i++) {
    for (let j = 0; j < image.cols; j++) {
			pixel = mask.ucharPtr(i, j);
        if (pixel[0] == 0 || pixel[0] == 2) {
            image.ucharPtr(i, j)[0] = bg.ucharPtr(i, j)[0];
            image.ucharPtr(i, j)[1] = bg.ucharPtr(i, j)[1];
            image.ucharPtr(i, j)[2] = bg.ucharPtr(i, j)[2];
        }
		}	
	}	
	return image
}
