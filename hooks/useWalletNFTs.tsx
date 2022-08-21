import { PublicKey } from "@solana/web3.js"
import { programs } from "@metaplex/js"
import { useEffect, useState } from "react"
import { getNFTsByOwner } from "utils/nfts"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export type NFT = {
  pubkey?: PublicKey
  mint: PublicKey
  onchainMetadata: programs.metadata.MetadataData
  externalMetadata: {
    attributes: Array<any>
    collection: any
    description: string
    edition: number
    external_url: string
    image: string
    name: string
    properties: {
      files: Array<string>
      category: string
      creators: Array<string>
    }
    seller_fee_basis_points: number
  }
}

const useWalletNFTs = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [walletNFTs, setWalletNFTs] = useState<Array<NFT>>([])

  useEffect(() => {
    const fetchNFTs = async () => {
      const NFTs = await getNFTsByOwner(publicKey, connection)
      // if(NFTs[0]){

      // }
      // console.log("LMAOOOO0 NFTs: ",NFTs[0].onchainMetadata.data.creators[0])
      const nreNfts = NFTs.filter(nft=>{return nft.onchainMetadata.data.creators[0].address == "CaYkvNwjjSB6Yvpu74Yf7dLYujWtNQvX2Uash5KWiM4K"})
      console.log("nreNFTS: ",nreNfts)
      setWalletNFTs(nreNfts)
    }

    if (publicKey) {
      fetchNFTs()
    }
  }, [publicKey])

  return { walletNFTs }
}

export default useWalletNFTs
