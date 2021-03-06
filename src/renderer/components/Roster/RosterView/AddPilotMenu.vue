<template>
  <v-dialog v-model="dialogModel" width="500" >
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title >
        Add New Pilot
      </v-card-title>

      <v-card-text class="text-xs-center">
        <v-btn block large color="primary" @click="goToNew">Create New Pilot</v-btn>
        <v-divider />
        <v-btn block flat color="primary" @click="importFile">Import from File</v-btn>

        <v-layout>
          <v-flex>
            <v-btn block flat color="primary" @click="importSheet">Import from GSheet</v-btn>
          </v-flex>
          <v-flex shrink>
            <v-dialog width="600" v-model="gsheetDialog">
            <v-btn slot="activator" icon small right absolute style="right: 150px;"><v-icon color="grey" small>help</v-icon></v-btn>
            <v-card>
              <v-card-title class="title">
                LANCER Google Sheet to COMP/CON converter
              </v-card-title>
              <v-card-text>
                This tool imports LANCER characters from the <a @click="open('https://docs.google.com/spreadsheets/d/1Tz8rbkOq9nyuIJ6bA0636dtLeN68Z5Q0yJF8cjycXxQ/edit#gid=0')">LANCER Discord's Google Character Sheet</a> into COMP/CON.<br><br>
                The Google Sheet character must be downloaded as a Microsoft Excel (.xlsx) file.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn flat @click="gsheetDialog = false" color="primary">Close</v-btn>
              </v-card-actions>
            </v-card>
            </v-dialog>

            <v-dialog width="500" v-model="ignoredModsDialog">
              <v-card>
                <v-card-title class="title">
                  Importer Warning
                </v-card-title>
                <v-card-text>
                  The importer detected the following weapon mods: <br>
                  <strong v-html="ignoredModsString" />. 
                  <br>These could not be automatically assigned to their associated weapons and will have to be manually re-added.
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn flat @click="ignoredModsDialog = false" color="primary">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
        </v-layout>

        <v-btn block flat color="primary" @click="importClipboard">Import from Clipboard</v-btn>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" flat @click="close" >Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue'
  import io from '@/store/data_io'
  import validator from '@/logic/validator'
  import { loadSheetFile, gsheetToObject } from '@/logic/gsheet-converter'

  export default Vue.extend({
    name: 'add-pilot-menu',
    props: ['dialogModel'],
    data: () => ({
      gsheetDialog: false,
      ignoredModsDialog: false,
      ignoredModsString: ''
    }),
    methods: {
      close () {
        this.$emit('close')
      },
      goToNew () {
        this.$router.push('/new')
      },
      importFile () {
        var vm = this as any
        const { dialog } = require('electron').remote
        var path = dialog.showOpenDialog({
          title: 'Load Pilot Data',
          buttonLabel: 'Load',
          properties: [
            'openFile'
          ],
          filters: [
            { name: 'Pilot Data', extensions: ['json'] }
          ]
        })
        var pilotData = io.importFile(path[0])
        if (validator.pilot(pilotData)) {
          vm.$store.dispatch('importPilot', pilotData)
          vm.$store.dispatch('loadPilot', pilotData.id)
          vm.activeIndex = vm.pilots.length - 1
          vm.addDialog = false
          vm.close()
        } else {
          alert('Pilot data validation failed')
          vm.addDialog = false
        }
      },
      importSheet () {
        var vm = this as any
        const { dialog } = require('electron').remote
        var path = dialog.showOpenDialog({
          title: 'Load Character GSheet',
          buttonLabel: 'Load',
          properties: [
            'openFile'
          ],
          filters: [
            { name: 'Pilot Data', extensions: ['xlsx'] }
          ]
        })
        const { output, ignoredMods } = gsheetToObject(loadSheetFile(path[0]))
        if (validator.pilot(output)) {
          vm.$store.dispatch('importPilot', output)
          vm.$store.dispatch('loadPilot', output.id)
          vm.activeIndex = vm.pilots.length - 1
          vm.addDialog = false
        } else {
          alert('Pilot data validation failed')
          vm.addDialog = false
          vm.close()
        }
        if (ignoredMods.length) {
          vm.ignoredModsString = ignoredMods.join(', ')
          vm.ignoredModsDialog = true
        }
      },
      importClipboard () {
        var vm = this as any
        const {clipboard} = require('electron')
        validator.clipboardPilot(clipboard.readText(), function (err, result) {
          if (err) {
            alert(err)
          } else {
            vm.$store.dispatch('importPilot', result)
            vm.$store.dispatch('loadPilot', result.id)
            vm.activeIndex = vm.pilots.length - 1
          }
        })
        vm.addDialog = false
        vm.close()
      }
    }
  })
</script>
