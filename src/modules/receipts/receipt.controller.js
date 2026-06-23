import { receiptService } from './receipt.service.js'

async function privatePdf(req, res) {
  const pdf = await receiptService.generatePrivatePdf(
    req.params.orderId,
    req.user
  )

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `inline; filename="recibo-${req.params.orderId}.pdf"`
  )

  return res.send(pdf)
}

async function publicPdf(req, res) {
  const pdf = await receiptService.generatePublicPdf(req.params.hash)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `inline; filename="recibo-publico.pdf"`
  )

  return res.send(pdf)
}

async function publicShow(req, res) {
  const { receipt, order } = await receiptService.findPublicByHash(req.params.hash)

  return res.json({
    receipt: {
      publicHash: receipt.publicHash,
      publicNumber: receipt.publicNumber,
      createdAt: receipt.createdAt
    },
    order: {
      code: order.code,
      status: order.status,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingAmount: order.shippingAmount,
      total: order.total,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      }))
    }
  })
}

export const receiptController = {
  privatePdf,
  publicPdf,
  publicShow
}
