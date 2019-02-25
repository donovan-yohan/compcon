<template>
  <div class="roster-content">
    <div v-if="pilot.name">
      <v-container fluid>
        <v-layout>
          <v-flex xs10>
            <v-layout align-end>
              <v-flex shrink>
                <editable-label attr="callsign" description="Callsign" :placeholder="pilot.callsign">
                  <span slot="label" class="display-2">{{pilot.callsign}}</span>
                </editable-label>
              </v-flex>
              <v-flex>
               <editable-label attr="name" description="Name" :placeholder="pilot.name">
                  <span slot="label">{{pilot.name}}</span>
                </editable-label>           
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                  <span class="caption">HP {{stats.hp}} // ARMOR {{stats.armor}}</span>
                  <v-rating v-model="stats.hp" hover x-large :length="stats.hp + stats.armor" readonly small dense empty-icon="brightness_7" full-icon="brightness_1"/>
              </v-flex>
                <v-flex>
                  <span class="caption">E-DEFENSE {{stats.edef}}</span>
                  <v-rating v-model="stats.edef" hover x-large :length="stats.edef" readonly small dense empty-icon="brightness_7" full-icon="brightness_1"/>
                </v-flex>
                <v-flex>
                  <span class="caption">EVASION {{stats.evasion}}</span>
                  <v-rating v-model="stats.evasion" hover x-large :length="stats.evasion" readonly small dense empty-icon="brightness_7" full-icon="brightness_1"/>
                </v-flex>
                <v-flex>
                  <span class="caption">SPEED {{stats.speed}}</span>
                  <v-rating v-model="stats.speed" hover x-large :length="stats.speed" readonly small dense empty-icon="brightness_7" full-icon="brightness_1"/>
                </v-flex>
            </v-layout>
          </v-flex>
          <v-flex shrink>
            <span class="caption" style="float:right; text-align: right">LICENSE LEVEL</span><br>
          </v-flex>
            <span style="font-size: 120px; line-height: 90px" class="font-weight-thin">{{pilot.level}}</span>
          <v-flex>
            <v-tooltip bottom nudge-right="15px">
              <v-btn :to="'/level'" slot="activator" bottom right fab small :disabled="pilot.level > 11" color="primary" style="float:right; margin-left:30px">
                <v-icon large>arrow_upward</v-icon>
              </v-btn>
              <span>Level Up</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs8>
            <v-layout>
              <v-flex>
                <v-layout><span class="header no-icon">Biography</span></v-layout>
                <v-layout>
                  <v-flex xs12 style="text-align:center">
                    <b> {{ item('Backgrounds', pilot.background).name }} </b>
                    <v-dialog lazy v-model="backgroundModal" fullscreen hide-overlay transition="dialog-bottom-transition">
                      <v-btn slot="activator" class="edit-btn" small flat icon color="blue">
                        <v-icon small>edit</v-icon>
                      </v-btn>
                      <v-card>
                        <v-toolbar fixed dense>
                          <v-toolbar-title>Select Pilot Background</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-toolbar-items>
                            <v-btn icon large @click="backgroundModal = false"> <v-icon large>close</v-icon> </v-btn>
                          </v-toolbar-items>
                        </v-toolbar>
                        <v-spacer></v-spacer>
                        <background-selector @selected="backgroundSelect" :preSelected="pilot.background"/>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                </v-layout>
                <editable-textfield :description="'History'" :attr="'history'" :initial="pilot.history" />
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                <v-layout><span class="header no-icon">Contacts</span></v-layout>
                <contacts-list :contacts="pilot.contacts" @add-contact="refresh" :key="pilot.contacts.length" />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4>
            <v-layout>
              <span class="header">Appearance
                <v-btn class="edit-btn" small flat icon color="blue" @click="appearanceModal = true"><v-icon small>edit</v-icon></v-btn>
              </span>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2"  @click="appearanceModal = true">
                <div v-if="!pilot.img_appearance">
                  <v-btn block small flat color="blue lighten-1"><v-icon small>add</v-icon>&nbsp;Add Pilot Image</v-btn>
                </div>
                <div v-else>
                  <v-img :src="pilot.img_appearance" fluid-grow />
                </div>
                <v-dialog lazy v-model="appearanceModal" fullscreen hide-overlay transition="dialog-bottom-transition">
                  <v-card>
                    <v-toolbar fixed dense>
                      <v-toolbar-title>Set Pilot Images</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn icon large @click="appearanceModal = false"> <v-icon large>close</v-icon> </v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-spacer></v-spacer>
                    selector goes here
                    <v-layout justify-space-between>
                      <v-flex xs1> &emsp; </v-flex>
                      <v-flex xs1><v-btn color="primary" flat @click="appearanceModal = false">Confirm</v-btn></v-flex>
                    </v-layout>
                  </v-card>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex class="pl-2">
                <editable-textfield :description="'Appearance'" :attr="'text_appearance'" :initial="pilot.text_appearance" />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      <v-layout>
        <v-flex xs1>
          <v-layout><span class="header no-icon">Grit</span></v-layout>
          <v-layout align-center justify-center column fill-height>
            <v-flex><span class="display-3 font-weight-black text-xs-center">+{{stats.grit}}</span></v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout>
            <span class="header">
              Skill Triggers
              <v-dialog lazy v-model="skillModal" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-btn slot="activator" @click="reInit('skillSelector')" class="edit-btn" small flat icon color="blue darken-2">
                  <v-icon small>edit</v-icon>
                </v-btn>
                <v-card>
                  <v-toolbar fixed dense>
                    <v-toolbar-title>Edit Pilot Skills</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn icon large @click="skillModal = false"> <v-icon large>close</v-icon> </v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                <v-spacer class="mb-4 pb-2"/>
                  <skill-selector ref="skillSelector" :pilotSkills="pilot.skills" :pilotLevel="pilot.level" @set-skills="setPilotSkills" />
                </v-card>
              </v-dialog>
            </span>
          </v-layout>
          <div v-for="skill in pilot.skills" :key="skill.id">
            <skill-item :skillData="item('Skills', skill.id)" :skill="skill" />
          </div>
        </v-flex>
      </v-layout>
      <v-layout>
        <span class="header">Licenses
          <v-dialog lazy v-model="licenseModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-btn slot="activator" @click="reInit('licenseSelector')" class="edit-btn" small flat icon color="blue darken-2">
              <v-icon small>edit</v-icon>
            </v-btn>
            <v-card>
              <v-toolbar fixed dense>
                <v-toolbar-title>Edit Pilot Licenses</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="licenseModal = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer class="mb-4 pb-2"/>
              <license-selector ref="licenseSelector" :pilotLicenses="pilot.licenses" :pilotLevel="pilot.level" @set-licenses="setLicenses"/>
              <v-layout justify-space-between>
                <v-flex xs1> &emsp; </v-flex>
                <v-flex xs1><v-btn color="primary" flat @click="licenseModal = false">Confirm</v-btn></v-flex>
              </v-layout>
            </v-card>
          </v-dialog>
        </span>
      </v-layout>
      <div v-for="(license, index) in pilot.licenses" :key="index">
        <license-item :license="license" :licenseData="getLicense(license.name)" />
      </div>
      <v-layout>
        <span class="header">Talents
          <v-dialog lazy v-model="talentModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-btn slot="activator" @click="reInit('talentSelector')" class="edit-btn" small flat icon color="blue darken-2">
              <v-icon small>edit</v-icon>
            </v-btn>
            <v-card>
              <v-toolbar fixed dense>
                <v-toolbar-title>Edit Pilot Talents</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="talentModal = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer class="mb-4 pb-2"/>
              <talent-selector ref="talentSelector" :pilotTalents="pilot.talents" :pilotLevel="pilot.level" @set-talents="setPilotTalents"/>
            </v-card>
          </v-dialog>
        </span>
      </v-layout>
      <v-expansion-panel focusable>
        <talent-item v-for="talent in pilot.talents" :key="talent.id" :talent="talent" :talentData="item('Talents', talent.id)"/>
      </v-expansion-panel>
      <v-layout>
        <span class="header">Mech Skills
          <v-dialog lazy v-model="mechSkillModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-btn slot="activator" class="edit-btn" small flat icon color="blue darken-2">
              <v-icon small>edit</v-icon>
            </v-btn>
            <v-card>
              <v-toolbar fixed dense>
                <v-toolbar-title>Edit Mech Skills</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="mechSkillModal = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer class="mb-4 pb-2"/>
              <mech-skills-selector :mechSkills="pilot.mechSkills" :pilotLevel="pilot.level" :isActivePilot="true" />
              <v-layout justify-space-between>
                <v-flex xs1> &emsp; </v-flex>
                <v-flex xs1><v-btn color="primary" flat @click="mechSkillModal = false">Confirm</v-btn></v-flex>
              </v-layout>
            </v-card>
          </v-dialog>
        </span>
      </v-layout>
      <v-layout center justify-space-around class="pl-5">
        <v-flex>
          HULL <span class="grey--text">({{pilot.mechSkills.hull}})</span>
          <v-rating v-model="pilot.mechSkills.hull" hover x-large length=6 readonly dense empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        </v-flex>
        <v-flex xs3>
          AGILITY <span class="grey--text">({{pilot.mechSkills.agi}})</span>
          <v-rating v-model="pilot.mechSkills.agi" hover x-large length=6 readonly dense empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        </v-flex>
        <v-flex xs3>
          SYSTEMS <span class="grey--text">({{pilot.mechSkills.sys}})</span>
          <v-rating v-model="pilot.mechSkills.sys" hover x-large length=6 readonly dense empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        </v-flex>
        <v-flex xs3>
          ENGINEERING <span class="grey--text">({{pilot.mechSkills.eng}})</span>
          <v-rating v-model="pilot.mechSkills.eng" hover x-large length=6 readonly dense empty-icon="radio_button_unchecked" full-icon="brightness_1"/>
        </v-flex>
      </v-layout>
      <v-layout>
        <span class="header">CORE Bonuses
          <v-dialog lazy v-model="bonusModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-btn slot="activator" @click="reInit('cbSelector')" class="edit-btn" small flat icon color="blue darken-2">
              <v-icon small>edit</v-icon>
            </v-btn>
            <v-card>
              <v-toolbar fixed dense>
                <v-toolbar-title>Edit CORE Bonuses</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large @click="bonusModal = false"> <v-icon large>close</v-icon> </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-spacer></v-spacer>
              <core-bonus-selector ref="cbSelector" :pilotBonuses="pilot.core_bonuses" :pilotLevel="pilot.level" :pilotLicenses="pilot.licenses" @set-bonuses="setPilotBonuses"/>
            </v-card>
          </v-dialog>
        </span>
      </v-layout>
      <v-container>      
      <v-layout row v-for="cb in pilot.core_bonuses" :key="cb">
        <cb-item :cb="item('CoreBonuses', cb)" />
      </v-layout>
      </v-container>
      <v-layout><span class="header no-icon">Pilot Gear</span></v-layout>
      <v-layout>
        <v-flex xs12>
          <pilot-loadout />
        </v-flex>
      </v-layout>
      <v-layout><span class="header no-icon">Notes</span></v-layout>
      <v-layout>
        <v-flex>
          <editable-textfield :description="'Pilot Notes'" :attr="'notes'" :initial="pilot.notes" />
          </v-flex>
      </v-layout>
      <div class="spacer" />
    </v-container>

      <div class="spacer" />
      <v-container>
        <v-layout>
          <v-flex xs4><v-btn block>print</v-btn></v-flex>
          <v-flex xs4><v-btn block>export</v-btn></v-flex>
          <v-flex xs4>
            <v-btn slot="activator" color="primary" flat block @click="clonePilot"><v-icon>file_copy</v-icon> &nbsp; CLONE</v-btn>
          </v-flex>
          <v-flex xs4>
            <v-dialog v-model="deleteDialog" width="500" >
                <v-btn slot="activator" color="error" flat block><v-icon>delete</v-icon> &nbsp; DELETE</v-btn>
                <v-card>
                  <v-card-text>
                    Are you sure you want to delete {{pilot.callsign}}? This action cannot be undone
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-btn color="primary" flat @click="deleteDialog = false" > Cancel </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="deletePilot" > Delete Pilot </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </v-flex>
        </v-layout>
      <div class="spacer" />
      </v-container>
    </div>

    <div v-else style="height: 100%">
      <v-container style="height: 100%">
        <v-layout align-center justify-center row fill-height>
          <v-flex height="100%">
            <p class="grey--text text-xs-center display-2">NO PILOT LOADED</p>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
  import Stats from '@/logic/stats'
  import { EditableLabel, EditableTextfield } from '../UI'
  import { ImageSelector, BackgroundSelector, SkillSelector, TalentSelector, LicenseSelector, MechSkillsSelector, CoreBonusSelector } from './Selectors'
  import ContactsList from './ContactsList'
  import LicenseItem from './LicenseItem'
  import SkillItem from './SkillItem'
  import TalentItem from './TalentItem'
  import CoreBonusItem from './CoreBonusItem'
  import PilotLoadout from './LoadoutEditor/PilotLoadout'

  export default {
    name: 'pilot-sheet',
    components: {
      EditableLabel,
      EditableTextfield,
      LicenseItem,
      SkillItem,
      TalentItem,
      PilotLoadout,
      'cb-item': CoreBonusItem,
      'image-selector-modal': ImageSelector,
      ContactsList,
      BackgroundSelector,
      SkillSelector,
      TalentSelector,
      LicenseSelector,
      MechSkillsSelector,
      CoreBonusSelector
    },
    data: () => ({
      callsignDialog: false,
      newCallsign: '',
      renameDialog: false,
      newName: '',
      backgroundModal: false,
      appearanceModal: false,
      skillModal: false,
      licenseModal: false,
      talentModal: false,
      mechSkillModal: false,
      bonusModal: false,
      pilotGearModal: false,
      deleteDialog: false,
      contactKey: 0,
      activeLoadoutIdx: 0,
      loadoutForceReloadTrigger: 0
    }),
    methods: {
      refresh: function () {
        console.log('refreshing')
        this.$forceUpdate()
      },
      setField: function (attr, val, close) {
        this[close] = false
        this.$store.dispatch('editPilot', {
          attr: attr,
          val: val
        })
      },
      item: function (type, id) {
        return this.$store.getters.getItemById(type, id)
      },
      getLicense: function (name) {
        return this.$store.getters.getLicenseByName(name.toLowerCase())
      },
      reInit: function (ref) {
        this.$refs[ref].initialize()
      },
      backgroundSelect: function (bgReturn) {
        this.backgroundModal = false
        this.$store.dispatch('editPilot', {
          attr: `background`,
          val: bgReturn.value
        })
      },
      setPilotSkills: function (skillArray) {
        this.skillModal = false
        this.$store.dispatch('editPilot', {
          attr: `skills`,
          val: skillArray
        })
        this.$forceUpdate()
      },
      setPilotTalents: function (talentArray) {
        this.talentModal = false
        this.$store.dispatch('editPilot', {
          attr: `talents`,
          val: talentArray
        })
        this.$forceUpdate()
      },
      setPilotBonuses: function (bonusArray) {
        this.bonusModal = false
        this.$store.dispatch('editPilot', {
          attr: `core_bonuses`,
          val: bonusArray
        })
        this.$forceUpdate()
      },
      setLicenses: function (licenseArray) {
        this.licenseModal = false
        this.$store.dispatch('editPilot', {
          attr: `licenses`,
          val: licenseArray
        })
        this.$forceUpdate()
      },
      deletePilot: function () {
        this.deleteDialog = false
        this.$store.dispatch('deletePilot', this.pilot.id)
      },
      clonePilot: function () {
        this.$store.dispatch('clonePilot', this.pilot.id)
      }
    },
    computed: {
      pilot: function () {
        return this.$store.getters.getPilot
      },
      stats: function () {
        if (this.loadoutForceReloadTrigger) console.info('Equipment changed: recalculating pilot stats...')
        else console.info('Loadout changed: recalculating pilot stats...')
        return Stats.pilotStats(this.pilot, this.pilot.loadouts[this.activeLoadoutIdx])
      }
    }
  }
