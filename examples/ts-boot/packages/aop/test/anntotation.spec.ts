import {
    Inject, Injectable, IocContainer, IIocContainer, AutoWired
} from '@tsdi/ioc';
import { AnnotationAspect } from './aop/AnnotationAspect';
import { CheckRightAspect } from './aop/CheckRightAspect';
import { IocLog } from './aop/IocLog';
import { AopModule } from '../src';
import expect = require('expect');
import { IContainer, ContainerBuilder } from '@tsdi/core';


describe('aop test', () => {


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

        @AutoWired
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

        @AutoWired()
        sayHello(@Inject(Child) person: Person) {
            return person.say();
        }

    }

    @Injectable('Test3')
    class MethodTest3 {
        constructor() {

        }

        @AutoWired
        sayHello(@Inject(Child) personA: Person, personB: Person) {
            return personA.say() + ', ' + personB.say();
        }

        sayHello2() {

        }
    }

    let container: IContainer;
    beforeEach(async () => {
        let build  = new ContainerBuilder();
        container =  build.create();
        container.load(AopModule, IocLog);
    });

    it('Aop anntotation test', () => {

        container.register(AnnotationAspect);
        container.register(CheckRightAspect);
        container.register(MethodTest3);
        expect(container.invoke('Test3', 'sayHello')).toEqual('Mama, I love you.');

    });
});
