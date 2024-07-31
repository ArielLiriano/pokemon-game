import PokemonPicture from '@/modules/pokemon/components/PokemonPicture.vue';
import { mount } from '@vue/test-utils';

describe('<PokemonPicture />', () => {
  const imageSource =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg';

  test('should render the hidden image when showPokemon prop is false', () => {
    const wrapper = mount(PokemonPicture, {
      props: { pokemonId: 25, showPokemon: false },
    });

    const image = wrapper.find('img');
    const attributes = image.attributes();

    // expect(image.attributes('src')).toBe(imageSource);
    expect(attributes).toEqual(
      expect.objectContaining({
        class: 'brightness-0 h-[200px]',
        src: imageSource,
      }),
    );
  });

  test('should render the image when showPokemon prop is true', () => {
    const wrapper = mount(PokemonPicture, {
      props: { pokemonId: 25, showPokemon: true },
    });

    const image = wrapper.find('img');
    const attributes = image.attributes();

    // expect(image.attributes('src')).toBe(imageSource);
    expect(attributes).toEqual(
      expect.objectContaining({
        class: 'fade-in h-[200px]',
        src: imageSource,
      }),
    );
  });
});
