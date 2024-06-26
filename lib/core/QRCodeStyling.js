import getMode from "../tools/getMode.js";
import mergeDeep from "../tools/merge.js";
import downloadURI from "../tools/downloadURI.js";
import QRCanvas from "./QRCanvas.js";
import QRSVG from "./QRSVG.js";
import drawTypes from "../constants/drawTypes.js";
import defaultOptions from "./QROptions.js";
import sanitizeOptions from "../tools/sanitizeOptions.js";
import qrcode from "qrcode-generator";
export default class QRCodeStyling {
    constructor(options) {
        this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options)) : defaultOptions;
        this.update();
    }
    static _clearContainer(container) {
        if (container) {
            container.innerHTML = "";
        }
    }
    async _getQRStylingElement(extension = "png") {
        if (!this._qr)
            throw "QR code is empty";
        if (extension.toLowerCase() === "svg") {
            let promise, svg;
            if (this._svg && this._svgDrawingPromise) {
                svg = this._svg;
                promise = this._svgDrawingPromise;
            }
            else {
                svg = new QRSVG(this._options);
                promise = svg.drawQR(this._qr);
            }
            await promise;
            return svg;
        }
        else {
            let promise, canvas;
            if (this._canvas && this._canvasDrawingPromise) {
                canvas = this._canvas;
                promise = this._canvasDrawingPromise;
            }
            else {
                canvas = new QRCanvas(this._options);
                promise = canvas.drawQR(this._qr);
            }
            await promise;
            return canvas;
        }
    }
    update(options) {
        QRCodeStyling._clearContainer(this._container);
        this._options = options ? sanitizeOptions(mergeDeep(this._options, options)) : this._options;
        if (!this._options.data) {
            return;
        }
        this._qr = qrcode(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
        this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode(this._options.data));
        this._qr.make();
        if (this._options.type === drawTypes.canvas) {
            this._canvas = new QRCanvas(this._options);
            this._canvasDrawingPromise = this._canvas.drawQR(this._qr);
            this._svgDrawingPromise = undefined;
            this._svg = undefined;
        }
        else {
            this._svg = new QRSVG(this._options);
            this._svgDrawingPromise = this._svg.drawQR(this._qr);
            this._canvasDrawingPromise = undefined;
            this._canvas = undefined;
        }
        this.append(this._container);
    }
    append(container) {
        if (!container) {
            return;
        }
        if (typeof container.appendChild !== "function") {
            throw "Container should be a single DOM node";
        }
        if (this._options.type === drawTypes.canvas) {
            if (this._canvas) {
                container.appendChild(this._canvas.getCanvas());
            }
        }
        else {
            if (this._svg) {
                container.appendChild(this._svg.getElement());
            }
        }
        this._container = container;
    }
    async getRawData(extension = "png") {
        if (!this._qr)
            throw "QR code is empty";
        const element = await this._getQRStylingElement(extension);
        if (extension.toLowerCase() === "svg") {
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(element.getElement());
            return new Blob(['<?xml version="1.0" standalone="no"?>\r\n' + source], { type: "image/svg+xml" });
        }
        else {
            return new Promise((resolve) => element.getCanvas().toBlob(resolve, `image/${extension}`, 1));
        }
    }
    async download(downloadOptions) {
        if (!this._qr)
            throw "QR code is empty";
        let extension = "png";
        let name = "qr";
        //TODO remove deprecated code in the v2
        if (typeof downloadOptions === "string") {
            extension = downloadOptions;
            console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument");
        }
        else if (typeof downloadOptions === "object" && downloadOptions !== null) {
            if (downloadOptions.name) {
                name = downloadOptions.name;
            }
            if (downloadOptions.extension) {
                extension = downloadOptions.extension;
            }
        }
        const element = await this._getQRStylingElement(extension);
        if (extension.toLowerCase() === "svg") {
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(element.getElement());
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            downloadURI(url, `${name}.svg`);
        }
        else {
            const url = element.getCanvas().toDataURL(`image/${extension}`);
            downloadURI(url, `${name}.${extension}`);
        }
    }
}
//# sourceMappingURL=QRCodeStyling.js.map