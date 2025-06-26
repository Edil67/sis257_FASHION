declare module 'jquery' {
  import * as $ from 'jquery';
  export = $;
}

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}
