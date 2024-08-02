import { flushPromises } from '@vue/test-utils';
import confetti from 'canvas-confetti';
import MockAdapter from 'axios-mock-adapter';
import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame';
import { withSetup } from '../../../utils/with-setup';
import { GameStatus } from '@/modules/pokemon/interfaces';
import { pokemonApi } from '@/modules/pokemon/api/pokemonApi';
import { pokemonListFake } from '../../../data/fake-pokemons';

const mockPokemonApi = new MockAdapter(pokemonApi);
mockPokemonApi.onGet('/?limit=151').reply(200, {
  results: pokemonListFake,
});

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('usePokemonGame', async () => {
  test('should initialize with the correct default values', async () => {
    const [result, app] = withSetup(usePokemonGame);
    expect(result.gameStatus.value).toBe(GameStatus.Playing);
    expect(result.isLoading.value).toBe(true);
    expect(result.pokemonOptions.value).toEqual([]);
    expect(result.randomPokemon.value).toBe(undefined);
    await flushPromises();

    expect(result.isLoading.value).toBe(false);
    expect(result.pokemonOptions.value.length).toBe(4);
    expect(result.randomPokemon.value).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
    });
  });

  test('should correctly handle getNextRound', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises();
    results.gameStatus.value = GameStatus.Won;

    //estimulo
    results.getNextRound(5);

    expect(results.gameStatus.value).toBe(GameStatus.Playing);
    expect(results.pokemonOptions.value).toHaveLength(5);
  });

  test('should correctly handle getNextRound and return different pokemons', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises();

    const firstPokemons = [...results.pokemonOptions.value].map((p) => p.name);

    //estimulo
    results.getNextRound();

    const secondsPokemons = [...results.pokemonOptions.value];
    secondsPokemons.forEach((pokemon) => {
      expect(firstPokemons).not.contain(pokemon.name);
    });

    expect(results.pokemonOptions.value).toHaveLength(4);
  });

  test('should correctly handle a incorrect answer', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises();
    const { checkAnswer, gameStatus } = results;
    expect(gameStatus.value).toBe(GameStatus.Playing);
    checkAnswer(1000000000); //pokemon id no existe
    expect(gameStatus.value).toBe(GameStatus.Lost);
  });

  test('should correctly handle a correct answer', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises();
    const { checkAnswer, gameStatus, randomPokemon } = results;
    expect(gameStatus.value).toBe(GameStatus.Playing);
    checkAnswer(randomPokemon.value.id); //pokemon id no existe
    expect(confetti).toHaveBeenCalled();
    expect(confetti).toHaveBeenCalledWith({
      //probando que el canvas confetti se llame con los argumentos que se especificaron
      particleCount: 300,
      spread: 150,
      origin: { y: 0.6 },
    });
    expect(gameStatus.value).toBe(GameStatus.Won);
  });
});
