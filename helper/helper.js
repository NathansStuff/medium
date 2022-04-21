import createImageUrlBuilder from '@sanity/image-url'
import { config } from '../lib/sanity'

export const urlFor = (source) => createImageUrlBuilder(config).image(source)