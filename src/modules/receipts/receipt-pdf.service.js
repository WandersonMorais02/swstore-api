import puppeteer from 'puppeteer'

function money(value = 0) {
  return (value / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function date(value) {
  return new Date(value).toLocaleString('pt-BR')
}

function safe(value) {
  return value || '-'
}

function privateReceiptHtml({ receipt, order }) {
  const items = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.productType}</td>
      <td>${item.quantity}</td>
      <td>${money(item.unitPrice)}</td>
      <td>${money(item.total)}</td>
    </tr>
  `).join('')

  const shippingGroups = (order.shippingGroups || []).map(group => `
    <tr>
      <td>${safe(group.provider)}</td>
      <td>${safe(group.serviceName)}</td>
      <td>${money(group.amount)}</td>
      <td>${group.deliveryTime || '-'} dia(s)</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111;
            margin: 0;
            padding: 24px;
            font-size: 11px;
          }
          .page {
            border: 1px solid #111;
            padding: 12px;
          }
          .header {
            display: grid;
            grid-template-columns: 1fr 220px;
            border-bottom: 1px solid #111;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          h1, h2, h3 { margin: 0; }
          h1 { font-size: 18px; }
          h2 { font-size: 14px; margin-bottom: 6px; }
          .box {
            border: 1px solid #111;
            padding: 8px;
            margin-bottom: 8px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
          }
          th, td {
            border: 1px solid #111;
            padding: 5px;
            text-align: left;
          }
          th {
            background: #eee;
          }
          .right { text-align: right; }
          .center { text-align: center; }
          .total {
            font-size: 14px;
            font-weight: bold;
          }
          .muted {
            color: #555;
          }
          .hash {
            font-size: 9px;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div>
              <h1>RECIBO DE COMPRA</h1>
              <p><strong>Digital Commerce</strong></p>
              <p class="muted">Documento interno de compra da plataforma.</p>
            </div>
            <div class="box center">
              <h2>RECIBO</h2>
              <p><strong>Nº ${receipt.privateNumber}</strong></p>
              <p>Pedido: ${order.code}</p>
              <p>Emissão: ${date(receipt.createdAt)}</p>
            </div>
          </div>

          <div class="grid-2">
            <div class="box">
              <h2>Cliente</h2>
              <p><strong>Nome:</strong> ${safe(order.customerId?.name)}</p>
              <p><strong>Email:</strong> ${safe(order.customerId?.email)}</p>
            </div>

            <div class="box">
              <h2>Pagamento</h2>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Provider:</strong> ${safe(order.payment?.provider)}</p>
              <p><strong>Método:</strong> ${safe(order.payment?.method)}</p>
              <p><strong>Pago em:</strong> ${order.payment?.paidAt ? date(order.payment.paidAt) : '-'}</p>
            </div>
          </div>

          <div class="box">
            <h2>Endereço de entrega</h2>
            <p>
              ${safe(order.shippingAddress?.recipientName)} -
              ${safe(order.shippingAddress?.street)},
              ${safe(order.shippingAddress?.number)}
              ${safe(order.shippingAddress?.complement)}
            </p>
            <p>
              ${safe(order.shippingAddress?.district)} -
              ${safe(order.shippingAddress?.city)}/${safe(order.shippingAddress?.state)}
              CEP: ${safe(order.shippingAddress?.zipcode)}
            </p>
          </div>

          <div class="box">
            <h2>Produtos/Serviços</h2>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th>Qtd</th>
                  <th>Unitário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>${items}</tbody>
            </table>
          </div>

          <div class="box">
            <h2>Frete</h2>
            <table>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Serviço</th>
                  <th>Valor</th>
                  <th>Prazo</th>
                </tr>
              </thead>
              <tbody>${shippingGroups || '<tr><td colspan="4">Sem frete</td></tr>'}</tbody>
            </table>
          </div>

          <div class="box">
            <table>
              <tr>
                <td>Subtotal</td>
                <td class="right">${money(order.subtotal)}</td>
              </tr>
              <tr>
                <td>Desconto</td>
                <td class="right">${money(order.discountAmount || 0)}</td>
              </tr>
              <tr>
                <td>Frete</td>
                <td class="right">${money(order.shippingAmount || 0)}</td>
              </tr>
              <tr class="total">
                <td>Total</td>
                <td class="right">${money(order.total)}</td>
              </tr>
            </table>
          </div>

          <div class="box">
            <h2>Chave de validação</h2>
            <p class="hash">${receipt.privateHash}</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function publicReceiptHtml({ receipt, order }) {
  const items = order.items.map(item => `
    <div class="item">
      <div>
        <strong>${item.name}</strong><br />
        <span>Qtd: ${item.quantity} &nbsp; Unit.: ${money(item.unitPrice)}</span>
      </div>
      <strong>${money(item.total)}</strong>
    </div>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            background: #fff;
            margin: 0;
            padding: 24px;
            color: #111;
          }
          .receipt {
            width: 360px;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
          }
          .center { text-align: center; }
          h1 {
            font-size: 16px;
            margin: 0 0 4px;
          }
          p {
            margin: 2px 0;
            font-size: 11px;
          }
          .divider {
            border-top: 1px dashed #aaa;
            margin: 12px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            font-size: 11px;
            padding: 6px 0;
            border-bottom: 1px dotted #ddd;
          }
          .totals {
            font-size: 12px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
          }
          .hash {
            font-size: 9px;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="center">
            <h1>DIGITAL COMMERCE</h1>
            <p>Recibo público de compra</p>
            <p>Nº ${receipt.publicNumber}</p>
          </div>

          <div class="divider"></div>

          <p><strong>Pedido:</strong> ${order.code}</p>
          <p><strong>Emissão:</strong> ${date(receipt.createdAt)}</p>
          <p><strong>Status:</strong> ${order.status}</p>

          <div class="divider"></div>

          ${items}

          <div class="divider"></div>

          <div class="totals">
            <div class="row">
              <span>Subtotal</span>
              <strong>${money(order.subtotal)}</strong>
            </div>
            <div class="row">
              <span>Desconto</span>
              <strong>${money(order.discountAmount || 0)}</strong>
            </div>
            <div class="row">
              <span>Frete</span>
              <strong>${money(order.shippingAmount || 0)}</strong>
            </div>
            <div class="row total">
              <span>Total</span>
              <span>${money(order.total)}</span>
            </div>
          </div>

          <div class="divider"></div>

          <p class="center">Consulte este recibo pela chave pública.</p>
          <p class="hash">${receipt.publicHash}</p>
        </div>
      </body>
    </html>
  `
}

async function htmlToPdfBuffer(html) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()

    await page.setContent(html, {
      waitUntil: 'networkidle0'
    })

    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '12mm',
        bottom: '12mm',
        left: '12mm'
      }
    })
  } finally {
    await browser.close()
  }
}

async function generatePrivatePdf(data) {
  const html = privateReceiptHtml(data)

  return htmlToPdfBuffer(html)
}

async function generatePublicPdf(data) {
  const html = publicReceiptHtml(data)

  return htmlToPdfBuffer(html)
}

export const receiptPdfService = {
  generatePrivatePdf,
  generatePublicPdf
}
