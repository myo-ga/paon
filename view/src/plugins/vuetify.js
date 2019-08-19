import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/lib/util/colors'

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    themes: {
      light: {
        primary: colors.teal,
        secondary: colors.grey.darken1,
        accent: colors.purple,
        error: colors.red.accent3,
      },
      dark: {
        primary: colors.teal,
        secondary: colors.grey.darken1,
        accent: colors.purple,
        error: colors.red.accent3,
      },
    },
  },
})

