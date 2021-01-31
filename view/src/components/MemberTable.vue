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
              <!-- <td class="text-xs-left">{{ props.item.member0 }}</td>
              <td class="text-xs-left">{{ props.item.member1 }}</td>
              <td class="text-xs-left">{{ props.item.member2 }}</td> -->
              <!-- <td class="justify-center layout px-0">
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(props.item)"
                >
                  edit
                </v-icon>
                <v-icon
                  small
                  @click="deleteItem(props.item)"
                >
                  delete
                </v-icon>
              </td> -->
            </tr>
          </template>
          <!-- <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template> -->
        </v-data-table>
      </v-flex>
      <v-flex align-self-center>
        <v-btn color="teal lighten-1" dark @click="selectedMember('memberX')">参加の入力をする</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      // headers: [
      //   {
      //     text: '日程',
      //     align: 'left',
      //     sortable: false,
      //     value: 'name'
      //   },
      //   { text: '田中', value: 'tanaka' },
      //   { text: '山田', value: 'yamada' }
      // ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      }
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
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
      // TODO: [Vuetify] Headers must have a value property that corresponds to a value in the v-model arrayのエラーを消す
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
    
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    created () {
      this.initialize()
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
      },
      initialize () {
        this.desserts = [
          // {
          //   name: 'Frozen Yogurt',
          //   calories: 159,
          //   fat: 6.0,
          //   carbs: 24,
          //   protein: 4.0
          // },
          // {
          //   name: 'Ice cream sandwich',
          //   calories: 237,
          //   fat: 9.0,
          //   carbs: 37,
          //   protein: 4.3
          // },
          // {
          //   name: 'Eclair',
          //   calories: 262,
          //   fat: 16.0,
          //   carbs: 23,
          //   protein: 6.0
          // },
          // {
          //   name: 'Cupcake',
          //   calories: 305,
          //   fat: 3.7,
          //   carbs: 67,
          //   protein: 4.3
          // },
          // {
          //   name: 'Gingerbread',
          //   calories: 356,
          //   fat: 16.0,
          //   carbs: 49,
          //   protein: 3.9
          // },
          // {
          //   name: 'Jelly bean',
          //   calories: 375,
          //   fat: 0.0,
          //   carbs: 94,
          //   protein: 0.0
          // },
          // {
          //   name: 'Lollipop',
          //   calories: 392,
          //   fat: 0.2,
          //   carbs: 98,
          //   protein: 0
          // },
          // {
          //   name: 'Honeycomb',
          //   calories: 408,
          //   fat: 3.2,
          //   carbs: 87,
          //   protein: 6.5
          // },
          // {
          //   name: 'Donut',
          //   calories: 452,
          //   fat: 25.0,
          //   carbs: 51,
          //   protein: 4.9
          // },
          // {
          //   name: 'KitKat',
          //   calories: 518,
          //   fat: 26.0,
          //   carbs: 65,
          //   protein: 7
          // }
        ]
      },
      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>