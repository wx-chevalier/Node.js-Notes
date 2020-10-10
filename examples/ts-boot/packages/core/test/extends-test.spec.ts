import { ContainerBuilder, IContainer } from '../src';
// import { AnnotationAspect } from './aop/AnnotationAspect';
// import { CheckRightAspect } from './aop/CheckRightAspect';
import * as testModules from './extends-test';
import { Person, Home } from './extends-test';
import expect = require('expect');

describe('extends test', () => {
    let container: IContainer;
    before(async () => {
        let builder = new ContainerBuilder();
        container = await builder.build(testModules);
    });

    it('should auto wried base class property', () => {
        expect(container.has(Person)).toBeTruthy();
        let instance = container.get(Person);
        expect(instance.home).not.toBeUndefined();
        expect(instance.container).not.toBeUndefined();
        expect(instance.container.has(Home)).toEqual(true);
        expect(instance.home instanceof Home).toEqual(true);
        expect(instance.back()).toEqual('back home');
    });

});

