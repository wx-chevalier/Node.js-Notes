import { AutoWired, Injectable, Singleton, IIocContainer, ParameterMetadata, Param, IocContainer } from '../src';
import { SimppleAutoWried, ClassRoom, MClassRoom, CollegeClassRoom, Person } from './debug';
import expect = require('expect');

describe('Singleton test', () => {



    it('should has one instance',  () => {
        let container = new IocContainer();
        container.register(Person);
        let instance = container.get(Person);
        expect(instance).toBeDefined();
        expect(instance.name).toEqual('testor');
        instance.name = 'testor B';
        expect(instance.name).toEqual('testor B');

        let instanceB = container.get(Person);
        expect(instanceB.name).toEqual('testor B');
        expect(instance).toEqual(instanceB);
    });

    // it('should has one instance',  async () => {
    //     let builder = new ContainerBuilder();
    //     let container = await builder.build({
    //         files: __dirname + '/debug.ts'
    //     });

    //     let instance = container.get(Person);
    //     expect(instance).toBeDefined();
    //     expect(instance.name).toEqual('testor');
    //     instance.name = 'testor B';
    //     expect(instance.name).toEqual('testor B');

    //     let instanceB = container.get(Person);
    //     expect(instanceB.name).toEqual('testor B');
    //     expect(instance).toEqual(instanceB);
    // });
});

