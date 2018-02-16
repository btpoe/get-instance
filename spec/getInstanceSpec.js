describe('getInstance', function() {
    const getInstance = require('../dist/index').default;

    let destroyCalled = false;

    class Demo {
        constructor(node) { this.node = node; }

        destroy() {
            delete this.node;
            destroyCalled = true;
        }
    }
    Demo.getInstance = getInstance(Demo);

    const element = {};

    beforeEach(() => {
        destroyCalled = false;
    });

    it('creates one instance per source reference', () => {
        const inst1 = Demo.getInstance(element);
        const inst2 = Demo.getInstance(element);
        expect(inst1).toBe(inst2);
    });

    it('exposes the instance key', () => {
        expect(Demo.getInstance.instanceKey).toBeDefined();
    });

    it('exposes a dispose method', () => {
        expect(Demo.getInstance.dispose).toBeDefined();
    });

    it('properly detaches the instance when dispose is called', () => {
        const inst = Demo.getInstance(element);
        expect(inst).toBeDefined();
        Demo.getInstance.dispose(element);
        expect(element[Demo.getInstance.instanceKey]).toBeUndefined();
    });

    it('calls on the disposeMethod if defined when an instance is disposed', () => {
        const instanceGetter = getInstance(Demo, { disposeMethod: 'destroy' });
        instanceGetter(element);
        instanceGetter.dispose(element);
        expect(destroyCalled).toBe(true);
    });
});
