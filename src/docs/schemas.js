/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [ADMIN, SELLER, CUSTOMER]
 *         isActive:
 *           type: boolean
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         sellerId:
 *           type: string
 *         categoryId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [DIGITAL, PHYSICAL, HYBRID]
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         promotionalPrice:
 *           type: number
 *           nullable: true
 *         stock:
 *           type: number
 *         status:
 *           type: string
 *           enum: [DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, INACTIVE]
 *         averageRating:
 *           type: number
 *         reviewsCount:
 *           type: number
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         customerId:
 *           type: string
 *         subtotal:
 *           type: number
 *         discountAmount:
 *           type: number
 *         shippingAmount:
 *           type: number
 *         total:
 *           type: number
 *         status:
 *           type: string
 *           enum: [PENDING_PAYMENT, PAID, PROCESSING, COMPLETED, CANCELED, REFUNDED]
 *
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         label:
 *           type: string
 *         recipientName:
 *           type: string
 *         zipcode:
 *           type: string
 *         street:
 *           type: string
 *         number:
 *           type: string
 *         district:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         isDefault:
 *           type: boolean
 *
 *     Coupon:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         type:
 *           type: string
 *           enum: [PERCENTAGE, FIXED]
 *         value:
 *           type: number
 *         scope:
 *           type: string
 *           enum: [GLOBAL, SELLER]
 *         isActive:
 *           type: boolean
 */
