import { AutoWired, Injectable, Param, Singleton, Registration, Inject, IIocContainer, IocContainerToken } from '../src';

export class SimppleAutoWried {
    constructor() {
    }

    @AutoWired
    dateProperty: Date;
}

@Singleton()
export class Person {
    name = 'testor';
}

@Singleton()
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
    @Inject(IocContainerToken)
    container: IIocContainer;
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
    private stu: Student;

    @AutoWired(MiddleSchoolStudent)
    set leader(stu: Student) {
        console.log('set MClassRoom leader value')
        this.stu = stu;
    }

    get leader() {
        return this.stu;
    }

    constructor() {

    }
}


@Injectable(Student, 'college')
export class CollegeStudent extends Student {
    constructor() {
        super();
    }
    sayHi() {
        return 'I am a college student';
    }
}

@Injectable()
export class CollegeClassRoom {
    constructor(
        @Param(CollegeStudent)
        @AutoWired(CollegeStudent)
        public leader: Student) {

    }
}


@Injectable()
export class InjMClassRoom {
    // @Inject(MiddleSchoolStudent)
    private stu: Student;

    @Inject
    // @Inject({ type: MiddleSchoolStudent })
    set leader(stu: Student) {
        console.log('set InjMClassRoom leader value')
        this.stu = stu;
    }

    get leader() {
        return this.stu;
    }

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
        @AutoWired(new Registration(Student, 'college')) // need CollegeStudent also register.
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
    constructor(@Inject('StringClassRoom') public room: IClassRoom) {

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

    @Inject(IocContainerToken)
    public container: IIocContainer
    constructor(@Param('StringClassRoom')
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
