export const ProviderEnum = {
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
    FACEBOOK: "FACEBOOK"
} as const

export type ProviderEnumType = (typeof ProviderEnum)[keyof typeof ProviderEnum]