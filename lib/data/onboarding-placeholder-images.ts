import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

// Datos de las películas (usando imágenes reales)
export const movies = [
  {
    id: 1,
    title: 'Spider-Man',
    image: require('@/assets/images/movies/01839d17af1b80c392925771af1a50ea3cb7d140.jpg'),
  },
  {
    id: 2,
    title: 'Batman',
    image: require('@/assets/images/movies/15120971aa7848def590eaeeda16dddc64d4fe45.jpg'),
  },
  {
    id: 3,
    title: 'Suicide Squad',
    image: require('@/assets/images/movies/762390e133aef26ddd029fc8c7cad1e3bbfccd99.jpg'),
  },
  {
    id: 4,
    title: 'Chucky',
    image: require('@/assets/images/movies/900980cc012e8a892443f1ffc4b1045b1e124173.jpg'),
  },
  {
    id: 5,
    title: 'Mystery Figure',
    image: require('@/assets/images/movies/9821847f4438627284e334e75bfccdc9d6c79352.jpg'),
  },
  {
    id: 6,
    title: 'Warner Bros',
    image: require('@/assets/images/movies/af6ae30217b0bffc10a3e5052bd562e90bb1e006.jpg'),
  },
  {
    id: 7,
    title: 'Braniff Travel',
    image: require('@/assets/images/movies/e7163aa26068d47aca0e991ff7f1b30649ad42fb.jpg'),
  },
  {
    id: 8,
    title: 'Cinema Art',
    image: require('@/assets/images/movies/eab2a7c4c1c15429a9ffe69e7fc1ae6b96c906a1.jpg'),
  },
]

export { width }
