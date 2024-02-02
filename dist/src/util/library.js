"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSameElements = exports.parseBoolean = void 0;
const parseBoolean = (value) => {
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    return value;
};
exports.parseBoolean = parseBoolean;
const hasSameElements = (array1, array2) => {
    if (array1.length === array2.length) {
        return array1.every((element) => {
            if (array2.includes(element)) {
                return true;
            }
            return false;
        });
    }
    return false;
};
exports.hasSameElements = hasSameElements;
