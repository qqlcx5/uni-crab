/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-09-30 11:50:53
 */
import Vue from "vue";
import { IConfigTyps } from "./types/configTypes";
import { ICommonConfig } from "./types/commonTypes";

interface INoCareMergeType {
    [k: string]: any;
}

interface OptionConfig {
    useRouter: Boolean;
    config: IConfigTyps & INoCareMergeType;
    utils: INoCareMergeType;
    common: ICommonConfig & INoCareMergeType;
    filter: {
        [k: string]: (value: any, ...arg: any[]) => any;
    };
    http: {
        header: INoCareMergeType;
        apiConfig: INoCareMergeType;
        apiList: Array<any>;
    };
    router: INoCareMergeType;
}

type PluginFunction<T = OptionConfig> = (vue: typeof Vue, options: T, _: any) => void;


declare module "vue/types/vue" {

    interface Vue {
        $tips: (opt: any) => any;
    }

    interface VueConstructor<V extends Vue> {
        use<T>(plugin: PluginFunction<T>, options: T): VueConstructor<V>;
    }
}

declare const install: PluginFunction;

export default install;