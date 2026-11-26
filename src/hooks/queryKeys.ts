import { Id } from "@/types"

// Builders that take a possibly missing id get their own label, so a missing id never makes two keys equal

export const queryKeys = {
  store: {
    all: ["store"],
    byOwner: (userId: Id) => ["store", { userId }],
  },
  todayStats: {
    all: ["todayStats"],
    byStore: (storeId: Id, since: string) => ["todayStats", { storeId, since }],
  },
  profile: {
    all: ["profile"],
    byUser: (userId: Id) => ["profile", { userId }],
  },
  customers: {
    all: ["customers"],
    byStore: (storeId: Id) => ["customers", { storeId }],
    recent: (storeId: Id, limit: number) => ["customers", "recent", { storeId, limit }],
  },
  userStores: {
    all: ["userStores"],
    byUser: (userId: Id) => ["userStores", { userId }],
    byUserStore: (userId: Id, storeId: Id) => ["userStores", "byStore", { userId, storeId }],
  },
  rewards: {
    all: ["rewards"],
    byStore: (storeId: Id, activeOnly: boolean) => ["rewards", { storeId, activeOnly }],
    byStores: (storeIds: string[]) => ["rewards", { storeIds }],
    byId: (rewardId: Id) => ["rewards", { rewardId }],
  },
  progress: {
    all: ["progress"],
    byUser: (userId: Id) => ["progress", { userId }],
    byUserStore: (userId: Id, storeId: Id) => ["progress", "byStore", { userId, storeId }],
  },
  givenRewards: {
    all: ["givenRewards"],
    byUser: (userId: Id) => ["givenRewards", { userId }],
    byUserStore: (userId: Id, storeId: Id) => ["givenRewards", "byStore", { userId, storeId }],
  },
  purchaseLog: {
    all: ["purchaseLog"],
    byUserStore: (userId: Id, storeId: Id) => ["purchaseLog", { userId, storeId }],
  },
  promotions: {
    all: ["promotions"],
    byStores: (storeIds: string[]) => ["promotions", { storeIds }],
  },
  history: {
    all: ["history"],
    byUserStore: (userId: Id, storeId: Id) => ["history", { userId, storeId }],
  },
  wheelSlices: {
    all: ["wheelSlices"],
    byStore: (storeId: Id) => ["wheelSlices", { storeId }],
  },
  wheelSpins: {
    all: ["wheelSpins"],
    byUserStore: (userId: Id, storeId: Id) => ["wheelSpins", { userId, storeId }],
  },
}
