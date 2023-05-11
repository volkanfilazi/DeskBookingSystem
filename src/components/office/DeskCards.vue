<script setup lang="ts">
import { useDesksStore } from '../../store/desks.store'
import { useOfficeStore } from '../../store/office.store'
import { useFavouritesStore } from '../../store/favourites.store';
import { ref, onBeforeUnmount, onMounted } from 'vue';
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useFormatStore } from '../../store/dateFormater.store';
import { useEnumStore } from '../../store/enum.store';
import VButton from '../../components/base/V-Button.vue'
import { useUserStore } from '../../store/user.store';
import { Desk } from '../../interface/desk.interface';

const selectedOffice = useStorage("selectedOffice", "")
const selectedDesk = ref<any>()
const selectedSortType = ref<string>('Select one option')
useStorage("selectedDesk", selectedDesk)
const router = useRouter()
const useDesks = useDesksStore()
const useOffice = useOfficeStore()
const formatStore = useFormatStore()
const useStore = useUserStore()
const favouritesStore = useFavouritesStore()
const useEquipments = useEnumStore()

async function fetchDesks() {
  await useDesks.getAllDesks()
}

async function fetchGetOfficeById() {
  await useOffice.getOfficeById(selectedOffice.value)
}

function NavigateToBooking(deskId: any) {
  selectedDesk.value = deskId
  router.push({ name: 'bookingPage', params: { id: deskId } })
}

onMounted(async () => {
  await useDesks.getAllDesks()
  await useOffice.getOfficeById(selectedOffice.value)
  await favouritesStore.getFavouritesByUserId(useStore.userProfile?.id!)
})

onBeforeUnmount(async () => {
  useOffice.resetColumRow
  useDesks.resetDesksState()
  await fetchGetOfficeById()
})
const equipment = ref<any>([])

function filterByEqui() {
  const selectedEquipment = [...equipment.value];
  equipment.value = [];
  useDesks.userFilterByEquipment(selectedEquipment)
}

function sortByDeskType() {
  if (selectedSortType.value === 'Fix') {
    useDesks.sortByDeskFix()
  }
  else if (selectedSortType.value === 'Flex') {
    useDesks.sortByDeskFlex()
  } else if (selectedSortType.value === 'Free') {
    useDesks.sortByDeskFree()
  }
  else {
    useDesks.defaultSortByDeskType()
  }
}

async function fetchGetFavoritesById() {
  await favouritesStore.getFavouritesByUserId(useStore.userProfile?.id!)
}

const deleteFavourite = async (desk: Desk) => {
  const found = favouritesStore.allFavourites.find((favourite) => favourite.desk.id === desk.id)
  if (found) {
    await favouritesStore.deleteFavourites(found.id)
  }
  await fetchDesks()
  await fetchGetFavoritesById()
}

async function newFavourite(id: string) {
  await favouritesStore.createFavourite({ desk: id })
  await fetchDesks()
  await fetchGetFavoritesById()
}


