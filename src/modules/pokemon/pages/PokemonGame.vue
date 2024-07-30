<template>
  <!--==============Contador de victorias===============-->
  <section class="flex justify-center items-center">
    <h3 class="victoria">Victorias: {{ victorias }}</h3>
    <h3 class="perdidas">Derrotas: {{ derrotas }}</h3>
  </section>
  <section
    v-if="isLoading || randomPokemon.id === null"
    class="flex flex-col justify-center items-center w-screen h-screen"
  >
    <h1 class="text-3xl">Espere por favor</h1>
    <h3 class="animate-pulse">Cargando pokémons</h3>
  </section>

  <section v-else class="flex flex-col justify-center items-center w-screen h-screen">
    <h1 class="m-5">¿Quién es este Pokémon?</h1>
    <div class="h-20">
      <button v-if="gameStatus !== GameStatus.Playing" @click="getNextRound()" class="btnNuevo">
        Nuevo Juego
      </button>
    </div>

    <!--==============Pokémon picture===============-->
    <PokemonPicture
      :pokemon-id="randomPokemon.id"
      :show-pokemon="gameStatus !== GameStatus.Playing"
    />

    <!--==============Pokémon options===============-->
    <PokemonOptions
      :options="options"
      :block-selection="gameStatus !== GameStatus.Playing"
      :correct-answer="randomPokemon.id"
      @selected-option="checkAnswer"
    />
  </section>
</template>

<script setup lang="ts">
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonPicture from '../components/PokemonPicture.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  randomPokemon,
  gameStatus,
  isLoading,
  pokemonOptions: options,
  victorias,
  derrotas,
  checkAnswer,
  getNextRound,
} = usePokemonGame();
</script>

<style scoped>
.btnNuevo {
  @apply bg-green-500 shadow-md rounded-lg p-3 m-2 cursor-pointer w-40 text-center transition-all hover:bg-green-600 text-white;
}

h3.victoria {
  @apply bg-green-400 text-white shadow-md rounded-md p-1 m-1 cursor-pointer transition-all hover:animate-pulse;
}

h3.perdidas {
  @apply bg-red-600 text-white shadow-md rounded-md p-1 m-1 cursor-pointer transition-all hover:animate-pulse;
}
</style>
