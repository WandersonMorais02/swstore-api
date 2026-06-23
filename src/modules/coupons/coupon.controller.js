import { couponService } from './coupon.service.js'
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema
} from './coupon.schema.js'

async function create(req, res) {
  const data = createCouponSchema.parse(req.body)

  const coupon = await couponService.create(data)

  return res.status(201).json(coupon)
}

async function index(req, res) {
  const coupons = await couponService.findAll(req.query)

  return res.json(coupons)
}

async function show(req, res) {
  const coupon = await couponService.findById(req.params.id)

  return res.json(coupon)
}

async function update(req, res) {
  const data = updateCouponSchema.parse(req.body)

  const coupon = await couponService.update(req.params.id, data)

  return res.json(coupon)
}

async function remove(req, res) {
  const result = await couponService.remove(req.params.id)

  return res.json(result)
}

async function validate(req, res) {
  const data = validateCouponSchema.parse(req.body)

  return res.json({
    valid: true,
    code: data.code.toUpperCase()
  })
}

export const couponController = {
  create,
  index,
  show,
  update,
  remove,
  validate
}
