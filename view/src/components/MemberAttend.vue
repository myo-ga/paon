<template>
  <v-container>
    <v-layout column justify-center>

      <v-flex align-self-end v-if="memberN != NEW_MEMBER">
        <v-btn
          @click="deleteMember"
          color="red"
          v-bind="getButtonStatus()">
          削除する
        </v-btn>
      </v-flex>
      <v-flex>
        <v-text-field
          label="氏名"
          v-model="memberName"
          v-validate="'required|max:25'" :counter="25"
          data-vv-name="memberName"
          data-vv-as="氏名"
          :error-messages="errors.first('memberName')"
        >
        </v-text-field>
      </v-flex>
      <v-flex>
        <v-text-field
          label="コメント"
          v-model="memberComment"
          v-validate="'max:25'" :counter="25"
          data-vv-name="memberComment"
          data-vv-as="コメント"
          :error-messages="errors.first('memberComment')"
        >
        </v-text-field>
      </v-flex>
      <v-flex>
        <template v-for="(dayN, index) in Object.keys(eventDays)">
          <v-layout :key="index">
            <v-flex>
                <v-layout fill-height>
                  <v-flex align-self-center>{{eventDays[dayN]}}</v-flex>
                </v-layout>
            </v-flex>
            <v-flex class="mr-2">
              <!-- v-bindで複数プロパティを動的に設定 -->
              <v-btn v-bind="getColor(dayN, 'OK')" block @click="setAttend(dayN,'OK')">参加</v-btn>
            </v-flex>
            <v-flex class="mr-2">
              <v-btn  v-bind="getColor(dayN, 'UnKnown')" block @click="setAttend(dayN,'UnKnown')">未定</v-btn>
            </v-flex>
            <v-flex >
              <v-btn v-bind="getColor(dayN, 'NG')" block @click="setAttend(dayN,'NG')">欠席</v-btn>
            </v-flex>
          </v-layout>
        </template>
      </v-flex>
      <v-flex align-self-center>
        <template v-if="memberN != NEW_MEMBER">
          <v-btn v-bind="getButtonStatus()" color="teal lighten-1" @click="updateMember">出欠を更新する</v-btn>
        </template>
        <template v-else>
          <v-btn v-bind="getButtonStatus()" color="teal lighten-1" @click="registerMember">出欠を登録する</v-btn>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>

import Vue from 'vue'
import VeeValidate from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'
import serverurl from '../const/serverurl'
import define from '../const/define'

Vue.use(VeeValidate, {
  locale: "ja",
  dictionary: {
    "ja": ja
  }
})


import CommonButton from './mixins/CommonButton'

//Axios（APIに使用）
const querystring = require('querystring');

export default {
  mixins: [CommonButton],
  data: () => ({
    memberName: "", // 登録/更新用
    memberDays: {}, // 登録/更新用
    memberComment: "", // 登録/更新用
    NEW_MEMBER: define.NEW_MEMBER
  }),
  props: {
    memberN: {
      type: String // 更新時：member0, member1, など、登録時：memberX
    }
  },
  created() {
    this.setMemberData(this.memberN);
  },
  computed: {
    // eventMembers: {
    //   get() {
    //     return this.$store.getters.eventMembers;
    //   }
    // },
    // {day0: "2020-02-01 18:00", day1: "2020-02-02 11:00" など}
    eventDays: {
      get() {
        return this.$store.getters.eventDays;
      }
    },
 
  },
  // プロパティの変更を検知して、氏名を選択したものに変更する
  watch: {
    memberN(val) {
      this.setMemberData(val);
    }
  },

  methods: {
    setMemberData(val) {
      if (val !== this.NEW_MEMBER) {
        this.memberName = this.$store.getters.eventMembers[val].memberName;
        this.memberComment = this.$store.getters.eventMembers[val].memberComment;
        // Object型なdataに対して、リアクティブ性を持たせつつ扱う場合は、$setで値の更新は行う
        for (let dayN in this.$store.getters.eventMembers[val].memberDays) {
          this.$set(this.memberDays, dayN, this.$store.getters.eventMembers[val].memberDays[dayN]);
        }
      } else {
        this.memberName = "";
        this.memberComment = "";
        for (let dayN in this.$store.getters.eventDays) {
          this.$set(this.memberDays, dayN, "None");
        }
      }
    },
    setAttend(dayN, attend) {
      this.$set(this.memberDays, dayN, attend);
    },
    getColor(dayN, attend) {
        if (this.memberDays[dayN] === attend) {
          return {
            color: "teal lighten-1",
            dark: true,
            light: false
          }
        } else {
          return {
            color: "default",
            dark: false,
            light: true
          }
        }
    },
    sendRequestMember(url, query_param) {
      let vm = this;
      this.$axios.post(
        url,
        querystring.stringify(query_param)
      )
      .then(
        response => {
          let ret = response.data;
          if (ret.ok) {
            vm.$router.go();
          } else {
            alert(ret);
          }
          vm.isLoading = false;
        }
      )
      .catch(
        error => {
          alert(error);
          vm.isLoading = false;
        }
        
      )
    },
    deleteMember() {
      this.isLoading = true;
      let url = serverurl.MEMBER_DELETE_URL;
      let query_param = Object.assign(
        {
          id: this.$store.getters.eventId,
          memberId: this.memberN,
        },
        this.memberDays
      );
      this.sendRequestMember(url, query_param);
    },
    updateMember() {
      this.isLoading = true;

      let url = serverurl.MEMBER_UPDATE_URL;
      let query_param = Object.assign(
        {
          id: this.$store.getters.eventId,
          memberId: this.memberN,
          memberName: this.memberName,
          memberComment: this.memberComment
        },
        this.memberDays
      );

      let vm = this;
      this.$validator.validate()
      .then((result) => {
        
        if (result === false) {
          alert("不適切な項目があるため、入力項目を見直してください。");
          vm.isLoading = false;
          return;
        }

        vm.sendRequestMember(url, query_param);
      });

    },
    registerMember() {
      this.isLoading = true;

      let url = serverurl.MEMBER_CREATE_URL;
      let query_param = Object.assign(
        {
          id: this.$store.getters.eventId,
          memberName: this.memberName,
          memberComment: this.memberComment
        },
        this.memberDays
      );

      let vm = this;
      this.$validator.validate()
      .then((result) => {
        
        if (result === false) {
          alert("不適切な項目があるため、入力項目を見直してください。");
          vm.isLoading = false;
          return;
        }

        vm.sendRequestMember(url, query_param);
      });
    },

  }

}
</script>


<style scoped>

</style>