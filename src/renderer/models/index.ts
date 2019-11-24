import { Models } from '@rematch/core';
import { count } from './counter';

const rootModel: RootModel = { count };

// add interface to avoid recursive type checking
export interface RootModel extends Models {
    count: typeof count;
}

export default rootModel;
