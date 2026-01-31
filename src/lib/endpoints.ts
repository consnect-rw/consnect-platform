const Endpoints = {
     AUTH: {
          AUTH: "auth/auth",
          USER: "auth/user",
          OTP: "auth/otp"
     },
     COMPANY: {
          COMPANY: "companies/company",
          FOUNDER: "companies/founder",
          PROJECT: "companies/project",
          REVIEW: "companies/review",
          SERVICE: "companies/service",
          CONTACT_PERSON: "companies/contact-person",
          PRODUCT_CATALOG: "companies/product-catalog",
     },
     COMMON: {
          LOCATION: "common/location",
          CATEGORY: "common/category",
          DOCUMENT: "common/document",
          DESCRIPTION: "common/description",
          SOCIAL_MEDIA: "common/social-media",
     },
     FINANCE: {
          TRANSACTION: "finance/transaction"
     },
     CHAT: {
          MESSAGE: "chat/message",
          CONVERSATION: "chat/conversation",
     },
     MONITORING: {
          LOG: "monitoring/log"
     },
     NOTIFICATION: {
          NOTIFICATION: "notifications/notification",
          ALERT: "notifications/alert",
          REMINDER: "notifications/reminder",
          SUBSCRIPTION: "notifications/subscription",
     },
     OFFER: {
          OFFER: "offers/offer",
          OFFER_INTEREST: "offers/offer-interest"
     }
}

export default Endpoints;