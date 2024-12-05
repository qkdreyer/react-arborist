var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useTreeApi } from "../context";
export const ListInnerElement = forwardRef(function InnerElement(_a, ref) {
    var _b, _c, _d, _e;
    var { style } = _a, rest = __rest(_a, ["style"]);
    const tree = useTreeApi();
    const paddingTop = (_c = (_b = tree.props.padding) !== null && _b !== void 0 ? _b : tree.props.paddingTop) !== null && _c !== void 0 ? _c : 0;
    const paddingBottom = (_e = (_d = tree.props.padding) !== null && _d !== void 0 ? _d : tree.props.paddingBottom) !== null && _e !== void 0 ? _e : 0;
    return (_jsx("div", Object.assign({ ref: ref, style: Object.assign(Object.assign({}, style), { height: `${parseFloat(style.height) + paddingTop + paddingBottom}px` }) }, rest)));
});
