import { DIModule, Startup } from '../src';
import { Injectable, Inject } from '@tsdi/ioc';
import { Aspect, AopModule, Around, Joinpoint } from '@tsdi/aop';
import { LogModule } from '@tsdi/logs';


export class TestService {
    testFiled = 'test';
    test() {
        console.log('this is test');
    }
}

@DIModule({
    imports: [
        TestService
    ],
    exports: [
        TestService
    ]
})
export class ModuleCustom {

}

@DIModule({
    imports: [
        ModuleCustom
    ],
    providers: [
        { provide: 'mark', useFactory: () => 'marked' }
    ],
    exports: [
        ModuleCustom
    ]
})
export class ModuleA {

}

@Injectable
export class ClassSevice extends Startup {
    async onInit(): Promise<void> {
    }
    @Inject('mark')
    mark: string;
    state: string;

    async startup(): Promise<any> {
        console.log('running.....');
        let refs = this.getContainer().getTypeReflects();
        console.log(refs.get(ClassSevice));

        // console.log(this.container);
    }

}

@Aspect
export class Logger {

    @Around('execution(*.run)')
    log(jp: Joinpoint) {
        console.log(jp.fullName, jp.state, 'run........');
    }

    @Around('execution(*.test)')
    logTest() {
        console.log('test........');
    }
}


@DIModule({
    imports: [
        AopModule,
        LogModule,
        Logger,
        ClassSevice,
        ModuleA
    ],
    bootstrap: ClassSevice
})
export class ModuleB {
    constructor() {

    }

}
