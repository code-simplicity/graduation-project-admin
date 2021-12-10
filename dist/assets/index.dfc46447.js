import{T as e}from"./index.c3d311dd.js";import{q as a,d as t,L as l,k as o,x as r,_ as s,r as p,o as i,z as d,w as n,b as u,a as c,j as m,A as h,c as g,B as f,f as b}from"./index.a5d69c1c.js";import{d as w}from"./utils.3dd1a93e.js";import{U as y}from"./UploadFilled.9cb33ab5.js";const v=t({name:"Upload",components:{Layer:l,UploadFilled:y},props:{layer:{type:Object,default:()=>({show:!1,title:"",showButton:!0,width:"400px"})}},setup:()=>({uploadRef:o(null),layerDom:o(null)}),methods:{httpRequestPortMap(e,t){const l=new FormData;var o;e.forEach((e=>{l.append("image",e.raw)})),t?(l.append("id",t),(o=l,a({url:"/portmap/update",method:"post",data:o})).then((e=>{r.success(e.msg)})).catch((e=>{r.error({message:res.msg})}))):(e=>a({url:"/portmap/upload",method:"post",data:e}))(l).then((e=>{r.success({message:e.msg})})).catch((e=>{r.error({message:res.msg}),console.log("err",e)})),this.$emit("getTableData",!0),this.layerDom&&this.layerDom.close()},submit(){this.uploadRef?this.layer.row?this.httpRequestPortMap(this.uploadRef.uploadFiles,this.layer.row.id):this.httpRequestPortMap(this.uploadRef.uploadFiles):r.error({message:"请选择需要上传的港口地图."})}}}),D=c("div",{slot:"tip",class:"el-upload__text"},"请上传港口地图",-1);const _=t({name:"PortMap",components:{Table:e,Upload:s(v,[["render",function(e,a,t,l,o,r){const s=p("upload-filled"),c=p("el-icon"),m=p("el-upload"),h=p("Layer");return i(),d(h,{layer:e.layer,ref:"layerDom",onConfirm:e.submit},{default:n((()=>[u(m,{ref:"uploadRef",name:"image",action:"",drag:"","list-type":"picture",limit:"1",accept:".jpg, .png","auto-upload":!1,"http-request":e.httpRequestPortMap},{default:n((()=>[u(c,{size:"120",class:"el-icon--upload"},{default:n((()=>[u(s)])),_:1}),D])),_:1},8,["http-request"])])),_:1},8,["layer","onConfirm"])}]])},setup(){const e=o(!0),t=o([]),l=m({show:!1,title:"上传港口地图",showButton:!0,width:"400px"}),s=m({pageNum:1,pageSize:10,total:0,pages:0}),p=l=>{e.value=!0,l&&(s.pageNum=1);let o={pageNum:s.pageNum,pageSize:s.pageSize};var r;(r=o,a({url:"/portmap/find",method:"post",data:r})).then((e=>{let a=e.data.list;t.value=a,s.total=Number(e.data.total)})).catch((a=>{e.value=!1,t.value=[],s.pageNum=1,s.total=0})).finally((()=>{e.value=!1}))};return p(!0),{loading:e,tableData:t,dateFormat:w,baseURL:"http://8.131.240.89:5050/portmap/search?id=",upload:l,page:s,getTableData:p,uploadPortMap:()=>{l.title="上传港口地图",l.show=!0,l.width="400px"},handleDel:e=>{(e=>a({url:"/portmap/delete",method:"get",params:e}))({id:e.id}).then((e=>{r.success(e.msg),p(1===t.value.length)})).catch((()=>{r.error(res.msg)}))},handleEdit:e=>{l.title="修改港口地图",l.row=e,l.show=!0,l.width="400px"}}}}),x={class:"layout-container"},R={class:"layout-container-form flex space-between"},T={class:"layout-container-form-handle"},U=b("上传港口地图"),C={class:"layout-container-table"},F=b("编辑"),j=b("删除");var q=s(_,[["render",function(e,a,t,l,o,r){const s=p("el-button"),d=p("el-table-column"),m=p("el-image"),b=p("el-popconfirm"),w=p("Table"),y=p("Upload"),v=h("loading");return i(),g("div",x,[c("div",R,[c("div",T,[u(s,{type:"primary",icon:"el-icon-plus",onClick:e.uploadPortMap},{default:n((()=>[U])),_:1},8,["onClick"])])]),c("div",C,[f(u(w,{ref:"table",page:e.page,"onUpdate:page":a[0]||(a[0]=a=>e.page=a),showIndex:!0,showSelection:!0,data:e.tableData,onGetTableData:e.getTableData},{default:n((()=>[u(d,{prop:"id",label:"id",align:"center","show-overflow-tooltip":""}),u(d,{prop:"url",label:"图片路径",align:"center",width:"70"}),u(d,{prop:"path",label:"图片存储路径",align:"center"},{default:n((a=>[u(m,{class:"image-style",src:e.baseURL+a.row.id,fit:e.cover},null,8,["src","fit"])])),_:1}),u(d,{prop:"type",label:"图片类型",align:"center",width:"80"}),u(d,{prop:"name",label:"图片名称",align:"center",width:"70"}),u(d,{prop:"state",label:"状态",align:"center",width:"60"}),u(d,{prop:"create_time",label:"创建时间",formatter:e.dateFormat,align:"center"},null,8,["formatter"]),u(d,{prop:"update_time",label:"更新时间",formatter:e.dateFormat,align:"center"},null,8,["formatter"]),u(d,{label:"操作",align:"center",fixed:"right",width:"180"},{default:n((a=>[u(s,{onClick:t=>e.handleEdit(a.row)},{default:n((()=>[F])),_:2},1032,["onClick"]),u(b,{title:"删除",onConfirm:t=>e.handleDel(a.row)},{reference:n((()=>[u(s,{type:"danger"},{default:n((()=>[j])),_:1})])),_:2},1032,["onConfirm"])])),_:1})])),_:1},8,["page","data","onGetTableData"]),[[v,e.loading]])]),u(y,{layer:e.upload,"v-if":e.upload.show,onGetTableData:e.getTableData},null,8,["layer","v-if","onGetTableData"])])}],["__scopeId","data-v-17682cae"]]);export{q as default};
