import Layout from "@/layout/index.vue";
import {
  createNameComponent
} from "../createNode";

const route = [{
  path: "/content",
  component: Layout,
  redirect: "/content/content-setting",
  meta: {
    title: "内容管理",
    icon: "el-icon-document-copy",
  },
  alwayShow: true,
  children: [{
      path: "content-setting",
      component: createNameComponent(() =>
        import("@/views/main/content-manage/content-setting/index.vue")
      ),
      meta: {
        title: "内容设置",
        cache: false,
      },
    },
    {
      path: "choose-setting",
      component: createNameComponent(() =>
        import("@/views/main/content-manage/choose-setting/index.vue")
      ),
      meta: {
        title: "选择设置",
        cache: false,
      },
    },
    {
      path: "point-setting",
      component: createNameComponent(() =>
        import("@/views/main/content-manage/point-setting/index.vue")
      ),
      meta: {
        title: "点位设置",
        cache: false,
      },
    },
    {
      path: "wave-data-setting",
      component: createNameComponent(() =>
        import("@/views/main/content-manage/wave-data-setting/index.vue")
      ),
      meta: {
        title: "港口点位数据excel管理",
        cache: false,
      },
    },
  ],
}, ];

export default route;