</script>
<template>
  <div class="flex flex-col h-full sm:flex-col md:flex-row lg:flex-row flex-grow gap-2">
    <div
      class="border-r-[1px] border-b-[1px] border-gray-600 pt-5 w-full sm:w-full md:max-w-[280px] shrink-0 flex flex-col">
      <div>
        <h3 class="border-b-[1px] pl-2 border-t-[1px] mb-1 border-gray-500 text-yellow-400">Sort by Equipment</h3>
        <div class="pr-2 pl-2 mt-2" v-for="equi in useEquipments.equipments">
          <div class="flex justify-between">
            <label class="text-white" :for="'eq-' + equi">{{ equi }}</label>
            <input type="checkbox" :id="'eq-' + equi" :value="equi" v-model="equipment">
          </div>
        </div>
        <div class="flex justify-center">
          <VButton class="mt-4" @click="filterByEqui()">Filter</VButton>
        </div>
      </div>
      <div class="mt-5">
        <h3 class="pl-2 border-b-[1px] border-t-[1px] mb-1 border-gray-500 text-yellow-400">Sort by Type</h3>
        <div class="pl-2">
          <select class="mt-2 text-black" v-model="selectedSortType" @change="sortByDeskType()">
            <option disabled>Select one option</option>
            <option>Fix</option>
            <option>Flex</option>
            <option>Free</option>
            <option>SelectAll</option>
          </select>
        </div>
      </div>
      <p class="border-b-[1px] text-yellow-400 mt-5 pl-2 border-t-[1px] mb-1 border-gray-500">Thema Info</p>
      <div class="flex flex-col justify-center mt-3 mb-3 pl-2 gap-1">
        <div class="flex items-center gap-1">
          <div class="bg-orange-500 w-[50px] h-[20px]"></div>
          <p class="text-white">Fix</p>
        </div>
        <div class="flex items-center gap-1">
          <div class="bg-green-800 w-[50px] h-[20px]"></div>
          <p class="text-white">Free</p>
        </div>
        <div class="flex items-center gap-1">
          <div class="bg-blue-500 w-[50px] h-[20px]"></div>
          <p class="text-white">flex</p>
        </div>
      </div>
    </div>
    <div class="w-full">
      <div class="text-center flex flex-col items-center justify-center">
        <p class="text-3xl text-white">Maximum Capacity : {{ useOffice.areaCalculater }}</p>
      </div>
      <div class="flex">
        <div v-if="useDesks.desks.length" class="grid w-full border-[1px] min-h-[380px] p-1 gap-2"
          :style="{ gridTemplateColumns: `repeat(${useOffice.getColumn}, 1fr)`, gridTemplateRows: `repeat(${useOffice.getRow}, 1fr)` }">
          <div class="text-red-500"> {{ useDesks.filtereByEquiErrorMessage }}</div>
          <div v-for="desk in useDesks.desks" :key="desk.id" @click="NavigateToBooking(desk.id)"
            class="card w-full lg:min-h-[250px] p-2 rounded-lg relative text-white cursor-pointer"
            :class="{ 'bg-green-800': !desk.nextBooking, 'bg-orange-600': desk.fixdesk, 'bg-blue-500': desk.nextBooking }"
            :style="{ gridColumn: (desk.column + 1) + ' / span 1', gridRow: (desk.row + 1) + ' / span 1' }">
            <div class="flex justify-center items-center">
              <div class="w-[50px] flex justify-center items-center h-[50px] absolute bg-gray-800 bottom-0">
                <div class="w-[25px] h-[25px] rounded-full bg-white"></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-[12px] flex justify-center">
                <p class="font-bold" v-if="desk.nextBooking">{{ formatStore.formatDate(desk.nextBooking) }}</p>
                <p v-else-if="desk.fixdesk">Unlimited</p>
                <p v-else="desk.nextBooking">-</p>
              </div>
              <div class="flex items-center">
                <div class="bg-transparent cursor-pointer p-1 z-30">
                  <Icon v-if="!desk.isUserFavourite" @click.stop="newFavourite(desk.id)" icon="mdi:cards-heart"
                    color="white" width="25" height="25" />
                  <Icon v-if="desk.isUserFavourite" @click.stop="deleteFavourite(desk)" icon="mdi:cards-heart" color="red"
                    width="25" height="25" />
                </div>
              </div>
            </div>
            <p>{{ desk.label }}</p>
            <p>row : {{ desk.row + 1 }}</p>
            <p>col : {{ desk.column + 1 }}</p>
            <p>equip : {{ desk.equipment }}</p>
            <div class="flex justify-center mb-10">
              <Icon icon="material-symbols:keyboard" color="white" width="50px" height="50px" />
            </div>
          </div>
        </div>
        <div v-else class="flex w-full min-h-[800px] justify-center items-center" v-if="!useDesks.desks.length">
          <p class="border-[1px] p-2 text-center rounded-md bg-gray-600 text-white">office dont have any desks added!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>