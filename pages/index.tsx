/** @jsxImportSource theme-ui */
import { Flex, Text,Progress, Heading, Spinner, Button, Container } from "theme-ui"

import CollectionItem from "@/components/CollectionItem/CollectionItem"
import useGemFarmStaking from "hooks/useGemFarmStaking"
import { useWallet } from "@solana/wallet-adapter-react"
// import { LoadingIcon } from "@/components/icons/LoadingIcon"

import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import Header from "@/components/Header/Header"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { useEffect, useState } from "react"

const StakePage = () => {
  const [farmId, setFarmId] = useState(process.env.NEXT_PUBLIC_GEMFARM_ID || "")

  const {
    walletNFTs,
    farmerAccount,
    farmerVaultAccount,
    farmerStatus,
    selectedWalletItems,
    isLocked,
    availableA,
    availableB,
    feedbackStatus,
    handleStakeButtonClick,
    handleUnstakeButtonClick,
    handleClaimButtonClick,
    handleWalletItemClick,
    handleMoveToVaultButtonClick,
    farmerVaultNFTs,
    selectedVaultItems,
    handleMoveToWalletButtonClick,
    handleVaultItemClick,
    handleInitStakingButtonClick,
    handleRefreshRewardsButtonClick,
    farmAccount
  } = useGemFarmStaking(farmId)

  const { publicKey } = useWallet()
  // console.log("public keyyyyyyy: ",publicKey.toString())
  console.log("farmAccount: ",farmAccount)
  const [solPrice,setSolPrice] = useState(null)


  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`)
    .then((response) => response.json().then((jsonData)=>{
      console.log("solana price :",jsonData.solana.usd)
      setSolPrice(jsonData.solana.usd)
    }));
  }, []);


  return (
    <Container>
      <Header farmId={farmId} setFarmId={setFarmId} />

      <Flex
        sx={{
          flexDirection: "column",
          marginTop: "3.2rem",
          alignItems: "center",
          padding: "0 1.6rem",
        }}
      >
        {/* <Heading>Your staking account</Heading> */}
        <Heading sx={{fontSize:"30px"}}>Stake to earn $DS</Heading>
        {/* <Text>Below you can stake, unstake and collect rewards.</Text> */}

        {!publicKey ? (
          /** Render nothing if there is no wallet connected. */
          <Text
            sx={{
              textAlign: "center",
              margin: "3.2rem 0",
            }}
          >
            Connect your wallet first.
          </Text>
        ) : !farmerAccount ? (
          // <LoadingIcon
          //   size={"3.2rem"}
          //   sx={{
          //     margin: "3.2rem 0"
          //   }}
          // />
          <Text mt="1.6rem">Farm ID is not configured.</Text>
        ) : /** If there is farmerAccount variable, but no address, it means account isn't initialized */
        farmerAccount && !farmerAccount?.identity ? (
          <Button
            sx={{
              margin: "3.2rem 0",
              background:"rgba(248,199,140,255)",
              color:"#cc0e52",
              fontSize:"20px",
            }}
            onClick={handleInitStakingButtonClick}
          >
            Init staking account
          </Button>
        ) : (
          <>
            {/** Render everything, since there is wallet and farmer account */}
            {/** Farmer account info section */}
            {farmerAccount?.identity ? (
              <>
                <Flex
                  sx={{
                    flexDirection: "column",
                    margin: "1.6rem 0",
                  }}
                >
                  <Flex
                    sx={{
                      gap: ".4rem",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      sx={{
                        maxHeight: "2.4rem",
                      }}
                      src="images/gemtransparent.gif"
                    />
                    <Text
                      sx={{fontSize:"20px"}}
                    >
                      NFTs staked:&nbsp;
                      {farmerAccount?.gemsStaked.toNumber()}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      gap: ".4rem",
                      alignItems: "center",
                      justifyContent: "center",
                      margin:"10px"
                    }}
                  >
                    <img
                      sx={{
                        maxHeight: "2.4rem",
                      }}
                      src="images/gemtransparent.gif"
                    />
                    {
                      farmAccount && (
                        <>
                      <Text
                      sx={{fontSize:"20px"}}
                    >
                      Total NFTs staked:&nbsp;
                      {farmAccount?.gemsStaked.toNumber()}/50
                    </Text>
                    </>
                    )
                    }
                    </Flex>
                    <Flex
                    sx={{
                      gap: ".4rem",
                      alignItems: "center",
                      justifyContent: "center",
                      margin:"10px"
                    }}
                  >
                    {
                      farmAccount && (
                        <>
                    <Progress max={1} value={farmAccount?.gemsStaked.toNumber()/50} sx={{width:"500px",color:"pink"}}>
                      </Progress>
                    </>
                    )
                    }
                    </Flex>
                    <Text
                    sx={{
                      textAlign: "center",
                      fontSize:"20px",
                      margin:"10px"
                    }}
                  >
                    TVL: <b>${(farmAccount?.gemsStaked.toNumber() * solPrice).toFixed(2)}</b>
                    <br />
                  </Text>
                  <Text
                    sx={{
                      textAlign: "center",
                      fontSize:"20px"
                    }}
                  >
                    Vault state: <b>{isLocked ? "locked" : "unlocked"}</b>
                    <br />
                  </Text>
                  <Text
                    sx={{
                      textAlign: "center",
                      fontSize:"20px"
                    }}
                  >
                    Account status: <b>{farmerStatus}</b>
                    <br />
                  </Text>
                </Flex>

                <Flex
                  sx={{
                    gap: "1.6rem",
                    margin: "1.6rem 0",
                    flexWrap: "wrap",
                    alignItems: "center",
                    alignSelf: "stretch",
                    justifyContent: "center",

                    "@media (min-width: 768px": {
                      flexDirection: "row",
                    },
                  }}
                >
                  <Button
                    onClick={handleClaimButtonClick}
                    disabled={!Number(availableA)}
                    sx={{
                      background:"rgba(248,199,140,255)",
                        color:"#cc0e52",
                        fontSize:"20px"
                    }}
                  >
                    Claim{" "}
                    <img
                      sx={{
                        margin: "0 .4rem 0 .8rem",
                        maxHeight: "2.4rem",
                      }}
                      src="images/icon-list-item.png"
                    />
                    {availableA ? (
                      <b>{(availableA / 1000000000).toFixed(2)}</b>
                    ) : (
                      0
                    )}
                  </Button>

                      {/* reward b */}
                  <Button
                    onClick={handleClaimButtonClick}
                    disabled={!Number(availableB)}
                    sx={{
                      background:"rgba(201,55,173,255)",
                      fontSize:"20px"
                    }}
                  >
                    Claim{" "}
                    <img
                      sx={{
                        margin: "0 .4rem 0 .8rem",
                        maxHeight: "2.4rem",
                      }}
                      src="images/solana-sol-logo.png"
                    />
                    {availableB ? (
                      // <b>{(availableB / 1000000000).toFixed(2)}</b>
                      <b>{availableB}</b>
                    ) : (
                      0
                    )}
                  </Button>


                  <Button onClick={handleRefreshRewardsButtonClick} sx={{
                    background:"rgba(248,199,140,255)",
                        color:"#cc0e52",
                        fontSize:"20px"}}>
                    Refresh
                  </Button>
                </Flex>
                <Flex
                  sx={{
                    alignItems: "center",
                    gap: ".8rem",
                    margin: ".8rem 0",
                  }}
                >
                  {feedbackStatus ? (
                    <>
                      <LoadingIcon size="1.6rem" />
                      {"  "} <Text variant="small">{feedbackStatus}</Text>
                    </>
                  ) : (
                    ""
                  )}
                  &nbsp;
                </Flex>
              </>
            ) : null}

            <Tabs
              sx={{
                margin: "3.2rem 0",
                alignSelf: "stretch",
                minHeight: "48rem",
              }}
            >
              <TabList>
                <Tab
                  style={{
                    background:"rgba(201,55,173,255)",
                      fontSize:"20px"
                  }}
                >
                  Your wallet
                </Tab>
                <Tab
                  style={{
                    background:"rgba(248,199,140,255)",
                    color:"#cc0e52",
                    fontSize:"20px",
                    borderRadius:'5%',
                    marginLeft:"2%"
                  }}
                >
                  Your vault
                </Tab>
              </TabList>

              <TabPanel>
                {walletNFTs ? (
                  walletNFTs.length ? (
                    <Flex
                      sx={{
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            walletNFTs.length > 1 ? "1fr 1fr" : "1fr",
                          gap: "1.6rem",
                          alignItems: "center",

                          "@media (min-width: 768px)": {
                            gridTemplateColumns:
                              walletNFTs.length > 9
                                ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                                : walletNFTs.length > 4
                                ? "1fr 1fr 1fr 1fr 1fr"
                                : walletNFTs.map(() => "1fr").join(" "),
                          },
                        }}
                      >
                        {walletNFTs.map((item) => {
                          console.log(item)
                          const isSelected = selectedWalletItems.find(
                            (NFT) =>
                              NFT.onchainMetadata.mint ===
                              item.onchainMetadata.mint
                          )

                          return (
                            <CollectionItem
                              key={item.onchainMetadata.mint}
                              item={item}
                              onClick={
                                !isLocked ? handleWalletItemClick : () => {console.log("some shit");true}
                              }
                              sx={{
                                maxWidth: "16rem",
                                "> img": {
                                  border: "5px solid ",
                                  borderColor: isSelected
                                    ? "rgba(201,55,173,255)"
                                    : "transparent",
                                },
                              }}
                            />
                          )
                        })}
                      </div>
                      {walletNFTs.length && !isLocked ? (
                        <Text
                          sx={{
                            margin: "3.2rem 0 .8rem 0",
                            fontSize:"30px"
                          }}
                          variant="small"
                        >
                          Select NFTs to Stake.
                        </Text>
                      ) : null}
                      <Text>
                        {/* Selected:{" "}
                    {selectedWalletItems && selectedWalletItems.length
                      ? selectedWalletItems
                          .map((NFT) => NFT.onchainMetadata.metaData.data.name)
                          .join(", ")
                      : null} */}
                        {selectedWalletItems?.length && !isLocked ? (
                          <Button onClick={async ()=>{await handleMoveToVaultButtonClick();await handleStakeButtonClick()}} sx={{background:"rgba(201,55,173,255)",fontSize:"30px"}}>
                            {/* Deposit to Vault */}
                            Stake
                          </Button>
                        ) : null}
                      </Text>
                    </Flex>
                  ) : (
                    /** walletNFTs fetched but array is empty, means current wallet has no NFT. */
                    <Flex
                      sx={{
                        justifyContent: "center",
                        alignSelf: "stretch",
                      }}
                    >
                      <Text>There are no NFTs on your wallet.</Text>
                    </Flex>
                  )
                ) : /** No walletNFTs and public key, means it is loading */
                publicKey ? (
                  <Flex
                    sx={{
                      justifyContent: "center",
                      alignSelf: "stretch",
                    }}
                  >
                    <Spinner variant="styles.spinnerLarge" />
                  </Flex>
                ) : null}
              </TabPanel>
              <TabPanel>
                {farmerVaultAccount ? (
                  <>
                    {/** Vault UI section */}
                    {/* <ThemeHeading
                  variant="heading3"
                  sx={{
                    marginTop: "3.2rem",
                    textAlign: "center"
                  }}
                >
                  Your Vault
                </ThemeHeading> */}

                    {farmerVaultNFTs ? (
                      farmerVaultNFTs.length ? (
                        <Flex
                          sx={{
                            flexDirection: "column",
                            justifyContent: "center",
                            alignSelf: "stretch",
                            alignItems: "center",
                          }}
                        >
                          <div
                            sx={{
                              display: "grid",
                              gridTemplateColumns:
                                farmerVaultNFTs.length > 1 ? "1fr 1fr" : "1fr",
                              gap: "1.6rem",

                              "@media (min-width: 768px)": {
                                gridTemplateColumns:
                                  farmerVaultNFTs.length > 9
                                    ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                                    : farmerVaultNFTs.length > 4
                                    ? "1fr 1fr 1fr 1fr 1fr"
                                    : farmerVaultNFTs
                                        .map(() => "1fr")
                                        .join(" "),
                              },
                            }}
                          >
                            {farmerVaultNFTs.map((item) => {
                              const isSelected = selectedVaultItems.find(
                                (NFT) =>
                                  NFT.onchainMetadata.mint ===
                                  item.onchainMetadata.mint
                              )

                              return (
                                <CollectionItem
                                  key={item.onchainMetadata.mint}
                                  item={item}
                                  onClick={
                                    // !isLocked
                                    isLocked
                                      ? handleVaultItemClick
                                      : () => true
                                  }
                                  sx={{
                                    maxWidth: "16rem",
                                    "> img": {
                                      border: "5px solid transparent",
                                      borderColor: isSelected
                                        ? "rgba(248,199,140,255)"
                                        : "transparent",
                                    },
                                  }}
                                />
                              )
                            })}
                          </div>
                          {/* {farmerVaultNFTs.length && !isLocked ? ( */}
                          {farmerVaultNFTs.length && isLocked ? (
                            <Text
                              sx={{
                                margin: "3.2rem 0 .8rem 0",

                    fontSize:"30px"
                              }}
                              variant="small"
                            >
                              Select NFTs to Unstake.
                            </Text>
                          ) : null}

                          {selectedVaultItems && selectedVaultItems.length ? (
                            <>
                              {/* Selected:{" "}
                          {selectedVaultItems
                            .map((NFT) => NFT.onchainMetadata.metaData.data.name)
                            .join(", ")} */}
                              {/* {!isLocked ? ( */}
                              {isLocked ? (
                                <Button onClick={async ()=>{await handleUnstakeButtonClick();await handleUnstakeButtonClick();await handleMoveToWalletButtonClick()}} sx={{background:"rgba(248,199,140,255)",color:"#cc0e52",fontSize:"30px",}}>
                                  {/* Withdraw selected */}
                                  Unstake
                                </Button>
                              ) : null}
                            </>
                          ) : null}
                        </Flex>
                      ) : (
                        /** vaultNFTs fetched but array is empty, means current wallet has no NFT. */
                        <Flex
                          sx={{
                            justifyContent: "center",
                            alignSelf: "stretch",
                            fontSize:"30px"
                          }}
                        >
                          {/* <Text>There are no NFTs on your vault.</Text> */}
                          <Text>0 NFTs staked</Text>
                        </Flex>
                      )
                    ) : /** No vaultNFTs and public key, means it is loading */
                    publicKey ? (
                      <Flex
                        sx={{
                          justifyContent: "center",
                          alignSelf: "stretch",
                        }}
                      >
                        <Spinner variant="styles.spinnerLarge" />
                      </Flex>
                    ) : null}
                  </>
                ) : null}
              </TabPanel>
            </Tabs>
          </>
        )}
      </Flex>
    </Container>
  )
}

export default StakePage
