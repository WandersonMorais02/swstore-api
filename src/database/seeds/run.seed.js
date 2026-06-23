import 'dotenv/config'
import bcrypt from 'bcryptjs'

import { connectDatabase } from '../connect.js'

import { User } from '../../modules/users/user.model.js'
import { Setting } from '../../modules/settings/setting.model.js'
import { Category } from '../../modules/categories/category.model.js'
import { SellerShipping } from '../../modules/seller-shipping/seller-shipping.model.js'
import { LocalShippingZone } from '../../modules/local-shipping/local-shipping-zone.model.js'
import { LocalShippingPrice } from '../../modules/local-shipping/local-shipping-price.model.js'
import { Coupon } from '../../modules/coupons/coupon.model.js'

import { slugify } from '../../shared/utils/slugify.js'

async function seedSettings() {
  const exists = await Setting.findOne()

  if (!exists) {
    await Setting.create({
      platformName: 'Digital Commerce',
      platformFeePercent: 5,
      payoutMode: 'MANUAL',
      payoutSchedule: 'DAILY',
      currency: 'BRL'
    })
  }

  console.log('✅ Settings seed')
}

async function seedUsers() {
  const password = await bcrypt.hash('123456', 8)
  const password01 = await bcrypt.hash('Lan@0902', 8)

  const admin = await User.findOneAndUpdate(
    { email: 'saulomorais9@gmail.com' },
    {
      name: 'Saulo Morais',
      email: 'saulomorais9@gmail.com',
      password: password01,
      role: 'ADMIN',
      isActive: true
    },
    { upsert: true, new: true }
  )

  const seller = await User.findOneAndUpdate(
    { email: 'seller@email.com' },
    {
      name: 'Seller Teste',
      email: 'seller@email.com',
      password,
      role: 'SELLER',
      sellerProfile: {
        storeName: 'Loja do Seller',
        document: '00000000000',
        phone: '91999999999',
        useCustomFee: false,
        customFeePercent: null,
        isApproved: true
      },
      isActive: true
    },
    { upsert: true, new: true }
  )

  const customer = await User.findOneAndUpdate(
    { email: 'customer@email.com' },
    {
      name: 'Cliente Teste',
      email: 'customer@email.com',
      password,
      role: 'CUSTOMER',
      isActive: true
    },
    { upsert: true, new: true }
  )

  console.log('✅ Users seed')

  return { admin, seller, customer }
}

async function seedCategories() {
  const categories = [
    {
      name: 'Artes Digitais',
      description: 'Produtos digitais para festas, convites e personalizações.'
    },
    {
      name: 'E-books',
      description: 'Livros digitais e materiais educativos.'
    },
    {
      name: 'Produtos Físicos',
      description: 'Produtos que precisam de envio físico.'
    },
    {
      name: 'Kits Festa',
      description: 'Kits digitais, físicos ou híbridos para festas.'
    }
  ]

  for (const item of categories) {
    await Category.findOneAndUpdate(
      { slug: slugify(item.name) },
      {
        ...item,
        slug: slugify(item.name),
        isActive: true
      },
      { upsert: true, new: true }
    )
  }

  console.log('✅ Categories seed')
}

async function seedSellerShipping(seller) {
  await SellerShipping.findOneAndUpdate(
    { sellerId: seller._id },
    {
      sellerId: seller._id,
      pickupName: 'Loja Principal',
      originAddress: {
        zipcode: '68830000',
        street: 'Rua Exemplo',
        number: '123',
        complement: '',
        district: 'Centro',
        city: 'Ponta de Pedras',
        state: 'PA'
      },
      sender: {
        name: 'Loja do Seller',
        phone: '91999999999',
        document: '00000000000'
      },
      isActive: true
    },
    { upsert: true, new: true }
  )

  console.log('✅ Seller Shipping seed')
}

async function seedLocalShipping() {
  const zoneNames = [
    'Centro',
    'Estrada',
    'Mutirão',
    'Carnapijó',
    'Mangabeira'
  ]

  const zones = {}

  for (const name of zoneNames) {
    const zone = await LocalShippingZone.findOneAndUpdate(
      {
        city: 'Ponta de Pedras',
        state: 'PA',
        zipcode: '68830000',
        name
      },
      {
        city: 'Ponta de Pedras',
        state: 'PA',
        zipcode: '68830000',
        name,
        isActive: true
      },
      { upsert: true, new: true }
    )

    zones[name] = zone
  }

  const prices = [
    ['Centro', 'Estrada', 500],
    ['Centro', 'Mutirão', 1000],
    ['Centro', 'Carnapijó', 1200],
    ['Centro', 'Mangabeira', 1500],
    ['Estrada', 'Mutirão', 800]
  ]

  for (const [origin, destination, price] of prices) {
    await LocalShippingPrice.findOneAndUpdate(
      {
        originZoneId: zones[origin]._id,
        destinationZoneId: zones[destination]._id
      },
      {
        city: 'Ponta de Pedras',
        state: 'PA',
        zipcode: '68830000',
        originZoneId: zones[origin]._id,
        destinationZoneId: zones[destination]._id,
        price,
        deliveryTime: 1,
        isBidirectional: true,
        isActive: true
      },
      { upsert: true, new: true }
    )
  }

  console.log('✅ Local Shipping seed')
}

async function seedCoupons(seller) {
  await Coupon.findOneAndUpdate(
    { code: 'BEMVINDO10' },
    {
      code: 'BEMVINDO10',
      description: 'Cupom global de boas-vindas',
      type: 'PERCENTAGE',
      value: 10,
      scope: 'GLOBAL',
      sellerId: null,
      minOrderAmount: 0,
      maxDiscountAmount: 2000,
      usageLimit: null,
      isActive: true
    },
    { upsert: true, new: true }
  )

  await Coupon.findOneAndUpdate(
    { code: 'SELLER5' },
    {
      code: 'SELLER5',
      description: 'Cupom do seller de teste',
      type: 'PERCENTAGE',
      value: 5,
      scope: 'SELLER',
      sellerId: seller._id,
      minOrderAmount: 0,
      maxDiscountAmount: null,
      usageLimit: null,
      isActive: true
    },
    { upsert: true, new: true }
  )

  console.log('✅ Coupons seed')
}

async function runSeed() {
  await connectDatabase()

  await seedSettings()

  const { seller } = await seedUsers()

  await seedCategories()
  await seedSellerShipping(seller)
  await seedLocalShipping()
  await seedCoupons(seller)

  console.log('🌱 Seed finalizada com sucesso')
  process.exit(0)
}

runSeed().catch(error => {
  console.error('❌ Erro no seed:', error)
  process.exit(1)
})
