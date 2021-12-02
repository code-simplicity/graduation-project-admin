import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";
const route = [
  {
    path: "/video",
    component: Layout,
    redirect: "/video/video-setting",
    meta: {
      title: "视频管理",
      icon: "el-icon-video-camera",
    },
    children: [
      {
        path: "video-setting",
        component: createNameComponent(() =>
          import("@/views/main/video-manage/video-setting/index.vue")
        ),
        meta: {
          title: "视频设置",
          icon: "el-icon-video-camera",
          hideClose: true,
        },
      },
    ],
  },
];

export default route;
