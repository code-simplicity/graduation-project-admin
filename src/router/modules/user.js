import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";
const route = [
  {
    path: "/",
    component: Layout,
    redirect: "/user",
    meta: {
      title: "用户",
      icon: "el-icon-user",
    },
    children: [
      {
        path: "user",
        component: createNameComponent(() =>
          import("@/views/main/user/index.vue")
        ),
        meta: {
          title: "用户管理",
          icon: "el-icon-user",
          hideClose: true,
        },
      },
    ],
  },
];

export default route;
