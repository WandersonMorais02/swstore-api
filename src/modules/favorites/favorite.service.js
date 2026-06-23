import { Favorite } from './favorite.model.js'
import { FavoriteDTO } from './favorite.dto.js'
import { Product } from '../products/product.model.js'
import { AppError } from '../../shared/errors/AppError.js'

async function add(customerId, data) {
  const product = await Product.findById(data.productId)

  if (!product || !product.isActive || product.status !== 'APPROVED') {
    throw new AppError('Produto não encontrado ou indisponível', 404)
  }

  const favorite = await Favorite.findOneAndUpdate(
    {
      customerId,
      productId: data.productId
    },
    {
      customerId,
      productId: data.productId
    },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  )

  return new FavoriteDTO(favorite)
}

async function remove(customerId, productId) {
  const favorite = await Favorite.findOne({
    customerId,
    productId
  })

  if (!favorite) {
    throw new AppError('Favorito não encontrado', 404)
  }

  await favorite.deleteOne()

  return {
    message: 'Produto removido dos favoritos'
  }
}

async function toggle(customerId, data) {
  const favorite = await Favorite.findOne({
    customerId,
    productId: data.productId
  })

  if (favorite) {
    await favorite.deleteOne()

    return {
      favorited: false,
      message: 'Produto removido dos favoritos'
    }
  }

  const created = await add(customerId, data)

  return {
    favorited: true,
    favorite: created
  }
}

async function findMine(customerId) {
  const favorites = await Favorite.find({ customerId })
    .populate({
      path: 'productId',
      select: 'name slug price promotionalPrice previewImages averageRating reviewsCount sellerId categoryId',
      populate: [
        {
          path: 'sellerId',
          select: 'name sellerProfile.storeName'
        },
        {
          path: 'categoryId',
          select: 'name slug'
        }
      ]
    })
    .sort({ createdAt: -1 })

  return favorites.map(favorite => new FavoriteDTO(favorite))
}

async function isFavorite(customerId, productId) {
  const favorite = await Favorite.findOne({
    customerId,
    productId
  })

  return {
    favorited: !!favorite
  }
}

export const favoriteService = {
  add,
  remove,
  toggle,
  findMine,
  isFavorite
}