</script>

<style scoped>
  .header {
    background-color: lightgray;
    font-weight: bold;
    letter-spacing: 3px;
    width: 100%;
    padding-left: 10px;
    margin-top:10px;
    margin-bottom: 3px;
  }

  .no-icon {
    height:40px;
    padding-top:8px
  }

  .v-dialog__activator {
    margin-left: -18px;
  }
</style>

<style>
.edit-btn {
  position: relative;
  margin-left: -10px;
  opacity: 0.3;
  cursor: pointer;
  transition: 0.3s all;
}

.edit-btn:hover {
  opacity: 1;
  transition: 0.3s all;
}

.notch20 {
  --notchSize: 20px;

  clip-path:
    polygon(
      0% 0%,
      0% 0%,
      calc(100% - var(--notchSize)) 0%,
      100% var(--notchSize),
      100% 100%,
      calc(100% - var(--notchSize)) 100%,
      var(--notchSize) 100%,
      0% calc(100% - var(--notchSize))
    );
}

.notch8 {
  --notchSize: 8px;

  clip-path:
    polygon(
      0% 0%,
      0% 0%,
      calc(100% - var(--notchSize)) 0%,
      100% var(--notchSize),
      100% 100%,
      calc(100% - var(--notchSize)) 100%,
      var(--notchSize) 100%,
      0% calc(100% - var(--notchSize))
    );
}

</style>