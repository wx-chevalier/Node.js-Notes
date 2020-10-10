import { AutoWired, Injectable, Param, Singleton, Registration, Inject } from '@tsdi/ioc';
import { IContainer, ContainerToken } from '@tsdi/core';

export class SimppleAutoWried {
    constructor() {
    }

    @AutoWired
    dateProperty: Date;
}

@Singleton
export class Person {
    name = 'testor';
}

@Singleton
// @Injectable
export class RoomService {
    constructor() {

    }
    @AutoWired
    current: Date;
}

@Injectable()
export class ClassRoom {
    constructor(public service: RoomService) {

    }
}

export abstract class Student {
    @Inject(ContainerToken)
    container: IContainer;
    @Inject(Date)
    join: any;
    constructor() {
    }
    abstract sayHi(): string;
}

@Injectable({ provide: Student })
export class MiddleSchoolStudent extends Student {
    constructor() {
        super();
    }
    sayHi() {
        return 'I am a middle school student';
    }
}

@Injectable()
export class MClassRoom {
    @AutoWired(MiddleSchoolStudent)
    leader: Student;
    constructor() {

    }
}


@Injectable({ provide: Student, alias: 'college' })
export class CollegeStudent extends Student {
    constructor() {
        super();
    }
    sayHi() {
        return 'I am a college student';
    }
}

@Injectable
export class CollegeClassRoom {
    constructor(
        @Param(CollegeStudent)
        @AutoWired(CollegeStudent)
        public leader: Student) {

    }
}


@Injectable
export class InjMClassRoom {
    // @Inject(MiddleSchoolStudent)
    @Inject
    // @Inject({ type: MiddleSchoolStudent })
    leader: Student;
    constructor() {

    }
}

export interface IClassRoom {
    leader: Student;
}

@Injectable
export class InjCollegeClassRoom {
    constructor(
        // all below decorator can work, also @AutoWired, @Param is.
        // @Inject(new Registration(Student, 'college')) // need CollegeStudent also register.
        @Inject(CollegeStudent)
        // @Inject({ provider: CollegeStudent })
        // @Inject({ provider: Student, alias: 'college' }) //need CollegeStudent also register.
        // @Inject({ type: CollegeStudent })
        public leader: Student
    ) {

    }
}

@Injectable
export class InjCollegeAliasClassRoom {
    constructor(
        // all below decorator can work, also @AutoWired, @Param is.
        @Inject(new Registration(Student, 'college')) // need CollegeStudent also register.
        // @Inject(CollegeStudent)
        // @Inject({ provider: CollegeStudent })
        // @Inject({ provider: Student, alias: 'college' }) // need CollegeStudent also register.
        // @Inject({ type: CollegeStudent })
        public leader: Student
    ) {

    }
}


@Injectable('StringClassRoom')
export class StingMClassRoom {
    // @Inject(MiddleSchoolStudent)
    @Inject
    // @Inject({ type: MiddleSchoolStudent })
    leader: Student;
    constructor() {

    }
}

export class StringIdTest {
    constructor( @Inject('StringClassRoom') public room: IClassRoom) {

    }
}

export const CollClassRoom = Symbol('CollegeClassRoom');

@Injectable(CollClassRoom)
export class SymbolCollegeClassRoom {

    @Inject(CollegeStudent)
    leader: Student;
    constructor() {

    }
}

export class SymbolIdest {
    @Inject(CollClassRoom)
    public room: IClassRoom

    @Inject(ContainerToken)
    public container: IContainer
    constructor( @Inject('StringClassRoom')
    public room2: IClassRoom) {

    }
}

// @Aspect
// export class AspectTest {

//     @Around('execution()')
//     public doLog() {

//     }

//     @Before('execution(**/model/*.dowork(...))')
//     beforCheck() {

//     }

//     @After('execution(**/model/*.dowork(...))')
//     afterCheck() {

//     }

//     @AfterReturning('xxx', 'execution(**/model/*.dowork(...))')
//     public returnCheck() {

//     }

//     @AfterThrowing('xxx', 'execution(**/model/*.dowork(...))')
//     public throwingCheck() {

//     }

// }
