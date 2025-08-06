// Cross-browser matches function for React projects
export default function matches(elem, selector) {
    if (!elem || typeof elem.matches !== 'function') {
        // Try vendor-prefixed versions
        const proto = elem ? elem : {};
        if (typeof proto.mozMatchesSelector === 'function') {
            return proto.mozMatchesSelector(selector);
        } else if (typeof proto.webkitMatchesSelector === 'function') {
            return proto.webkitMatchesSelector(selector);
        } else if (typeof proto.msMatchesSelector === 'function') {
            return proto.msMatchesSelector(selector);
        } else if (typeof proto.oMatchesSelector === 'function') {
            return proto.oMatchesSelector(selector);
        }
        return false;
    }
    return elem.matches(selector);
}
