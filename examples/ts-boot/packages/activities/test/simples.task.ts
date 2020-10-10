import { Task, Activity, ActivityContext, Activities } from '../src';
import { IContainer, ContainerToken } from '@tsdi/core';
import { Inject } from '@tsdi/ioc';
import { ServerActivitiesModule } from '@tsdi/platform-server-activities';

@Task('stest')
export class SimpleTask extends Activity<string> {
    async execute(ctx: ActivityContext): Promise<void> {
        // console.log('before simple task:', this.name);
        this.result.value = await Promise.resolve('simple task')
            .then(val => {
                console.log('return simple task:', val);
                return val;
            });
    }

}

@Task('comowork')
export class WorkTask extends Activity<string> {
    async execute(ctx: ActivityContext): Promise<void> {
        // console.log('before simple task:', this.name);
        this.result.value = await Promise.resolve('component task')
            .then(val => {
                console.log('return component work task:', val);
                return val;
            });
    }

}

@Task({
    imports: [
        WorkTask
    ],
    selector: 'comptest',
    template: [
        { activity: Activities.if, condition: (ctx) => !!ctx.args[0], body: [] },
        {
            activity: Activities.else,
            body: [
                // WorkTask
                {
                    activity: Activities.switch,
                    switch: (ctx) => ctx.configures.length,
                    cases: [
                        { case: 0, body: [] }
                    ]
                },
                {
                    activity: 'comowork'
                }
            ]
        },
        // {
        //     activity: 'comowork'
        // }
    ]
})
export class SimpleCTask {

    // async execute(ctx: ActivityContext): Promise<void> {
    //     console.log('execute SimpleCTask........');
    //     await super.execute(ctx);
    //     // console.log('before component task:', this.name);
    //     this.result.value = await Promise.resolve('component task')
    //         .then(val => {
    //             console.log('return component task:', val);
    //             return val;
    //         });
    // }
}


@Task({
    name: 'test-module',
    imports: [
        ServerActivitiesModule
    ],
    template: [
        {
            name: 'test---task---3',
            activity: Activities.if,
            condition: ctx => true,
            body: [SimpleTask]
        },
        SimpleCTask
    ]
})
export class TaskModuleTest {
    constructor(@Inject(ContainerToken) container: IContainer) {

    }

}



// async function test() {

//     let container = new Worflow(__dirname);

//     // container.use({ modules: [SimpleTask] });
//     await container.bootstrap(SimpleTask);


//     console.log('\n------------SimpleTask------------------');
//     let container2 = new Worflow(__dirname);
//     await container2.use(SimpleTask)
//         .bootstrap('test');

//     console.log('\n-----------SimpleCTask-------------------');
//     await Workflow.create( SimpleCTask)
//         .bootstrap('comptest');


//     console.log('\n-----------Custome Component-------------------');
//     await Workflow.create()
//         .bootstrap({
//             providers: {
//                 name: 'test1'
//             },
//             task: TaskElement,
//             children: [
//                 {
//                     providers: { name: 'test------1' },
//                     task: SimpleTask
//                 },
//                 {
//                     providers: { name: 'test------2' },
//                     task: SimpleCTask
//                 }
//             ]
//         });

//     console.log('\n-------------Component Module-----------------');
//     await Workflow.create()
//         .bootstrap(TaskModuleTest);
// }

// test();
