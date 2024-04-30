import QRCodeStyling from "./QRCodeStyling";
import fs from "fs";
import path from "path";
describe("Test QRCodeStyling class", function () {
    beforeAll(function () {
        global.document.body.innerHTML = "<div id='container'></div>";
    });
    it("The README example should work correctly", function (done) {
        var expectedQRCodeFile = fs.readFileSync(path.resolve(__dirname, "../assets/test/image_from_readme.png"), "base64");
        var qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            data: "TEST",
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=",
            dotsOptions: {
                color: "#4267b2",
                type: "rounded"
            },
            backgroundOptions: {
                color: "#e9ebee"
            }
        });
        global.document.body.innerHTML = "<div id='container'></div>";
        var container = global.document.getElementById("container");
        qrCode.append(container);
        //TODO remove setTimout
        setTimeout(function () {
            expect(qrCode._canvas.getCanvas().toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
            done();
        });
    });
});
//# sourceMappingURL=QRCodeStyling.test.js.map