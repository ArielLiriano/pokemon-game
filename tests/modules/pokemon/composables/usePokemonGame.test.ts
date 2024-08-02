import { usePokemonGame } from "@/modules/pokemon/composables/usePokemonGame";
import { withSetup } from "../../../utils/with-setup";
import { GameStatus } from "@/modules/pokemon/interfaces";
import { flushPromises } from "@vue/test-utils";

describe('usePokemonGame', async () =>{
    test('should initialize with the correct default values', async () => {
        const [result, app] = withSetup(usePokemonGame);
        expect(result.gameStatus.value).toBe(GameStatus.Playing);
        expect(result.isLoading.value).toBe(true);
        expect(result.pokemonOptions.value).toEqual([]);
        expect(result.randomPokemon.value).toBe(undefined);
        await new Promise((r) => setTimeout(r, 1000))
        await flushPromises();

        expect(result.isLoading.value).toBe(false);
        expect(result.pokemonOptions.value.length).toBe(4);
        expect(result.randomPokemon.value).toEqual({
            id: expect.any(Number),
            name: expect.any(String)
        });
    });
});