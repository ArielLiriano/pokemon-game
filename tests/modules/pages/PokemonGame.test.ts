import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame';
import { GameStatus } from '@/modules/pokemon/interfaces';
import PokemonGame from '@/modules/pokemon/pages/PokemonGame.vue';
import { mount } from '@vue/test-utils';
import type { Mock } from 'vitest';

vi.mock('@/modules/pokemon/composables/usePokemonGame', () => ({
  usePokemonGame: vi.fn(),
}));

const pokemonOptions = [
  {
    name: 'bulbasaur',
    id: 1,
  },
  {
    name: 'ivysaur',
    id: 2,
  },
  {
    name: 'venusaur',
    id: 3,
  },
  {
    name: 'charmander',
    id: 4,
  },
];
describe('<PokemonGame />', () => {
  test('should initialize with default values', async () => {
    (usePokemonGame as Mock).mockReturnValue({
      randomPokemon: undefined,
      gameStatus: GameStatus.Playing,
      isLoading: true,
      pokemonOptions: [],
      victorias: 2,
      derrotas: 1,
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    });
    const wrapper = mount(PokemonGame);

    expect(wrapper.get('h1').text()).toBe('Espere por favor');
    expect(wrapper.get('h1').classes()).toEqual(['text-3xl']);
    expect(wrapper.get('h3.animate-pulse').text()).toBe('Cargando pokémons');
    expect(wrapper.get('h3.animate-pulse').classes()).toEqual(['animate-pulse']);
    expect(wrapper.get('h3.victoria').text()).toBe('Victorias: 2');
    expect(wrapper.get('h3.perdidas').text()).toBe('Derrotas: 1');
  });

  test('should render <PokemonPicture/> and <PokemonOptions/>', () => {
    (usePokemonGame as Mock).mockReturnValue({
      randomPokemon: pokemonOptions.at(0),
      gameStatus: GameStatus.Playing,
      isLoading: false,
      pokemonOptions: pokemonOptions,
      victorias: 0,
      derrotas: 0,
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    });
    const wrapper = mount(PokemonGame);
    const url =
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg';
    const pokemons = pokemonOptions.map((p) => p.name);
    expect(wrapper.find('img').attributes('src')).toBe(url);
    const buttons = wrapper.findAll('.capitalize.disabled\\:shadow-none.disabled\\:bg-gray-100');
    expect(buttons.length).toBe(4);
    buttons.forEach((button) => {
      expect(pokemons).toContain(button.text());
    });
  });

  test('should render button for a new game', () => {
    (usePokemonGame as Mock).mockReturnValue({
      randomPokemon: pokemonOptions.at(0),
      gameStatus: GameStatus.Won,
      isLoading: false,
      pokemonOptions: pokemonOptions,
      victorias: 0,
      derrotas: 0,
      checkAnswer: vi.fn(),
      getNextRound: vi.fn(),
    });

    const wrapper = mount(PokemonGame);
    const button = wrapper.find('button.btnNuevo');
    expect(button.text()).toBe('Nuevo Juego');
  });

  test('should call the getNextRound function when the button is clicked', async () => {
    const spyNextRoundFn = vi.fn();
    (usePokemonGame as Mock).mockReturnValue({
      randomPokemon: pokemonOptions.at(0),
      gameStatus: GameStatus.Won,
      isLoading: false,
      pokemonOptions: pokemonOptions,
      victorias: 0,
      derrotas: 0,
      checkAnswer: vi.fn(),
      getNextRound: spyNextRoundFn,
    });

    const wrapper = mount(PokemonGame);
    const button = wrapper.find('button.btnNuevo');

    await button.trigger('click');
    expect(spyNextRoundFn).toHaveBeenCalled();
    expect(spyNextRoundFn).toHaveBeenCalledWith(4);
  });
});
