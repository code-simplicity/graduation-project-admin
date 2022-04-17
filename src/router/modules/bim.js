import Layout from "@/layout/index.vue";
import {
    createNameComponent
} from "../createNode";
const route = [{
    path: "/bim",
    component: Layout,
    redirect: "/bim/bim-setting",
    meta: {
        title: "模型管理",
        icon: "el-icon-monitor",
    },
    children: [{
        path: "bim-setting",
        component: createNameComponent(() =>
            import("@/views/main/bim-manage/index.vue")
        ),
        meta: {
            title: "模型设置",
            icon: "el-icon-monitor",
            hideClose: true,
        },
    }, ],
}, ];

export default route;