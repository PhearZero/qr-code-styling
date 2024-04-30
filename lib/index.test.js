import * as index from "./index";
describe("Index", function () {
    it.each(["dotTypes", "errorCorrectionLevels", "errorCorrectionPercents", "modes", "qrTypes", "default"])("The module should export certain submodules", function (moduleName) {
        expect(Object.keys(index)).toContain(moduleName);
    });
});
//# sourceMappingURL=index.test.js.map