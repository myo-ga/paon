<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
        >
          <template v-slot:headers="hprops">
            <tr>
              <!-- v-forとv-ifは混在できないため、固定値として外だし -->
              <th
              :key="0"
              align="left"
              v-if="hprops.headers.length > 0"
              >
                日程
              </th>
              <!-- headers=[{text=田中},{text=鈴木},{text=山田}] -->
              <th v-for="(hprop, index) in hprops.headers.slice(1)"
              :key="index+1"
              :align="hprop.align"
              >
                <a @click="selectedMember(memberIndexes[index])">{{hprop.text}}</a>
              </th>
            </tr>
          </template>
        
          <template v-slot:items="props">
            <tr>
              <td :key="0">{{ props.item.datetime }}</td>
              <template v-for="(memberIndex, index) in memberIndexes">
                <td class="text-xs-left" :key="index+1">{{ textAttend(props.item[memberIndex]) }}</td>    
              </template>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex align-self-center>
        <v-btn color="teal lighten-1" dark @click="selectedMember(NEW_MEMBER)">参加の入力をする</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import define from '../const/define'

export default {
  data: () => ({
    NEW_MEMBER: define.NEW_MEMBER
  }),
  computed: {
    headers: {
      get() {
        let ret = [];
        for (let member in this.$store.getters.eventMembers) {
          ret.push({
            text: this.$store.getters.eventMembers[member].memberName,
            align: "left",
            sortable: false
          });
        }
        // メンバー(列)または、日付(行)がある場合は、ヘッダとして日付追加
        if (Object.keys(this.$store.getters.eventDays).length > 0 || ret.length > 0) {
          ret.unshift({
            text: "日程",
            align: "left",
            sortable: false
          });
        }
        return ret;
      }
    },
    items: {
      get() {
        let ret = [];
        for (let dayN in this.$store.getters.eventDays) {
          let datetime = this.$store.getters.eventDays[dayN];
          let row = {
            datetime: datetime
          }
          for (let memberN in this.$store.getters.eventMembers) {
            let eventMember = this.$store.getters.eventMembers[memberN];
            let attendance = eventMember.memberDays[dayN];
            row[memberN] = attendance;
          }
          ret.push(row);
        }
        let memberComment_row = {
          datetime: 'コメント' // 列0はdatetimeをキーに表示するため
        };
        for (let memberN in this.$store.getters.eventMembers) {
          let eventMember = this.$store.getters.eventMembers[memberN];
          memberComment_row[memberN] = eventMember.memberComment;
        }
        ret.push(memberComment_row);
        return ret;
      }
    },
    memberIndexes: {
      get() {
        let ret = [];
        for (let memberN in this.$store.getters.eventMembers) {
          ret.push(memberN);
        }
        return ret;
      }
    }
  },

  methods: {
    selectedMember(memberN) {
      this.$emit("selected-member", memberN)
    },
    textAttend(attend) {
      let ret = '';
      switch (attend) {
        case 'OK':
          ret = '参加';
          break;
        case 'NG':
          ret = '欠席';
          break;
        case 'UnKnown':
          ret = '未定'
          break;
        case 'None':
          ret = ' ';
          break;
        default:
          // 2020-01-01 18:00など日付が入る
          ret = attend;
      }
      return ret;
    }
  }
}
</script>