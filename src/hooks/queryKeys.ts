import { Id } from "@/types"

export const queryKeys = {
  store: {
    all: ["store"],
    byOwner: (userId: Id) => ["store", { userId }],
    stats: (storeId: Id) => ["store", "stats", { storeId }],
  },
  customers: {
    all: ["customers"],
    byStore: (storeId: Id) => ["customers", { storeId }],
  },
  userStores: {
    all: ["userStores"],
    byUser: (userId: Id) => ["userStores", { userId }],
    byUserStore: (userId: Id, storeId: Id) => ["userStores", { userId, storeId }],
  },
  rewards: {
    all: ["rewards"],
    byStore: (storeId: Id, activeOnly: boolean) => ["rewards", { storeId, activeOnly }],
    byId: (rewardId: Id) => ["rewards", { rewardId }],
  },
  progress: {
    all: ["progress"],
    byUserStore: (userId: Id, storeId: Id) => ["progress", { userId, storeId }],
  },
  givenRewards: {
    all: ["givenRewards"],
    byUserStore: (userId: Id, storeId: Id) => ["givenRewards", { userId, storeId }],
  },
  history: {
    all: ["history"],
    byUserStore: (userId: Id, storeId: Id) => ["history", { userId, storeId }],
  },
}
