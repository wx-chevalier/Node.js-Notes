import { Abstract, Inject, Injectable } from '@tsdi/ioc';
import { ContainerToken, IContainer } from '../src';

@Injectable
export class Home {
    getAddress() {
        return 'home';
    }
}

@Abstract()
export abstract class Animal {

    @Inject
    home: Home;

    @Inject(ContainerToken)
    container: IContainer;

    back() {
        return 'back ' + this.home.getAddress();
    }
}

@Injectable
export class Person extends Animal {

}
