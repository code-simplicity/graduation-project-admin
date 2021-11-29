import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";
// const User = () => import("@/views/main/user/index.vue");
const route = [
  {
    path: "/user",
    component: Layout,
    redirect: "/user",
    meta: {
      title: "用户管理",
      icon: "el-icon-menu",
    },
    children: [
      {
        path: "user",
        component: createNameComponent(() =>
          import("@/views/main/user/index.vue")
        ),
        meta: {
          title: "用户管理",
          icon: "el-icon-menu",
          hideClose: true,
        },
      },
    ],
  },
];

export default route;
