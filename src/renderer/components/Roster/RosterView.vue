<template>
  <v-container fluid>
    <v-layout>
      <v-flex>pilot roster</v-flex>
    </v-layout>
    <v-container grid-list-xl>
      <v-layout row wrap>
      <v-flex v-for="p in pilots" :key="p.id" xs3>
        <v-card>
        {{p.name}}
      </v-card>
      </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'pilot-roster',
  computed: {
    pilots: function () {
      return this.$store.getters.getAllPilots
    }
  }
}
</script>

