tgajs
=====
This is a fork from [jsTGALoader](https://github.com/vthibault/jsTGALoader)
to learn more about TGA and JavaScript.

Try the online demo [here](http://schmittl.github.io/tgajs/)

Features
========

* Display tga files on canvas elements
* Decode
    * RGB 16/24/32 bits (Uncompressed and RLE compressed)
    * Black & White 8/16 bits (Uncompressed and RLE compressed)
    * Color Mapped 8 bits (Uncompressed and RLE compressed)
* Honors the attribute type and origin fields
* Encode [ImageData](https://developer.mozilla.org/en/docs/Web/API/ImageData) to tga format (experimental)
Only supports RGB 32 bits with optional RLE encoding

How to Use
==========

Loading a remote tga file
```js
var tga = new TGA();
tga.open("resource.tga", function() {
   document.body.appendChild( tga.getCanvas() );
});
```

Loading a tga from an [ArrayBuffer](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
```js
var tga = new TGA();
tga.load(tga_data);
```

Create a tga file example
```js
var tga = new TGA({width: canvas.width, height: canvas.height, imageType: TGA.Type.RLE_RGB});

tga.setImageData(imageData);

// get a blob url which can be used to download the file
var url = tga.getBlobURL();
```