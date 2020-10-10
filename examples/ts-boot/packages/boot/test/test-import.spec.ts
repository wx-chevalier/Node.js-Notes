import { ModuleA, ModuleB, ClassSevice } from './demo';
import { BootApplication } from '../src';
import expect = require('expect');


describe('di module', () => {

    it('should has bootstrap, and auto wrid mark via inject.', async () => {
        let ctx = await BootApplication.run(ModuleB);
        expect(ctx.target).not.toBeNull();
        expect(ctx.bootstrap).not.toBeNull();
        // expect(md.bootstrap).to.eq(ClassSevice);
        // expect(md.container).to.not.undefined;
        // expect(md.container.has('mark')).to.true;
        console.log(ctx.bootstrap.mark);
        expect(ctx.bootstrap.mark).toEqual('marked');
        // expect(md.state).eq('started');
    });

});

