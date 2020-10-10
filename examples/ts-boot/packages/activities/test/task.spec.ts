import expect = require('expect');
import { Workflow, WorkflowInstance, ActivityModule } from '../src';
import { SimpleTask, SimpleCTask, TaskModuleTest } from './simples.task';
import { BootApplication, ContainerPool } from '@tsdi/boot';
import { ComponentsModule } from '@tsdi/components';


describe('activity test', () => {
    describe('#auto register with build', () => {

        it('should bootstrap with single task.', async () => {
            let ctx = await Workflow.run(SimpleTask);
            expect(ctx.runnable instanceof WorkflowInstance).toBe(true);
            // console.log(result);
            expect(ctx.result).toEqual('simple task');
        });

        it('should bootstrap with single task via name or provider.', async () => {
            let ctx = await Workflow.run(SimpleTask);
            // console.log(result);
            expect(ctx.result).toEqual('simple task');
        });

        it('should bootstrap with component task.', async () => {
            let ctx = await Workflow.run(SimpleCTask);
            expect(ctx.result).toEqual('component task');
        });

        it('should bootstrap with component task via name or provider.', async () => {
            let ctx = await Workflow.run(SimpleCTask);
            // console.log('comptest:' , result.activity, result.instance);
            expect(ctx.result).toEqual('component task');
        });

        it('should bootstrap with configure.', async () => {
            let ctx = await Workflow.run({
                // deps: [
                //     ServerActivitiesModule
                // ],
                name: 'test1',
                template: [
                    {
                        name: 'test---ccc---1',
                        activity: SimpleTask
                    },
                    SimpleCTask
                    // {
                    //     name: 'test------2',
                    //     activity: SimpleCTask
                    // }
                ]

            });
            // console.log('configure:' , result.instance.constructor.name, result.instance['activities'], result.resultValue);
            // console.log(ctx.module, ctx.target, ctx.getBootTarget());
            expect(ctx.result).toEqual('component task');
        });

        it('should bootstrap with meta IConfigure.', async () => {
            let ctx = await Workflow.run(TaskModuleTest);
            // console.log('meta configure:' , result.instance.constructor.name, result.instance['activities'], result.resultValue)
            expect(ctx.result).toEqual('component task');
        });

        it('should bootstrap with template configure.', async () => {
            let app = new BootApplication();
            await app.container.load(ComponentsModule, ActivityModule, SimpleTask, SimpleCTask)
            let ctx = await Workflow.run({
                // deps: [
                //     ServerActivitiesModule
                // ],
                name: 'test1',
                template: [
                    {
                        name: 'test---ccc---1',
                        activity: 'stest'
                    },
                    {
                        name: 'test------2',
                        activity: 'comptest'
                    }
                ],
                raiseContainer: app.container.getFactory()

            });
            expect(ctx.result).toEqual('component task');
        });

    });
});
