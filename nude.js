/*
 * Nude.js - Nudity detection with Javascript and HTMLCanvas
 * 
 * Author: Patrick Wied ( http://www.patrick-wied.at )
 * Version: 0.1  (2010-11-21)
 * License: MIT License
 */
(function () {

    var nude = (function () {
        // private var definition
        var canvas = null,
            ctx = null,
            resultFn = null,
            // private functions
            initCanvas = function () {
                canvas = document.createElement("canvas");
                // the canvas should not be visible
                canvas.style.display = "none";
                var b = document.getElementsByTagName("body")[0];
                b.appendChild(canvas);
                ctx = canvas.getContext("2d");
            },
            loadImageByCanvas = function (element) {
                canvas = element;
                ctx = canvas.getContext("2d");
                resultFn = null;
            },
            loadImageByElement = function (element) {
                // apply width and height to the canvas element
                // make sure you set width and height at the element
                canvas.width = element.width;
                canvas.height = element.height;
                // reset result function
                resultFn = null;
                // draw the image/video element into the canvas
                ctx.drawImage(element, 0, 0);
            },
            scanImage = function () {
                // get the image data
                var image = ctx.getImageData(0, 0, canvas.width, canvas.height),
                    imageData = image.data;

                var myWorker = new Worker('worker.nude.js'), message = [imageData, canvas.width, canvas.height];
                myWorker.postMessage(message);
                myWorker.onmessage = function (event) {
                    resultHandler(event.data);
                }
            },
            // the result handler will be executed when the analysing process is done
            // the result contains true (it is nude) or false (it is not nude)
            // if the user passed an result function to the scan function, the result function will be executed
            resultHandler = function (result) {
                if (resultFn) {
                    resultFn(result);
                } else {
                    if (result)
                        console.log("the picture contains nudity");
                }
            };
        // public interface
        return {
            init: function () {
                initCanvas();
            },
            loadByImage: function (element) {
                loadImageByElement(element);
            },
            loadByCanvas: function (element) {
                loadImageByCanvas(element);
            },
            scan: function (fn) {
                if (fn && typeof fn === "function") {
                    resultFn = fn;
                }
                scanImage();
            }
        };
    })();
    // register nude at window object
    if (!window.nude)
        window.nude = nude;
})();