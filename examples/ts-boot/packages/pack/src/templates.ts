import { ControlTemplate, ActivityConfigure } from '@tsdi/activities';
import {
    CleanActivityOption, ServeConfigure, WatchActivityOption,
    ShellActivityOption, UnitTestActivityOption
} from './tasks';
import {
    TsBuildOption, DistActivityOption, AssetActivityOption,
    SourceActivityOption, JsonEditActivityOption, JsonReplaceActivityOption
} from './transforms';
import { RollupOption } from './rollups';
import { LibPackBuilderOption } from './builds';

export type PackTemplates = ControlTemplate | AssetActivityOption | CleanActivityOption
    | DistActivityOption | ServeConfigure | ShellActivityOption | SourceActivityOption
    | UnitTestActivityOption | WatchActivityOption | JsonEditActivityOption | JsonReplaceActivityOption
    | TsBuildOption | RollupOption | LibPackBuilderOption;

export interface PackConfigure extends ActivityConfigure<PackTemplates> {

}
