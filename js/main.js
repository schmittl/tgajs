(function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  initCanvas();
  var menu = {testfile: "", filename: "", backgroundColor: "#eeeeee", scale: 1};
  var filenameController, scaleController, bgController;
  var guiHeader, guiFooter;
  var gui = new dat.GUI({width: 300});

  var images = {
    "RLE True Color 16 bit (Sample)": "ctc16.tga",
    "RLE True Color 24 bit (Sample)": "ctc24.tga",
    "RLE True Color 32 bit (Sample)": "ctc32.tga",
    "True Color 16 bit (Sample)": "utc16.tga",
    "True Color 24 bit (Sample)": "utc24.tga",
    "True Color 32 bit (Sample)": "utc32.tga",
    "RLE Black & White 8 bit (Sample)": "cbw8.tga",
    "Black & White 8 bit (Sample)": "ubw8.tga",
    "RLE Color Mapped 8 bit (Sample)": "ccm8.tga",
    "Color Mapped 8 bit (Sample)": "ucm8.tga",
    "RLE True Color 24 bit": "rgb24_top_left.tga",
    "Color Mapped 8 bit": "rgb24_bottom_left_rle.tga",
    "Color Mapped 24 bit": "rgb24_top_left_colormap.tga",
    "RLE color mapped 32 bit": "rgb32_top_left_rle_colormap.tga",
    "RLE True Color 32 bit": "rgb32_top_left_rle.tga",
    "True Color 32 bit": "rgb32_bottom_left.tga",
    "RLE Grey 8 bit": "monochrome8_bottom_left_rle.tga",
    "Grey 8 bit": "monochrome8_bottom_left.tga",
    "RLE Grey 16 bit": "monochrome16_top_left_rle.tga",
    "Grey 16 bit": "monochrome16_top_left.tga"
  };

  var dropZone = document.getElementById("wrapper");
  dropZone.addEventListener("dragover", dragOverHandler, false);
  dropZone.addEventListener("drop", dropHandler, false);

  function dragOverHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }

  function dropHandler(e) {
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    if (file) {
      readFile(file)
    }
  }

  var selectController = gui.add(menu, "testfile", images);
  selectController.name("Select a file");
  selectController.onChange(function (value) {
    menu.filename = value;
    var tga = new TGA();
    tga.open("testdata/" + value, function () {
      createGUI(this);
      renderImage(this);
    });
  });

  document.getElementById("testfile").selectedIndex = -1;

  function loadImage(name, buffer) {
    menu.filename = name;
    var tga = new TGA();
    tga.load(buffer);
    createGUI(tga);
    renderImage(tga);
  }

  function createGUI(tga) {
    var header = tga.header;
    var footer = tga.footer;

    if (guiHeader) {
      gui.removeFolder('Header Data');
      gui.removeFolder('Footer Data');

      if (filenameController) {
        gui.remove(filenameController);
      }
      if (scaleController) {
        gui.remove(scaleController);
      }
      if (bgController) {
        gui.remove(bgController);
        bgController = undefined;
      }
    }

    filenameController = gui.add(menu, "filename").name("Filename");

    scaleController = gui.add(menu, "scale", 0.1, 10).name("Scale");
    scaleController.onChange(function (scale) {
      canvas.style.width = (tga.header.width * scale) + "px";
      canvas.style.height = (tga.header.height * scale) + "px";
    });

    if (footer.usesAlpha) {
      bgController = gui.addColor(menu, 'backgroundColor');
      bgController.name("Background color");
      bgController.onChange(function (value) {
        canvas.style.background = value;
      });
    }

    guiHeader = gui.addFolder('Header Data');
    guiHeader.open();

    guiHeader.add(header, "idLength");
    guiHeader.add(header, "colorMapType");
    guiHeader.add(header, "imageType");
    guiHeader.add(header, "colorMapIndex");
    guiHeader.add(header, "colorMapLength");
    guiHeader.add(header, "colorMapDepth");
    guiHeader.add(header, "offsetX");
    guiHeader.add(header, "offsetY");
    guiHeader.add(header, "width");
    guiHeader.add(header, "height");
    guiHeader.add(header, "pixelDepth");
    guiHeader.add(header, "alphaBits");
    guiHeader.add(header, "origin");

    if (footer.hasFooter) {
      guiFooter = gui.addFolder('Footer Data');
      guiFooter.open();

      guiFooter.add(footer, "developerOffset");
      guiFooter.add(footer, "extensionOffset");

      if (footer.attributeType) {
        guiFooter.add(footer, "attributeType");
      }
    }

    var el = document.getElementsByTagName("input");
    for (var i = 0, length = el.length; i < length; i++) {
      el[i].readOnly = true; // Makes input elements not editable
    }
  }

  function renderImage(tga) {
    clearCanvas();
    canvas.width = tga.header.width;
    canvas.height = tga.header.height;
    var imageData = ctx.createImageData(tga.header.width, tga.header.height);
    tga.getImageData(imageData);
    ctx.putImageData(imageData, 0, 0);
  }

  function readFile(file) {
    var reader = new FileReader;

    reader.onload = function (e) {
      var buffer = e.target.result;
      document.getElementById("testfile").selectedIndex = -1;
      loadImage(file.name, buffer);
    };

    var ext = file.name.toLowerCase().split(".").pop();
    if (ext !== "tga") {
      alert("Unknown file format." + ext + "\nSupported file extension: tga");
    } else {
      reader.readAsArrayBuffer(file);
    }
  }

  function initCanvas() {
    canvas.width = 400;
    canvas.height = 400;

    ctx.font = "small-caps 30px Arial";
    ctx.fillStyle = "#EEEEEE";
    ctx.textAlign = "center";
    ctx.fillText("Drop .tga file here", canvas.width / 2, canvas.height / 2);
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  dat.GUI.prototype.removeFolder = function (name) {
    var folder = this.__folders[name];
    if (!folder) {
      return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
  };
})();
