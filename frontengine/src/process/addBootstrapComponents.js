import {
  BAlert,
  BAspect,
  BAvatar, BAvatarGroup,
  BBadge,
  BBreadcrumb, BBreadcrumbItem, BBreadcrumbLink,
  BButtonGroup,
  BButtonToolbar,
  BBtn,
  BButton,
  BCalendar,
  BButtonClose,
  BCard,
  BCardHeader,
  BCardBody,
  BCardTitle,
  BCardSubTitle,
  BCardFooter,
  BCardImg,
  BCardImgLazy,
  BCardText,
  BCardGroup
} from 'bootstrap-vue'
let importBootstrap = {}
function bootstrapImports () {
  importBootstrap = {
    BAlert,
    BAspect,
    BAvatar,
    BAvatarGroup,
    BBadge,
    BBreadcrumb,
    BBreadcrumbItem,
    BBreadcrumbLink,
    BButtonGroup,
    BBtnGroup: BButtonGroup,
    BButtonToolbar,
    BBtnToolbar: BButtonToolbar,
    BButton,
    BBtn: BButton,
    BButtonClose,
    BBtnClose: BButtonClose,
    BCalendar,
    BCard,
    BCardHeader,
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    BCardFooter,
    BCardImg,
    BCardImgLazy,
    BCardText,
    BCardGroup
  }
}

export { importBootstrap, bootstrapImports }
