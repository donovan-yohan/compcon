<template>
  <v-card flat>
    <v-toolbar color="white" class="mt-5 pt-1" dense>
        <v-btn-toggle v-model="selectedFilters" multiple>
          <div v-for="f in filters" :key="f">
            <v-btn flat large :value="f">&emsp;{{f}}&emsp;</v-btn>
          </div>
        </v-btn-toggle>
      <v-spacer></v-spacer>
        <v-autocomplete flat dense v-model="search" :items="gearItems" clearable hide-details hide-selected item-text="name" item-value="name" label="Search..." solo />
    </v-toolbar>
    <!-- Armor -->
    <v-container fluid>
      <v-data-table :headers="itemType === 'armor' ? armor_headers : itemType === 'weapon' ? weapon_headers : gear_headers" 
        :items="gearItems" :expand="true" item-key="id" hide-actions>
        <template slot="items" slot-scope="props">
          <tr v-if="props.item.type === 'armor' && itemType !== 'webbing'" @click="props.expanded = !props.expanded">
            <td style="padding: 0!important;"><v-btn color="primary" @click="select(props.item)" class="p-0 m-0">equip</v-btn></td>
            <td><span class="subheading">{{ props.item.name }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.armor }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.edef }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.evasion }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.speed }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.source }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.rarity }}</span></td>
          </tr>
          <tr v-else-if="props.item.type === 'weapon' && itemType !== 'webbing'" @click="props.expanded = !props.expanded">
            <td style="padding: 0!important;"><v-btn color="primary" @click="select(props.item)" class="p-0 m-0">equip</v-btn></td>
            <td><span class="subheading">{{ props.item.name }}</span></td>
            <td><span class="subheading"><damage-element small :dmg="props.item.damage" /></span></td>
            <td><span class="subheading"><range-element small :range="props.item.range" /></span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.source }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.rarity }}</span></td>
          </tr>
          <tr v-else @click="props.expanded = !props.expanded">
            <td style="padding: 0!important;"><v-btn color="primary" @click="select(props.item)" class="p-0 m-0">equip</v-btn></td>
            <td><span class="subheading">{{ props.item.name }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.uses }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.source }}</span></td>
            <td class="text-xs-center"><span class="subheading">{{ props.item.rarity }}</span></td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text><gear-card :itemData="props.item" /></v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-container>
  </v-card>
</template>

<script>
  import GearCard from '../../UI/GearCard'
  import RangeElement from '../../UI/RangeElement'
  import DamageElement from '../../UI/DamageElement'

  export default {
    name: 'item-table',
    components: { GearCard, RangeElement, DamageElement },
    props: [ 'itemType' ],
    data: () => ({
      selectedIndex: -1,
      filterText: '',
      sortRule: null,
      search: null,
      searchFilter: null,
      filters: [],
      selectedFilters: [],
      armor_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Armor', align: 'center', value: 'armor'},
        {text: 'E-Defense', align: 'center', value: 'edef'},
        {text: 'Evasion', align: 'center', value: 'evasion'},
        {text: 'Speed', align: 'center', value: 'speed'},
        {text: 'Source', align: 'center', value: 'source'},
        {text: 'Rarity', align: 'center', value: 'rarity'}
      ],
      weapon_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Damage', align: 'left', value: 'damage'},
        {text: 'Range', align: 'left', value: 'range'},
        {text: 'Source', align: 'center', value: 'source'},
        {text: 'Rarity', align: 'center', value: 'rarity'}
      ],
      gear_headers: [
        {align: 'left', sortable: false, width: '5vw'},
        {text: 'Item', align: 'left', value: 'name'},
        {text: 'Uses', align: 'center', value: 'uses'},
        {text: 'Source', align: 'center', value: 'source'},
        {text: 'Rarity', align: 'center', value: 'rarity'}
      ]
    }),
    computed: {
      gearItems: function () {
        var cmp = this
        // filter by rarity
        var rarities = this.$store.getters.getRarities
        var i = cmp.$store.getters.getItemCollection('PilotGear').filter(
          x => rarities[x.source] >= x.rarity
        )

        // filter by type
        i = cmp.itemType === 'webbing'
          ? i.filter(x => x.type === 'gear' || x.type === 'weapon')
          : i.filter(x => cmp.itemType === x.type)

        // filter UI options
        i = i.filter(x => cmp.selectedFilters.includes(x.source) &&
          x.name.toLowerCase().includes(cmp.filterText.toLowerCase())
        )

        if (cmp.search) i = i.filter(x => x.name.toLowerCase().includes(cmp.search.toLowerCase()))

        // sort UI options
        if (cmp.sortRule) {
          i.sort(function (a, b) {
            var field = cmp.sortRule.field
            if (Number.isInteger(a[field])) {
              return cmp.sortRule.dir === 'asc'
                ? a[field] - b[field]
                : b[field] - a[field]
            } else {
              var fA = a[field].toLowerCase()
              var fB = b[field].toLowerCase()
              return cmp.sortRule.dir === 'asc'
                ? (fA < fB) ? -1 : (fA > fB) ? 1 : 0
                : (fA > fB) ? -1 : (fA < fB) ? 1 : 0
            }
          })
        }

        return i
      }
    },
    methods: {
      select: function (item) {
        this.$emit('select-item', item)
      }
    },
    mounted () {
      this.filters = this.$store.getters.getItemCollection('Manufacturers').map(x => x.id)
      this.selectedFilters = JSON.parse(JSON.stringify(this.filters))
    }
  }
</script>