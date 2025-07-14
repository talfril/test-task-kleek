declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}
