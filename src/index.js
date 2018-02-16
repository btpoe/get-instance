export default function (Controller, {
    disposeMethod = false,
} = {}) {
    const key = Symbol(Controller.name || 'instance');

    const getInstance = (node, ...args) => {
        if (!node) {
            return null;
        }
        if (!(node[key] instanceof Controller)) {
            node[key] = new Controller(node, ...args);
        }
        return node[key];
    };

    getInstance.instanceKey = key;

    getInstance.dispose = (node) => {
        node[key] && disposeMethod && node[key][disposeMethod]();
        delete node[key];
    };

    return getInstance;
}
