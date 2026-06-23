import { Address } from './address.model.js'
import { AddressDTO } from './address.dto.js'
import { AppError } from '../../shared/errors/AppError.js'

function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '')
}

async function unsetDefaultAddresses(customerId) {
  await Address.updateMany(
    { customerId },
    { $set: { isDefault: false } }
  )
}

async function create(customerId, data) {
  const totalAddresses = await Address.countDocuments({ customerId })

  const shouldBeDefault = data.isDefault === true || totalAddresses === 0

  if (shouldBeDefault) {
    await unsetDefaultAddresses(customerId)
  }

  const address = await Address.create({
    ...data,
    customerId,
    zipcode: onlyNumbers(data.zipcode),
    state: data.state.toUpperCase(),
    isDefault: shouldBeDefault
  })

  return new AddressDTO(address)
}

async function findMine(customerId) {
  const addresses = await Address.find({
    customerId,
    isActive: true
  }).sort({
    isDefault: -1,
    createdAt: -1
  })

  return addresses.map(address => new AddressDTO(address))
}

async function findById(id, currentUser) {
  const address = await Address.findById(id)

  if (!address || !address.isActive) {
    throw new AppError('Endereço não encontrado', 404)
  }

  const isOwner = address.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode acessar esse endereço', 403)
  }

  return new AddressDTO(address)
}

async function update(id, currentUser, data) {
  const address = await Address.findById(id)

  if (!address || !address.isActive) {
    throw new AppError('Endereço não encontrado', 404)
  }

  const isOwner = address.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode editar esse endereço', 403)
  }

  if (data.isDefault === true) {
    await unsetDefaultAddresses(address.customerId)
  }

  if (data.zipcode) {
    data.zipcode = onlyNumbers(data.zipcode)
  }

  if (data.state) {
    data.state = data.state.toUpperCase()
  }

  Object.assign(address, data)

  await address.save()

  return new AddressDTO(address)
}

async function setDefault(id, currentUser) {
  const address = await Address.findById(id)

  if (!address || !address.isActive) {
    throw new AppError('Endereço não encontrado', 404)
  }

  const isOwner = address.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode alterar esse endereço', 403)
  }

  await unsetDefaultAddresses(address.customerId)

  address.isDefault = true
  await address.save()

  return new AddressDTO(address)
}

async function remove(id, currentUser) {
  const address = await Address.findById(id)

  if (!address || !address.isActive) {
    throw new AppError('Endereço não encontrado', 404)
  }

  const isOwner = address.customerId.toString() === currentUser.id
  const isAdmin = currentUser.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new AppError('Você não pode remover esse endereço', 403)
  }

  address.isActive = false
  address.isDefault = false

  await address.save()

  return {
    message: 'Endereço removido com sucesso'
  }
}

export const addressService = {
  create,
  findMine,
  findById,
  update,
  setDefault,
  remove
}
