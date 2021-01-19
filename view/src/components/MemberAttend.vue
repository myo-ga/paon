<template>
  <v-container>
    <v-layout column justify-center>
      <v-flex align-self-end>
        <v-btn @click="deleteMember" dark color="red">削除する</v-btn>
      </v-flex>
      <v-flex>
        <v-text-field
          label="氏名"
          v-model="memberName"
          v-validate="'required|max:25'" :counter="25"
          data-vv-name="memberName"
          data-vv-as="氏名"
        >
        </v-text-field>
      </v-flex>
      <v-flex>
        <v-text-field
          label="コメント"
          v-model="memberComment"
          v-validate="'required|max:25'" :counter="25"
          data-vv-name="memberComment"
          data-vv-as="コメント"
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
        <template v-if="memberN != 'memberX'">
          <v-btn @click="updateMember">出欠を更新する</v-btn>
        </template>
        <template v-else>
          <v-btn @click="registerMember">出欠を登録する</v-btn>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>

//Axios（APIに使用）
const querystring = require('querystring');

export default {
  data: () => ({
    memberName: "", // 登録/更新用
    memberDays: {}, // 登録/更新用
    memberComment: "" // 登録/更新用、TODO:実装を盛り込むこと
  }),
  props: {
    memberN: {
      type: String // 更新時：member0, member1, など、登録時：memberX
    }
  },
  created() {
    // TODO: memberXを定数かする。MmeberTableにも使っているので、定義は別ファイルにしたほうがよい
    // 更新時
    if (this.memberN !== 'memberX') {
      this.memberName = this.$store.getters.eventMembers[this.memberN].memberName;
      this.memberComment = this.$store.getters.eventMembers[this.memberN].memberComment;
      for (let dayN in this.$store.getters.eventMembers[this.memberN].memberDays) {
        this.$set(this.memberDays, dayN, this.$store.getters.eventMembers[this.memberN].memberDays[dayN]);
      }
    } else {
      // 登録時
      this.memberName = "";
      this.memberComment = "";
      for (let dayN in this.$store.getters.eventDays) {
        this.$set(this.memberDays, dayN, "None");
      }
    }

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
      if (val !== 'memberX') {
        // TODO: createdの部分と重複なので関数かすること
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
    }
  },

  methods: {
    setAttend(dayN, attend) {
      this.$set(this.memberDays, dayN, attend);
    },
   // TODO: ボタンクリックで色を切り替える方法。→解決済
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
            // TODO: 同じパスだとrouter経由だと画面の再描画が行われない→解決：goで現在ページを再リロード
            vm.$router.go();
          } else {
            alert(ret);
          }
        }
      )
      .catch(
        error => {
          alert(error);
        }
      )
    },
    deleteMember() {
      let url = 'http://nikujaga.mybluemix.net/member/delete';
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
      let url = 'http://nikujaga.mybluemix.net/member/update';
      let query_param = Object.assign(
        {
          id: this.$store.getters.eventId,
          memberId: this.memberN,
          memberName: this.memberName,
          memberComment: this.memberComment
        },
        this.memberDays
      );
      this.sendRequestMember(url, query_param);
    },
    // TODO: updateと処理を共通化する→済
    registerMember() {
      let url = 'http://nikujaga.mybluemix.net/member/create';
      let query_param = Object.assign(
        {
          id: this.$store.getters.eventId,
          memberName: this.memberName,
          memberComment: this.memberComment
        },
        this.memberDays
      );
      this.sendRequestMember(url, query_param);
      // let vm = this;
      // this.$axios.post(
      //   'http://nikujaga.mybluemix.net/member/create',
      //   querystring.stringify(
      //     Object.assign(
      //       {
      //         id: this.$store.getters.eventId,
      //         memberName: this.memberName,
      //         memberComment: this.memberComment
      //       },
      //       this.memberDays
      //     )
      //   )
      // )
      // .then(
      //   response => {
      //     let ret = response.data;
      //     if (ret.ok) {
      //       // TODO: 同じパスだとrouter経由だと画面の再描画が行われない→解決：goで現在ページを再リロード
      //       vm.$router.go();
      //     } else {
      //       alert(ret);
      //     }
      //   }
      // )
      // .catch(
      //   error => {
      //     alert(error);
      //   }
      // )
    }
  }

}
</script>


<style scoped>

</style>