import type { Pokemon } from '@/modules/pokemon/interfaces';

describe('Pokemon interface', () => {
  const pokemon: Pokemon = { id: 1, name: 'Bulvasaur' };
  test('Should have an id property of type number', () => {
    expect(pokemon.id).toEqual(expect.any(Number));
  });
  test('Should have an name property of type string', () => {
    expect(pokemon.name).toEqual(expect.any(String));
  });
});
