<template>
  <div class="roster-content">
    <div v-if="pilot.name">
      <v-container fluid>
        <!-- Pilot Info Block -->
        <v-layout>
          <v-flex xs10>
            <v-layout align-end>
              <!-- Callsign -->
              <v-flex shrink>
                <editable-label attr="callsign" description="Callsign" :placeholder="pilot.callsign">
                  <span slot="label" class="callsign-text">{{pilot.callsign}}</span>
                </editable-label>
              </v-flex>
              <!-- Name -->
              <v-flex>
               <editable-label attr="name" description="Name" :placeholder="pilot.name">
                  <span slot="label" class="blockquote ml-1 pl-0">{{pilot.name}}&nbsp;</span>
                </editable-label>           
              </v-flex>
            </v-layout>
            <v-divider class="ma-2"/>
            <!-- Pilot Statblock -->
            <v-layout>
              <pip-bar small :model="stats.hp" :items="[stats.hp, stats.armor]" :caption="`HP ${stats.hp} // ARMOR ${stats.armor}`" />
              <pip-bar small :model="stats.edef" :items="[stats.edef]" :caption="`E-DEFENSE ${stats.edef}`" />
              <pip-bar small :model="stats.evasion" :items="[stats.evasion]" :caption="`EVASION ${stats.evasion}`" />
              <pip-bar small :model="stats.speed" :items="[stats.speed]" :caption="`SPEED ${stats.speed}`" />
            </v-layout>
          </v-flex>
          <!-- License Level -->
          <v-flex shrink>
            <span class="caption float-right">LICENSE LEVEL</span><br>
          </v-flex>
            <span class="xl-text">{{pilot.level}}</span>
          <v-flex shrink>
            <!-- Level Up Button -->
            <v-tooltip bottom nudge-right="15px">
              <v-btn :to="'/level'" slot="activator" bottom right fab small :disabled="pilot.level > 11" color="primary" style="float:right; margin-left:30px">
                <v-icon large>arrow_upward</v-icon>
              </v-btn>
              <span>Level Up</span>
            </v-tooltip>
            <!-- Level Selector -->
            <lazy-dialog :model="levelEditor" title="Set Pilot Level" acceptString="Set Pilot Level" hide-confirm
              @activate="levelEditor = true" @cancel="levelEditor = false">
                <v-tooltip slot="activator" bottom nudge-right="15px">
                  <v-btn slot="activator" @click="levelEditor = true" outline relative icon small color="grey" style="left: 10px; bottom: 20px">
                    <v-icon small>build</v-icon>
                  </v-btn>
                  <span>Set Pilot Level</span>
                </v-tooltip>
                <template v-slot:modal-content>
                  <level-selector @changed="levelEditor = false; notify(`Pilot Level set to ${$event}`)" />
                </template>
            </lazy-dialog>
          </v-flex>
        </v-layout>
        <!-- End Pilot Info Block -->

        <!-- Pilot Alerts -->
        <v-layout>
          <v-flex>
            <v-alert :value="!pilot.configs.length" color="info" icon="info" outline class="ma-2 ml-5 mr-5">
            <b>No Associated Mech</b><br>
            This pilot does not have any mech Configurations associated with their profile. A new Configuration can be added by navigating to the <b>MECH HANGAR</b> from the menu bar
            </v-alert>
          </v-flex>
        </v-layout>

        <!-- Bio/Apparance Block -->
        <v-layout>
          <v-flex xs8>
            <v-layout>
              <v-flex>
                <!-- Biograpgy -->
                <v-layout><span class="header no-icon">Biography</span></v-layout>
                <v-layout>
                  <v-flex xs12 class="text-xs-center">
                    <b v-if="pilot.custom_background" class="minor-title"> {{ pilot.custom_background }} </b>
                    <div v-else style="display: inline">
                      <span v-if="getBackground(pilot.background).err" class="grey--text">
                        // MISSING BACKGROUND DATA //
                      </span>
                      <b v-else  class="minor-title"> {{ getBackground(pilot.background).name }} </b>
                    </div>
                    <pilot-edit-modal title="Select Pilot Background" ref="backgroundSelector">
                      <background-selector slot="modal-content" @selected="backgroundSelect" :preSelected="pilot.background"/>
                    </pilot-edit-modal>
                  </v-flex>
                </v-layout>
                <!-- Invocations -->
                <span class="ml-3 caption grey--text">INVOCATIONS</span>
                <v-layout wrap class="ml-3 mr-3">
                  <v-flex shrink v-for="(invoke, index) in pilot.invocations" :key="invoke.trigger">
                    <invocation-item :invoke="invoke" :index="index" @remove-invoke="removeInvocation"/>
                  </v-flex>
                  <v-flex>
                    <lazy-dialog :model="invokeDialog" title="Add Background Invocation" acceptString="Add New Invocation"
                      @activate="invokeDialog = true" @cancel="invokeDialog = false" @accept="addInvocation"
                      :disable-condition="invoke_trigger === '' || (!invoke_attribute && invoke_attribute !== 0)">
                      <template v-slot:activator>
                          <v-tooltip top :disabled="pilot.invocations && pilot.invocations.length >= 4">
                            <v-btn slot="activator" @click="invokeDialog = true" flat small icon color="primary" 
                              :disabled="pilot.invocations && pilot.invocations.length >= 4">
                              <v-icon>add_circle</v-icon>
                            </v-btn>
                            <span>Add New Invocation</span>
                          </v-tooltip>
                        </template>
                        <template v-slot:modal-content>
                            <v-card-text>
                              <v-text-field v-model="invoke_trigger" label="Invocation Trigger" outline />
                              <v-flex class="text-xs-center">
                              <v-btn-toggle v-model="invoke_attribute" dark>
                                <v-btn large color="primary">
                                  <v-icon>mdi-transfer-up</v-icon>&emsp;<span>Accuracy</span>
                                </v-btn>
                                <v-btn large color="error">
                                  <v-icon>mdi-transfer-down</v-icon>&emsp;<span>Difficulty</span>
                                </v-btn>
                              </v-btn-toggle>
                              </v-flex>
                            </v-card-text>
                        </template>
                    </lazy-dialog>
                  </v-flex>
                </v-layout>
                <!-- Clone Quirk -->
                <v-layout v-if="pilot.quirk">
                  <v-flex class="text-xs-center">
                    <v-alert :value="true" color="amber darken-4" class="ma-2">
                      <b class="minor-title">Clone Quirk</b>
                      <editable-label :description="'Clone Quirk'" :attr="'quirk'" :placeholder="pilot.quirk" >
                        <span slot="label" class="p fluff-text">{{pilot.quirk}}&emsp;</span>
                      </editable-label>
                    </v-alert>
                  </v-flex>
                </v-layout>
                <!-- Pilot History -->
                <editable-textfield :description="'History'" :attr="'history'" :initial="pilot.history" :key="pilot.id"/>
              </v-flex>
            </v-layout>
            <v-layout>
              <!-- Contacts -->
              <v-flex>
                <v-layout><span class="header no-icon">Contacts</span></v-layout>
                <contacts-list :contacts="pilot.contacts" @add-contact="refresh" :key="pilot.contacts.length" />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4>
            <!-- Appearance -->
            <v-layout>
              <span class="header">Appearance
                <pilot-edit-modal title="Set Pilot Portrait" :modelRef="appearanceModal" ref="appearanceSelector">
                  <image-selector slot="modal-content" :preselectPortrait="pilot.portrait" @assign-portrait="setPortrait" />
                </pilot-edit-modal>
              </span>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2" @click="appearanceModal = true">
                <div v-if="pilot.portrait">
                  <v-img :src="`file://${userDataPath}/img/portrait/${pilot.portrait}`" max-height="55vh" max-width="45.1vw" contain/>
                </div>
                <div v-else>
                  <v-btn block small flat color="primary lighten-1"><v-icon small>add</v-icon>&nbsp;Add Pilot Image</v-btn>
                </div>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2">
                <editable-textfield :description="'Description'" :attr="'text_appearance'" :initial="pilot.text_appearance" :key="pilot.id" />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <!-- End Bio/Apparance Block -->

        <!-- Skills Block -->
        <v-layout>
          <v-flex xs1>
            <!-- Grit -->
            <v-layout><span class="header no-icon">Grit</span></v-layout>
            <v-layout align-center justify-center column fill-height>
              <v-flex><span class="display-3 font-weight-black text-xs-center">+{{stats.grit}}</span></v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs11>
            <!-- Triggers -->
            <v-layout>
              <span class="header">
                Skill Triggers
                <pilot-edit-modal title="Edit Pilot Skill Triggers" :modelRef="skillModal" ref="skillSelector">
                  <skill-selector slot="modal-content" :pilotSkills="pilot.skills" :pilotLevel="pilot.level" @set-skills="setPilotSkills" />
                </pilot-edit-modal>
              </span>
            </v-layout>
            <v-layout>
              <v-flex class="mr-3">
                <skill-item v-for="skill in pilot.skills" :key="skill.id" :skillData="getSkill( skill.id)" :skill="skill" />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- License Block -->
        <v-layout>
          <span class="header">Licenses
            <pilot-edit-modal title="Edit Pilot Licenses" :modelRef="licenseModal" ref="licenseSelector">
              <license-selector slot="modal-content" :pilotLicenses="pilot.licenses" :pilotLevel="pilot.level" @set-licenses="setLicenses" />
            </pilot-edit-modal>
          </span>
        </v-layout>
        <v-layout class="ml-3 mr-3">
          <v-flex>
            <v-expansion-panel focusable>
              <license-item v-for="(license, index) in pilot.licenses" :key="index" :pilotRank="license.level" :licenseData="getLicense(license.name)" />
            </v-expansion-panel>
          </v-flex>
        </v-layout>
        <!-- Talent Block -->
        <v-layout>
          <span class="header">Talents
            <pilot-edit-modal title="Edit Pilot Talents" :modelRef="talentModal" ref="talentSelector">
              <talent-selector slot="modal-content" :pilotTalents="pilot.talents" :pilotLevel="pilot.level" @set-talents="setPilotTalents" />
            </pilot-edit-modal>
          </span>
        </v-layout>
        <v-layout class="ml-3 mr-3">
          <v-flex>
            <v-expansion-panel focusable>
              <talent-item v-for="talent in pilot.talents" :key="talent.id" :talent="talent" :talentData="getTalent(talent.id)"/>
            </v-expansion-panel>
          </v-flex>
        </v-layout>

        <!-- Mech Skills Block -->
        <v-layout>
          <span class="header">Mech Skills
            <pilot-edit-modal title="Edit Mech Skills" :modelRef="mechSkillModal" ref="mechSkillSelector">
              <mech-skills-selector slot="modal-content" :mechSkills="pilot.mechSkills" :pilotLevel="pilot.level" 
                :isActivePilot="true" @close="setMechSkills" />
            </pilot-edit-modal>
          </span>
        </v-layout>
        <v-layout center justify-space-around class="pl-5">
          <hase-pips title="hull" attribute="hull" />
          <hase-pips title="agility" attribute="agi" />
          <hase-pips title="systems" attribute="sys" />
          <hase-pips title="engineering" attribute="eng" />
        </v-layout>

        <!-- CORE Bonuses -->
        <v-layout>
          <span class="header">CORE Bonuses
            <pilot-edit-modal title="Edit CORE Bonuses" :modelRef="bonusModal" ref="bonusSelector">
              <core-bonus-selector slot="modal-content" :pilotBonuses="pilot.core_bonuses" :pilotLevel="pilot.level" :pilotLicenses="pilot.licenses" @set-bonuses="setPilotBonuses" />
            </pilot-edit-modal>
          </span>
        </v-layout>
        <v-layout row v-for="cb in pilot.core_bonuses" :key="cb" class="ml-5 mr-5">
          <core-bonus-item :cb="getCoreBonus(cb)" />
        </v-layout>

        <!-- Pilot Loadout -->
        <v-layout><span class="header no-icon">Pilot Gear</span></v-layout>
        <v-layout><v-flex xs12><pilot-loadout /></v-flex></v-layout>

        <!-- Pilot Notes -->
        <v-layout><span class="header no-icon">Notes</span></v-layout>
        <v-layout>
          <v-flex>
            <editable-textfield :description="'Pilot Notes'" :attr="'notes'" :initial="pilot.notes" :key="pilot.id" />
          </v-flex>
        </v-layout>
      </v-container>
      
      <v-divider />

      <!-- Print Block -->
      <v-layout class="ma-5">
        <v-flex>
          <v-btn color="primary" large outline block @click="openPrintOptions"><v-icon>print</v-icon>&emsp; PRINT PILOT SHEET</v-btn>
        </v-flex>
      </v-layout>

      <v-snackbar v-model="snackbar" :timeout="5000" >
        <span v-html="notification" />
        <v-btn color="pink" flat @click="snackbar = false" > Close </v-btn>
      </v-snackbar>
    </div>

    <!-- Missing/No Pilot Display -->
    <empty-view v-else>
      <p slot="contents" class="grey--text text-xs-center display-2">NO PILOT LOADED</p>
    </empty-view>

  </div>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import io from '@/store/data_io'
  import Stats from '@/logic/stats'
  import { LazyDialog, EditableLabel, EditableTextfield, PipBar, EmptyView } from '@/components/UI'
  import { ImageSelector, BackgroundSelector, SkillSelector, TalentSelector, LicenseSelector, MechSkillsSelector, CoreBonusSelector, LevelSelector } from './Selectors'
  import { ContactsList, LicenseItem, SkillItem, TalentItem, CoreBonusItem, InvocationItem, PilotEditModal, HasePips } from './SheetComponents'
  import PilotLoadout from './LoadoutEditor/PilotLoadout.vue'
  import NewConfig from '../HangarView/AddConfigMenu.vue'

  export default Vue.extend({
    name: 'pilot-sheet',
    components: { EditableLabel, EditableTextfield, LicenseItem, SkillItem, TalentItem, 
    PilotLoadout, CoreBonusItem, ImageSelector, ContactsList, BackgroundSelector, SkillSelector, 
    TalentSelector, LicenseSelector, MechSkillsSelector, CoreBonusSelector, InvocationItem, NewConfig, 
    LazyDialog, PilotEditModal, LevelSelector, PipBar, HasePips, EmptyView
    },
    data: () => ({
      callsignDialog: false,
      newCallsign: '',
      renameDialog: false,
      newName: '',
      invoke_trigger: '',
      invoke_attribute: 0,
      newConfigModal: false,
      backgroundModal: false,
      appearanceModal: false,
      skillModal: false,
      licenseModal: false,
      talentModal: false,
      mechSkillModal: false,
      bonusModal: false,
      pilotGearModal: false,
      invokeDialog: false,
      levelEditor: false,
      snackbar: false,
      notification: '',
      activeLoadoutIdx: 0,
      loadoutForceReloadTrigger: 0
    }),
    methods: {
      refresh: function () {
        this.$forceUpdate()
      },
      notify: function (contents: string) {
        this.notification = contents
        this.snackbar = true
      },
      getLicense: function (name: string) {
        return this.$store.getters.getLicenseByName(name.toUpperCase())
      },
      backgroundSelect: function (bgReturn: any) {
        (this.$refs['backgroundSelector'] as any).cancel()
        // Remove custom bg if we're changing to a regular one (custom overrides)
        if (bgReturn.field !== 'custom_background') {
          this.$store.dispatch('editPilot', {
            attr: 'custom_background',
            val: ''
          })
        }
        this.$store.dispatch('editPilot', {
          attr: bgReturn.field,
          val: bgReturn.value
        })
      },
      setPilotSkills: function (skillArray: any) {
        (this.$refs['skillSelector'] as any).cancel()
        this.skillModal = false
        this.$store.dispatch('editPilot', {
          attr: `skills`,
          val: skillArray
        })
      },
      setPilotTalents: function (talentArray: any) {
        (this.$refs['talentSelector'] as any).cancel()
        this.talentModal = false
        this.$store.dispatch('editPilot', {
          attr: `talents`,
          val: talentArray
        })
      },
      setPilotBonuses: function (bonusArray: any) {
        (this.$refs['bonusSelector'] as any).cancel()
        this.bonusModal = false
        this.$store.dispatch('editPilot', {
          attr: `core_bonuses`,
          val: bonusArray
        })
      },
      setLicenses: function (licenseArray: any) {
        (this.$refs['licenseSelector'] as any).cancel()      
        this.licenseModal = false
        this.$store.dispatch('editPilot', {
          attr: `licenses`,
          val: licenseArray
        })
      },
      setMechSkills: function () {
        (this.$refs['mechSkillSelector'] as any).cancel()  
      },
      setPortrait: function (src: string) {
        (this.$refs['appearanceSelector'] as any).cancel()
        this.$store.dispatch('editPilot', {
          attr: `portrait`,
          val: src
        })
        this.appearanceModal = false
        this.notification = 'Pilot Portrait Saved'
        this.snackbar = true
      },
      addInvocation: function () {
        var vm = this
        var newInvoke: PilotInvocation = {
          trigger: vm.invoke_trigger,
          accuracy: vm.invoke_attribute === 0,
          difficulty: vm.invoke_attribute !== 0,
        }
        var idx = this.pilot.invocations ? this.pilot.invocations.length : 0
        this.$store.dispatch('editPilot', {
          attr: `invocations[${idx}]`,
          val: newInvoke
        })
        this.invokeDialog = false
        this.invoke_trigger = ''
      },
      removeInvocation: function (index: number) {
        this.$store.dispatch('splicePilot', {
          attr: 'invocations',
          start_index: index,
          delete_count: 1
        })
        this.refresh()
      },
      openPrintOptions: function () {
        this.$store.dispatch('setPrintOptions', {loadout_index: this.activeLoadoutIdx})
        this.$router.push('/print-pilot')
      }
    },
    computed: {
      pilot (): Pilot {
        return this.$store.getters.getPilot
      },
      stats (): PilotStats {
        if (this.loadoutForceReloadTrigger) console.info('Equipment changed: recalculating pilot stats...')
        else console.info('Loadout changed: recalculating pilot stats...')
        return Stats.pilotStats(this.pilot, this.pilot.loadouts[this.activeLoadoutIdx], this.$store.getters.getState)
      }
    }
  })
</script>

<style scoped>
  .header {
    background-color: lightgray;
    color: black;
    font-weight: bold;
    letter-spacing: 3px;
    width: 100%;
    padding-left: 10px;
    margin-top:10px;
    margin-bottom: 3px;
  }

  .float-right {
    float:right; 
    text-align: right
  }

  .no-icon {
    height:40px;
    padding-top:8px
  }
  </style>
