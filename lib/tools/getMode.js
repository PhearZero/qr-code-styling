import modes from "../constants/modes.js";
export default function getMode(data) {
    switch (true) {
        case /^[0-9]*$/.test(data):
            return modes.numeric;
        case /^[0-9A-Z $%*+\-./:]*$/.test(data):
            return modes.alphanumeric;
        default:
            return modes.byte;
    }
}
//# sourceMappingURL=getMode.js.map