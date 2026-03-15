import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"
import { createConfig, http } from "wagmi"
import { arbitrum } from "wagmi/chains"

export const wagmiConfig = createConfig({
  chains: [arbitrum],
  connectors: [farcasterMiniApp()],
  transports: {
    [arbitrum.id]: http(
      process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ?? "https://arb1.arbitrum.io/rpc"
    ),
  },
  ssr: true,
})
