import { createClassDecorator, ITypeDecorator } from '../factories';
import { ClassMetadata } from '../metadatas';



/**
 * Abstract decorator. define for class.
 *
 * @Abstract
 */
export const Abstract: ITypeDecorator<ClassMetadata> = createClassDecorator<ClassMetadata>('Abstract');

