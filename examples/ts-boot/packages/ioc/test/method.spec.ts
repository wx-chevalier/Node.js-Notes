import { Inject, AutoWired, Injectable, Singleton, IIocContainer, ParameterMetadata, Param, isFunction, getParamDecorators, IocContainer } from '../src';
import { hasOwnMethodMetadata, hasPropertyMetadata } from '../src';
import expect = require('expect');
// import { AnnotationAspect } from './aop/AnnotationAspect';
// import { CheckRightAspect } from './aop/CheckRightAspect';

describe('method exec test', () => {


    @Injectable
    class Person {
        constructor() {

        }
        say() {
            return 'I love you.'
        }
    }

    @Injectable
    class Child extends Person {
        constructor() {
            super();
        }
        say() {
            return 'Mama';
        }
    }

    class MethodTest {
        constructor() {

        }

        @AutoWired()
        sayHello(person: Person) {
            return person.say();
        }
    }

    class MethodTest2 {

        tester: string;

        @Inject
        testAt: Date;
        constructor() {

        }

        @AutoWired([
            { provide: Person, useClass: Child }
        ])
        sayHello(person: Person) {
            return person.say();
        }

    }

    @Injectable('Test3')
    class MethodTest3 {
        constructor() {

        }

        sayHello(@Inject(Child) personA: Person, personB: Person) {
            return personA.say() + ', ' + personB.say();
        }

        sayHello2() {

        }
    }

    let container: IIocContainer;
    beforeEach(() => {
        container = new IocContainer();
    });

    it('show has prop metadata', () => {
        expect(hasPropertyMetadata(Inject, MethodTest2)).toBeTruthy();
        expect(hasPropertyMetadata(Inject, MethodTest2, 'testAt')).toBeTruthy();
        expect(hasPropertyMetadata(Inject, MethodTest2, 'tester')).toBeFalsy();
        expect(hasOwnMethodMetadata(Inject, MethodTest3)).toBeFalsy();
    });

    // it('show has method metadata', () => {
    //     expect(hasOwnMethodMetadata(Method, MethodTest3)).toBeTruthy();
    //     expect(hasOwnMethodMetadata(Method, MethodTest3, 'sayHello')).toBeTruthy();
    //     expect(hasOwnMethodMetadata(Method, MethodTest3, 'sayHello2')).toBeFalsy();
    // });

    it('show exec with type and instance', async () => {
        // container.register(Person);
        container.register(MethodTest);
        let mtt = container.get(MethodTest);
        expect(isFunction(mtt.sayHello)).toBeTruthy();
        expect(await container.invoke(MethodTest, 'sayHello')).toEqual('I love you.');

    });

    it('show exec with specail param', async () => {
        // container.register(Person);
        container.register(MethodTest2);
        expect(await container.invoke(MethodTest2, t => t.sayHello)).toEqual('Mama');

    });

    it('show exec with many params', async () => {
        // container.register(Person);
        container.register(MethodTest3);
        expect(await container.invoke(MethodTest3, 'sayHello')).toEqual('Mama, I love you.');

    });

    it('show exec with many params and invoke with string', async () => {
        // container.register(Person);
        container.register(MethodTest3);
        expect(await container.invoke('Test3', 'sayHello')).toEqual('Mama, I love you.');

    });


    // it('Aop anntotation test', () => {
    //     container.register(AnnotationAspect);
    //     container.register(CheckRightAspect);
    //     container.register(MethodTest3);
    //     expect(container.invoke('Test3', 'sayHello')).toEqual('Mama, I love you.');

    // });
});
