import { AutoWired, Injectable, IIocContainer, ParameterMetadata, Param, Registration, Inject, Singleton, IocContainer } from '../src';
import { SimppleAutoWried, ClassRoom, MClassRoom, CollegeClassRoom, MiddleSchoolStudent, CollegeStudent, Student, InjMClassRoom, InjCollegeClassRoom, InjCollegeAliasClassRoom, StingMClassRoom, StringIdTest, SymbolIdest, SymbolCollegeClassRoom } from './debug';
import expect = require('expect');

describe('custom register test', () => {

    let container: IIocContainer;
    beforeEach(async () => {
        container = new IocContainer();
    });

    it('decorator toString is decorator name', () => {
        expect(AutoWired.toString()).toEqual('@AutoWired');
        expect(Injectable.toString()).toEqual('@Injectable');
        expect(Inject.toString()).toEqual('@Inject');
        expect(Param.toString()).toEqual('@Param');
        expect(Singleton.toString()).toEqual('@Singleton');

    })

    it('should auto wried property', () => {
        container.register(SimppleAutoWried);
        let instance = container.get(SimppleAutoWried);
        expect(instance).toBeDefined();
        expect(instance.dateProperty).toBeDefined();
        expect(instance.dateProperty instanceof Date).toBeTruthy();
    });

    it('should auto create constructor params', () => {
        container.register(ClassRoom);
        let instance = container.get(ClassRoom);
        // console.log(instance);
        expect(instance).toBeDefined();
        expect(instance.service).toBeDefined();
        expect(instance.service.current instanceof Date).toBeTruthy();
    });

    it('should auto create prop with spec @AutoWired class.', () => {
        container.register(MClassRoom);
        let instance = container.get(MClassRoom);
        expect(instance).toBeDefined();
        expect(instance.leader).toBeDefined();
        expect(instance.leader.sayHi()).toEqual('I am a middle school student');
    });

    it('should auto create constructor params with spec @Param class.', () => {
        container.register(CollegeClassRoom);
        let instance = container.get(CollegeClassRoom);
        expect(instance).toBeDefined();
        expect(instance.leader).toBeDefined();
        expect(instance.leader.sayHi()).toEqual('I am a college student');
    });

    it('should auto create prop with spec @Inject class.', () => {
        container.register(MiddleSchoolStudent);
        container.register(InjMClassRoom);
        let instance = container.get(InjMClassRoom);
        expect(instance).toBeDefined();
        expect(instance.leader).toBeDefined();
        expect(instance.leader.sayHi()).toEqual('I am a middle school student');
    });

    it('should auto create constructor params with spec @Inject class.', () => {
        container.register(InjCollegeClassRoom);
        let instance = container.get(InjCollegeClassRoom);
        expect(instance).toBeDefined();
        expect(instance.leader).toBeDefined();
        expect(instance.leader.sayHi()).toEqual('I am a college student');
    });

    it('should auto create constructor params with spec @Inject class with alias.', () => {
        container.register(CollegeStudent);
        container.register(InjCollegeAliasClassRoom);
        let instance = container.get(InjCollegeAliasClassRoom);
        expect(instance).toBeDefined();
        expect(instance.leader).toBeDefined();
        expect(instance.leader.sayHi()).toEqual('I am a college student');
    });

    it('should provider implement sub class to abstract class', () => {
        container.register(MiddleSchoolStudent);
        container.register(CollegeStudent);

        let instance = container.get(Student);
        expect(instance).toBeDefined();
        expect(instance.sayHi()).toEqual('I am a middle school student');

        let instance2 = container.get(new Registration(Student, 'college'));
        expect(instance2).toBeDefined();
        expect(instance2.sayHi()).toEqual('I am a college student');
    });


    it('should work with sting id to get class', () => {
        container.register(MiddleSchoolStudent);
        container.register(StingMClassRoom);
        container.register(StringIdTest);

        let instance = container.get(StringIdTest);
        expect(instance).toBeDefined();
        expect(instance.room).toBeDefined();
        expect(instance.room.leader).toBeDefined();
        expect(instance.room.leader.sayHi()).toEqual('I am a middle school student');

    });

    it('should work with Symbol id to get class', () => {
        container.register(SymbolCollegeClassRoom);
        container.register(SymbolIdest);

        let instance = container.get(SymbolIdest);
        expect(instance).toBeDefined();
        expect(instance.room).toBeDefined();
        expect(instance.room.leader).toBeDefined();
        expect(instance.room.leader.sayHi()).toEqual('I am a college student');

    });

});
